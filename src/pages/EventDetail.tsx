import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FaClock, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaCheckCircle, FaCircle, FaUser, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../App.css';

interface Organizer {
  id: string;
  name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  company_logo_url: string | null;
}

interface Event {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  time_range: string | null;
  location: string | null;
  description: string | null;
  organisator_id: string | null;
}

interface Attendee {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  avatar_url: string | null;
  company_logo_url: string | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [togglingAttendance, setTogglingAttendance] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
      loadAttendees();
    }
  }, [id, user]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);

      // Load organizer information if available
      if (data.organisator_id) {
        const { data: organizerData, error: organizerError } = await supabase
          .from('business_club_customers')
          .select('id, name, company_name, avatar_url, company_logo_url')
          .eq('id', data.organisator_id)
          .single();

        if (!organizerError && organizerData) {
          setOrganizer({
            id: organizerData.id,
            name: organizerData.name,
            company_name: organizerData.company_name,
            avatar_url: organizerData.avatar_url,
            company_logo_url: organizerData.company_logo_url
          });
        }
      }

      // Check if user is attending
      if (user) {
        const { data: attendance } = await supabase
          .from('event_attendees')
          .select('id')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .single();

        setIsAttending(!!attendance);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendees = async () => {
    try {
      // First get all attendees for this event
      const { data: attendeeData, error: attendeeError } = await supabase
        .from('event_attendees')
        .select('id, user_id')
        .eq('event_id', id);

      if (attendeeError) throw attendeeError;

      if (!attendeeData || attendeeData.length === 0) {
        setAttendees([]);
        return;
      }

      // Get user IDs
      const userIds = attendeeData.map((a: any) => a.user_id);

      // Get customer data for these users
      const { data: customerData, error: customerError } = await supabase
        .from('business_club_customers')
        .select('auth_user_id, name, email, phone, company_name, avatar_url, company_logo_url')
        .in('auth_user_id', userIds);

      if (customerError) throw customerError;

      // Create a map of user_id to customer data
      const customerMap = new Map();
      (customerData || []).forEach((customer: any) => {
        customerMap.set(customer.auth_user_id, customer);
      });

      // Combine attendee and customer data
      const transformedAttendees: Attendee[] = attendeeData.map((attendance: any) => {
        const customer = customerMap.get(attendance.user_id);
        return {
          id: attendance.id,
          user_id: attendance.user_id,
          name: customer?.name || null,
          email: customer?.email || null,
          phone: customer?.phone || null,
          company_name: customer?.company_name || null,
          avatar_url: customer?.avatar_url || null,
          company_logo_url: customer?.company_logo_url || null,
        };
      });

      setAttendees(transformedAttendees);
    } catch (error) {
      console.error('Error loading attendees:', error);
    }
  };

  const toggleAttendance = async () => {
    if (!user || !id) return;

    setTogglingAttendance(true);

    try {
      if (isAttending) {
        // Remove attendance
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsAttending(false);
      } else {
        // Add attendance
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: id,
            user_id: user.id
          });

        if (error) throw error;
        setIsAttending(true);
      }

      // Reload attendees
      await loadAttendees();
    } catch (error) {
      console.error('Error toggling attendance:', error);
    } finally {
      setTogglingAttendance(false);
    }
  };

  const formatTime = () => {
    if (!event) return 'Tijd wordt later bekendgemaakt';
    
    if (event.time_range) {
      return event.time_range;
    }
    
    if (event.start_time && event.end_time) {
      const startTime = event.start_time.substring(0, 5);
      const endTime = event.end_time.substring(0, 5);
      return `${startTime} - ${endTime}`;
    }
    
    return 'Tijd wordt later bekendgemaakt';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Evenement niet gevonden</h2>
          <button
            onClick={() => navigate('/agenda')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Terug naar agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white py-8 sm:py-12 md:py-16 border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate('/agenda')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Terug naar agenda</span>
          </button>
          
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {event.title}
            </h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gray-300 mb-4 sm:mb-6"
            />

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center text-gray-700">
                <FaClock className="mr-2 sm:mr-3 text-gray-500 flex-shrink-0" size={16} />
                <span className="text-sm sm:text-base md:text-lg break-words">{formatTime()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 sm:mr-3 text-red-500 flex-shrink-0" size={16} />
                <span className="text-sm sm:text-base md:text-lg break-words">{event.location || 'Locatie wordt later bekendgemaakt'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaUsers className="mr-2 sm:mr-3 text-blue-500 flex-shrink-0" size={16} />
                <span className="text-sm sm:text-base md:text-lg">
                  {attendees.length} {attendees.length === 1 ? 'persoon' : 'personen'} aanwezig
                </span>
              </div>
              {organizer && (
                <div 
                  className={`flex items-start sm:items-center text-gray-700 ${user ? 'cursor-pointer hover:text-gray-900 transition-colors' : ''}`}
                  onClick={() => user && navigate(`/leden/${organizer.id}`)}
                >
                  <FaUser className="mr-2 sm:mr-3 text-purple-500 flex-shrink-0 mt-1 sm:mt-0" size={16} />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    {organizer.avatar_url && (
                      <img 
                        src={organizer.avatar_url} 
                        alt={organizer.name || ''} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    )}
                    <div>
                      <span className="text-sm sm:text-base md:text-lg">
                        Georganiseerd door: <span className="font-medium">{organizer.name || organizer.company_name || 'Onbekend'}</span>
                      </span>
                      {organizer.company_name && organizer.name && (
                        <span className="text-xs sm:text-sm text-gray-500 block sm:inline sm:ml-2">{organizer.company_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {user && (
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={toggleAttendance}
                  disabled={togglingAttendance}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors w-full sm:w-auto text-sm sm:text-base ${
                    isAttending
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  } ${togglingAttendance ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAttending ? (
                    <>
                      <FaCheckCircle />
                      <span className="font-medium">Ik ben aanwezig</span>
                    </>
                  ) : (
                    <>
                      <FaCircle />
                      <span className="font-medium">Ik ben aanwezig</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Attendees Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Aanwezigen ({attendees.length})
          </h2>

          {attendees.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FaUsers className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                Nog niemand heeft zich aangemeld voor dit evenement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {attendees.map((attendee, index) => (
                <motion.div
                  key={attendee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {attendee.avatar_url ? (
                          <img 
                            src={attendee.avatar_url} 
                            alt={attendee.name || ''} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-2xl text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {attendee.company_name && (
                        <div className="mb-2">
                          {attendee.company_logo_url ? (
                            <img
                              src={attendee.company_logo_url}
                              alt={attendee.company_name}
                              className="h-8 max-w-full object-contain mb-1"
                            />
                          ) : (
                            <div className="flex items-center gap-2 mb-1">
                              <FaBuilding className="text-gray-400" size={14} />
                              <h3 className="font-semibold text-gray-900 truncate">
                                {attendee.company_name}
                              </h3>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {attendee.name && (
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {attendee.name}
                        </p>
                      )}

                      <div className="space-y-1">
                        {attendee.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FaEnvelope className="text-gray-400" size={12} />
                            <span className="truncate">{attendee.email}</span>
                          </div>
                        )}
                        {attendee.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FaPhone className="text-gray-400" size={12} />
                            <span>{attendee.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default EventDetail;
