import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaBuilding, FaFilter, FaSort } from 'react-icons/fa';
import '../App.css';

interface Member {
  id: string;
  company_name: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  company_logo_url: string | null;
  avatar_url: string | null;
  store: string;
  tags: string[] | null;
}

const Leden = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterAndSortMembers();
  }, [members, selectedTag, sortOrder]);

  const handleMemberClick = (memberId: string) => {
    if (user) {
      navigate(`/leden/${memberId}`);
    }
  };

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('business_club_customers')
        .select('id, company_name, name, email, phone, website, description, company_logo_url, avatar_url, store, tags')
        .order('company_name', { ascending: true });

      if (error) throw error;

      const membersData = data || [];
      setMembers(membersData);
      
      // Extract all unique tags
      const allTags = new Set<string>();
      membersData.forEach((member) => {
        if (member.tags && Array.isArray(member.tags)) {
          member.tags.forEach((tag) => allTags.add(tag));
        }
      });
      setAvailableTags(Array.from(allTags).sort());
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMembers = () => {
    let filtered = [...members];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((member) => 
        member.tags && member.tags.includes(selectedTag)
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => {
      const nameA = a.company_name.toLowerCase();
      const nameB = b.company_name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setFilteredMembers(filtered);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
            AL ONZE LEDEN
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="luxury-divider mx-auto"
          />
          <p className="text-center text-gray-600 mt-6 sm:mt-8 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Ontdek onze exclusieve community van toonaangevende bedrijven en ondernemers
          </p>
        </div>
      </motion.div>

      {/* Filters and Sort */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaFilter />
                Filter op tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Alle tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaSort />
                Sorteer op naam
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="asc">A-Z (Oplopend)</option>
                <option value="desc">Z-A (Aflopend)</option>
              </select>
            </div>
          </div>
          {selectedTag && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'lid' : 'leden'} gevonden met tag "{selectedTag}"
            </div>
          )}
        </div>
      </div>

      {/* Members Grid */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-base sm:text-lg">
              {selectedTag ? `Geen leden gevonden met tag "${selectedTag}"` : 'Nog geen leden beschikbaar.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                isLoggedIn={!!user}
                onClick={() => handleMemberClick(member.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface MemberCardProps {
  member: Member;
  index: number;
  isLoggedIn: boolean;
  onClick: () => void;
}

const MemberCard = ({ member, index, isLoggedIn, onClick }: MemberCardProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(member.avatar_url || null);

  useEffect(() => {
    setAvatarUrl(member.avatar_url || null);
  }, [member.avatar_url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={isLoggedIn ? onClick : undefined}
      className={`bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100 flex flex-col ${
        isLoggedIn ? 'cursor-pointer hover:shadow-lg transition-all duration-300' : ''
      }`}
      whileHover={isLoggedIn ? { scale: 1.02, y: -5 } : {}}
    >
      {/* Company Logo */}
      <div className="flex justify-center mb-3 sm:mb-4 h-20 sm:h-24">
        {member.company_logo_url ? (
          <img
            src={member.company_logo_url}
            alt={member.company_name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <FaBuilding className="text-3xl sm:text-4xl text-gray-400" />
          </div>
        )}
      </div>

      {/* Company Name */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 text-center">
        {member.company_name}
      </h3>

      {/* Representative Photo - Only show when logged in */}
      {isLoggedIn && (
        <>
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
              {avatarUrl ? (
                <img src={avatarUrl} alt={member.name || ''} className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-xl sm:text-2xl text-gray-400" />
              )}
            </div>
          </div>

          {/* Representative Name */}
          {member.name && (
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-2">
              {member.name}
            </p>
          )}
        </>
      )}

      {/* Tags */}
      {member.tags && member.tags.length > 0 && (
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap gap-1 justify-center">
            {member.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300"
              >
                {tag}
              </span>
            ))}
            {member.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                , ... (+{member.tags.length - 3})
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Leden;
