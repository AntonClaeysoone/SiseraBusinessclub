import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaCalendar, FaArrowLeft, FaTag } from 'react-icons/fa';
import '../App.css';

interface Member {
  id: string;
  company_name: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  description: string | null;
  company_logo_url: string | null;
  avatar_url: string | null;
  store: string;
  datum: string | null;
  geboortedatum: string | null;
  tags: string[] | null;
}

const LidDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && id) {
      loadMember(id);
    }
  }, [id, user, authLoading, navigate]);

  const loadMember = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_club_customers')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error) throw error;

      setMember(data);
      
      // Use avatar_url from database if available
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      } else if (data.auth_user_id) {
        // Fallback: try to load from storage
        try {
          const { data: avatarData } = await supabase.storage
            .from('avatars')
            .getPublicUrl(`${data.auth_user_id}/avatar.png`);
          
          if (avatarData?.publicUrl) {
            const response = await fetch(avatarData.publicUrl);
            if (response.ok) {
              setAvatarUrl(avatarData.publicUrl);
            }
          }
        } catch (error) {
          console.error('Error loading avatar:', error);
        }
      }
    } catch (error) {
      console.error('Error loading member:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lid niet gevonden</h2>
          <button
            onClick={() => navigate('/leden')}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Terug naar leden
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
        className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate('/leden')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Terug naar leden</span>
          </button>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Company Logo */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="w-full sm:w-40 md:w-48 h-40 sm:h-40 md:h-48 bg-white rounded-lg shadow-lg p-4 sm:p-6 flex items-center justify-center border-2 border-gray-200 mx-auto sm:mx-0">
                {member.company_logo_url ? (
                  <img
                    src={member.company_logo_url}
                    alt={member.company_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <FaBuilding className="text-4xl sm:text-5xl md:text-6xl text-gray-400" />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                {member.company_name}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="luxury-divider mb-3 sm:mb-4 mx-auto md:mx-0"
              />
              
              {/* Representative */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={member.name || ''} className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-3xl sm:text-4xl text-gray-400" />
                  )}
                </div>
                <div>
                  {member.name && (
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {member.name}
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Bedrijfsinformatie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {member.description && (
              <div className="md:col-span-2">
                <h3 className="text-sm uppercase text-gray-500 mb-2 tracking-wide flex items-center gap-2">
                  Beschrijving
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {member.description}
                </p>
              </div>
            )}

            {member.email && (
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Email</div>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            )}

            {member.phone && (
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Telefoon</div>
                  <a
                    href={`tel:${member.phone}`}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    {member.phone}
                  </a>
                </div>
              </div>
            )}

            {member.website && (
              <div className="flex items-start gap-3">
                <FaGlobe className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Website</div>
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors underline"
                  >
                    {member.website}
                  </a>
                </div>
              </div>
            )}

            {member.company && (
              <div className="flex items-start gap-3">
                <FaBuilding className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Bedrijf</div>
                  <div className="text-sm font-medium text-gray-900">
                    {member.company}
                  </div>
                </div>
              </div>
            )}

            {member.datum && (
              <div className="flex items-start gap-3">
                <FaCalendar className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Datum</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(member.datum)}
                  </div>
                </div>
              </div>
            )}

            {member.geboortedatum && (
              <div className="flex items-start gap-3">
                <FaCalendar className="text-gray-400 mt-1" />
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Geboortedatum</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(member.geboortedatum)}
                  </div>
                </div>
              </div>
            )}

            {member.tags && member.tags.length > 0 && (
              <div className="md:col-span-2 flex items-start gap-3">
                <FaTag className="text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="text-xs uppercase text-gray-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {member.tags.length > 3 && (
                      <span className="px-3 py-1 text-gray-600 text-sm">
                        , ... (+{member.tags.length - 3} meer)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LidDetail;
