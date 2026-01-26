import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaCircle, FaUser } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface Organizer {
  id: string;
  name: string | null;
  company_name: string | null;
  avatar_url: string | null;
}

interface Event {
  id: string;
  day: number;
  month: string;
  title: string;
  time: string;
  location: string;
  attendeeCount: number;
  isAttending: boolean;
  organizer: Organizer | null;
}

interface DatabaseEvent {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  time_range: string | null;
  location: string | null;
  description: string | null;
  is_active: boolean;
  organisator_id: string | null;
}

const Agenda = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingAttendance, setTogglingAttendance] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, start_time, end_time, time_range, location, description, is_active, organisator_id')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Load attendee counts and user's attendance status
      const eventIds = (data || []).map((e: DatabaseEvent) => e.id);
      
      // Get attendee counts
      const { data: attendeeCounts } = await supabase
        .from('event_attendees')
        .select('event_id')
        .in('event_id', eventIds);

      const countMap = new Map<string, number>();
      (attendeeCounts || []).forEach((attendance: { event_id: string }) => {
        countMap.set(attendance.event_id, (countMap.get(attendance.event_id) || 0) + 1);
      });

      // Get user's attendance status if logged in
      const userAttendanceSet = new Set<string>();
      if (user) {
        const { data: userAttendances } = await supabase
          .from('event_attendees')
          .select('event_id')
          .eq('user_id', user.id)
          .in('event_id', eventIds);

        (userAttendances || []).forEach((attendance: { event_id: string }) => {
          userAttendanceSet.add(attendance.event_id);
        });
      }

      // Get organizer information
      const organizerIds = (data || [])
        .map((e: DatabaseEvent) => e.organisator_id)
        .filter((id): id is string => id !== null);
      
      const organizerMap = new Map<string, Organizer>();
      if (organizerIds.length > 0) {
        const { data: organizers } = await supabase
          .from('business_club_customers')
          .select('id, name, company_name, avatar_url')
          .in('id', organizerIds);

        (organizers || []).forEach((org: any) => {
          organizerMap.set(org.id, {
            id: org.id,
            name: org.name,
            company_name: org.company_name,
            avatar_url: org.avatar_url
          });
        });
      }

      // Transform database events to display format
      const transformedEvents: Event[] = (data || []).map((dbEvent: DatabaseEvent) => {
        const eventDate = new Date(dbEvent.event_date);
        const day = eventDate.getDate();
        
        // Get month name in Dutch uppercase
        const monthNames = [
          'JANUARI', 'FEBRUARI', 'MAART', 'APRIL', 'MEI', 'JUNI',
          'JULI', 'AUGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER'
        ];
        const month = monthNames[eventDate.getMonth()];

        // Determine time display: use time_range if available, otherwise construct from start_time/end_time
        let time = dbEvent.time_range || '';
        if (!time && dbEvent.start_time && dbEvent.end_time) {
          // Extract time part (HH:MM) from TIME strings
          const startTime = dbEvent.start_time.substring(0, 5);
          const endTime = dbEvent.end_time.substring(0, 5);
          time = `${startTime}-${endTime}`;
        }
        if (!time) {
          time = 'Tijd wordt later bekendgemaakt';
        }

        return {
          id: dbEvent.id,
          day,
          month,
          title: dbEvent.title,
          time,
          location: dbEvent.location || 'Locatie wordt later bekendgemaakt',
          attendeeCount: countMap.get(dbEvent.id) || 0,
          isAttending: userAttendanceSet.has(dbEvent.id),
          organizer: dbEvent.organisator_id ? organizerMap.get(dbEvent.organisator_id) || null : null
        };
      });

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (eventId: string, currentlyAttending: boolean) => {
    if (!user) return;

    setTogglingAttendance(prev => new Set(prev).add(eventId));

    try {
      if (currentlyAttending) {
        // Remove attendance
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add attendance
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Reload events to update counts and status
      await loadEvents();
    } catch (error) {
      console.error('Error toggling attendance:', error);
    } finally {
      setTogglingAttendance(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const getMonthColor = (month: string) => {
    const colors: { [key: string]: string } = {
      'DECEMBER': 'text-gray-800',
      'FEBRUARI': 'text-gray-800',
      'MEI': 'text-gray-800',
      'JUNI': 'text-gray-800',
    };
    return colors[month] || 'text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
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
        className="bg-white py-12 sm:py-16 md:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
            AGENDA - 2025-2026
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gray-300 mx-auto mb-4 sm:mb-6"
          />
          <p className="text-center text-gray-600 text-base sm:text-lg mb-4 sm:mb-6">
            Bekijk hieronder onze opkomende evenementen.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-px bg-gray-300 mx-auto"
          />
        </div>
      </motion.div>

      {/* Events List */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Date Section */}
                <div className="flex flex-row sm:flex-col items-center sm:items-center justify-center sm:justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-[100px] sm:min-w-[120px]">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-none">
                    {event.day}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium uppercase tracking-wide sm:mt-2 ml-2 sm:ml-0 ${getMonthColor(event.month)}`}>
                    {event.month}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3">
                    <h3 
                      className="text-xl sm:text-2xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors flex-1"
                      onClick={() => navigate(`/agenda/${event.id}`)}
                    >
                      {event.title}
                    </h3>
                    {user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAttendance(event.id, event.isAttending);
                        }}
                        disabled={togglingAttendance.has(event.id)}
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                          event.isAttending
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${togglingAttendance.has(event.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {event.isAttending ? (
                          <>
                            <FaCheckCircle />
                            <span className="font-medium">Aanwezig</span>
                          </>
                        ) : (
                          <>
                            <FaCircle />
                            <span className="font-medium">Ik ben aanwezig</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="w-16 h-px bg-gray-300 mb-3 sm:mb-4" />
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 sm:mr-3 text-gray-500 flex-shrink-0" size={16} />
                      <span className="text-xs sm:text-sm break-words">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 sm:mr-3 text-red-500 flex-shrink-0" size={16} />
                      <span className="text-xs sm:text-sm break-words">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 sm:mr-3 text-blue-500 flex-shrink-0" size={16} />
                      <span className="text-xs sm:text-sm">
                        {event.attendeeCount} {event.attendeeCount === 1 ? 'persoon' : 'personen'} aanwezig
                      </span>
                    </div>
                    {event.organizer && (
                      <div 
                        className="flex items-center text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
                        onClick={() => user && navigate(`/leden/${event.organizer!.id}`)}
                      >
                        <FaUser className="mr-2 sm:mr-3 text-purple-500 flex-shrink-0" size={16} />
                        <span className="text-xs sm:text-sm">
                          Georganiseerd door: <span className="font-medium">{event.organizer.name || event.organizer.company_name || 'Onbekend'}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/agenda/${event.id}`)}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                  >
                    Bekijk details en aanwezigen →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State (if no events) */}
        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Er zijn momenteel geen geplande evenementen.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Agenda;



