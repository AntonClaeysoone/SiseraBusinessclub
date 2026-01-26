import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSave, FaCamera, FaLock, FaEnvelope, FaBirthdayCake, FaBuilding, FaTrash } from 'react-icons/fa';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Profile fields
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [store, setStore] = useState('sisera');
  const [datum, setDatum] = useState('');
  const [geboortedatum, setGeboortedatum] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Available tags
  const availableTags = [
    'Retail',
    'E-commerce',
    'Horeca',
    'Hospitality',
    'Voeding & Dranken',
    'Beauty & Wellness',
    'Mode & Kleding',
    'Technologie / IT',
    'Softwareontwikkeling',
    'Marketing & Advertentie',
    'Consultancy',
    'Vastgoed',
    'Bouw & Renovatie',
    'Automotive',
    'Logistiek & Transport',
    'Onderwijs & Training',
    'Financiële Diensten',
    'Juridische Diensten',
    'Creatieve Industrie',
    'Event & Entertainment',
    'Kunst & Design',
    'Multimedia / Video / Foto',
    'Reclame & Print',
    'Non-profit / Vereniging',
    'Industrie & Productie',
    'Tuin & Landscaping',
    'Medische Sector',
    'HR & Rekrutering',
    'Toerisme & Reizen',
    'Energie & Duurzaamheid',
  ];
  
  // Password change fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPhoto();
      loadLogo();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_club_customers')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setCompanyName(data.company_name || '');
        setName(data.name || '');
        setEmail(data.email || user.email || '');
        setNewEmail(data.email || user.email || '');
        setPhone(data.phone || '');
        setCompany(data.company || '');
        setWebsite(data.website || '');
        setDescription(data.description || '');
        setStore(data.store || 'sisera');
        setDatum(data.datum || '');
        setGeboortedatum(data.geboortedatum || '');
        setLogoUrl(data.company_logo_url || null);
        setPhotoUrl(data.avatar_url || null);
        setTags(data.tags || []);
      } else {
        setEmail(user.email || '');
        setNewEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPhoto = async () => {
    if (!user) return;
    
    // First try to load from database
    try {
      const { data: customerData } = await supabase
        .from('business_club_customers')
        .select('avatar_url')
        .eq('auth_user_id', user.id)
        .single();
      
      if (customerData?.avatar_url) {
        // Add cache-busting query parameter if not already present
        const url = customerData.avatar_url.includes('?') 
          ? customerData.avatar_url 
          : `${customerData.avatar_url}?t=${Date.now()}`;
        setPhotoUrl(url);
        return;
      }
    } catch (error) {
      console.error('Error loading avatar from database:', error);
    }
    
    // Fallback to storage
    try {
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/avatar.png`);
      
      if (data?.publicUrl) {
        setPhotoUrl(data.publicUrl);
      }
    } catch (error) {
      console.error('Error loading photo:', error);
    }
  };

  const loadLogo = async () => {
    if (!user) return;
    
    // First try to load from database
    try {
      const { data: customerData } = await supabase
        .from('business_club_customers')
        .select('company_logo_url')
        .eq('auth_user_id', user.id)
        .single();
      
      if (customerData?.company_logo_url) {
        // Add cache-busting query parameter if not already present
        const url = customerData.company_logo_url.includes('?') 
          ? customerData.company_logo_url 
          : `${customerData.company_logo_url}?t=${Date.now()}`;
        setLogoUrl(url);
        return;
      }
    } catch (error) {
      console.error('Error loading logo from database:', error);
    }
    
    // Fallback to storage
    try {
      const { data } = await supabase.storage
        .from('company-logos')
        .getPublicUrl(`${user.id}/logo.png`);
      
      if (data?.publicUrl) {
        // Check if file actually exists by trying to fetch it
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setLogoUrl(data.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validate file size (5MB limit)
    if (file.size > 5242880) {
      setMessage({ type: 'error', text: 'Bestand is te groot. Maximum grootte is 5MB.' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Alleen afbeeldingen zijn toegestaan.' });
      return;
    }

    setUploadingPhoto(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, provide helpful error message
        if (uploadError.message.includes('Bucket') || uploadError.message.includes('not found')) {
          throw new Error('Storage bucket bestaat niet. Voer setup_storage_buckets.sql uit in Supabase.');
        }
        throw uploadError;
      }

      // Get public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        // Add cache-busting query parameter to force browser reload
        const cacheBustedUrl = `${data.publicUrl}?t=${Date.now()}`;
        setPhotoUrl(cacheBustedUrl);
        
        // Save avatar URL to database (without cache-busting param)
        const { error: updateError } = await supabase
          .from('business_club_customers')
          .update({ avatar_url: data.publicUrl })
          .eq('auth_user_id', user.id);

        if (updateError) {
          // If update fails, try upsert instead
          const { error: upsertError } = await supabase
            .from('business_club_customers')
            .upsert({
              auth_user_id: user.id,
              avatar_url: data.publicUrl,
            }, {
              onConflict: 'auth_user_id'
            });
          
          if (upsertError) {
            console.error('Failed to save avatar_url to database:', upsertError);
            throw upsertError;
          }
        }

        // Reload profile to ensure state is in sync
        await loadProfile();
        
        setMessage({ type: 'success', text: 'Foto succesvol geüpload!' });
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Fout bij uploaden foto' });
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validate file size (5MB limit)
    if (file.size > 5242880) {
      setMessage({ type: 'error', text: 'Bestand is te groot. Maximum grootte is 5MB.' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Alleen afbeeldingen zijn toegestaan.' });
      return;
    }

    setUploadingLogo(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${user.id}/logo.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, provide helpful error message
        if (uploadError.message.includes('Bucket') || uploadError.message.includes('not found')) {
          throw new Error('Storage bucket bestaat niet. Voer setup_storage_buckets.sql uit in Supabase.');
        }
        throw uploadError;
      }

      // Get public URL
      const { data } = await supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        // Add cache-busting query parameter to force browser reload
        const cacheBustedUrl = `${data.publicUrl}?t=${Date.now()}`;
        setLogoUrl(cacheBustedUrl);
        
        // Save logo URL to database (without cache-busting param)
        const { error: updateError } = await supabase
          .from('business_club_customers')
          .update({ company_logo_url: data.publicUrl })
          .eq('auth_user_id', user.id);

        if (updateError) {
          // If update fails, try upsert instead
          const { error: upsertError } = await supabase
            .from('business_club_customers')
            .upsert({
              auth_user_id: user.id,
              company_logo_url: data.publicUrl,
            }, {
              onConflict: 'auth_user_id'
            });
          
          if (upsertError) {
            console.error('Failed to save company_logo_url to database:', upsertError);
            throw upsertError;
          }
        }

        // Reload profile to ensure state is in sync
        await loadProfile();
        
        setMessage({ type: 'success', text: 'Bedrijfslogo succesvol geüpload!' });
      }
    } catch (error: any) {
      console.error('Logo upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Fout bij uploaden bedrijfslogo' });
    } finally {
      setUploadingLogo(false);
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handlePhotoDelete = async () => {
    if (!user || !photoUrl) return;

    setUploadingPhoto(true);
    setMessage(null);

    try {
      // Try to extract file path from storage URL
      let filePath: string | null = null;
      
      // Check if it's a Supabase storage URL
      if (photoUrl.includes('/storage/v1/object/public/avatars/')) {
        // Extract path after 'avatars/'
        const urlParts = photoUrl.split('/avatars/');
        if (urlParts.length > 1) {
          filePath = urlParts[1].split('?')[0]; // Remove query params
        }
      }
      
      // If we couldn't extract from URL, try common file paths
      if (!filePath) {
        const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
        for (const ext of extensions) {
          const testPath = `${user.id}/avatar.${ext}`;
          // Try to list files to see if it exists
          const { data } = await supabase.storage
            .from('avatars')
            .list(user.id);
          
          if (data && data.some(f => f.name === `avatar.${ext}`)) {
            filePath = testPath;
            break;
          }
        }
      }
      
      // Delete from storage if we found a path
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
        
        // Don't throw if file doesn't exist in storage (might already be deleted)
        if (deleteError && !deleteError.message.includes('not found')) {
          console.warn('Storage delete warning:', deleteError);
        }
      }

      // Clear from database
      const { error: updateError } = await supabase
        .from('business_club_customers')
        .update({ avatar_url: null })
        .eq('auth_user_id', user.id);

      if (updateError) {
        // Try upsert if update fails
        const { error: upsertError } = await supabase
          .from('business_club_customers')
          .upsert({
            auth_user_id: user.id,
            avatar_url: null,
          }, {
            onConflict: 'auth_user_id'
          });
        
        if (upsertError) throw upsertError;
      }

      setPhotoUrl(null);
      setMessage({ type: 'success', text: 'Foto succesvol verwijderd!' });
    } catch (error: any) {
      console.error('Photo delete error:', error);
      setMessage({ type: 'error', text: error.message || 'Fout bij verwijderen foto' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!user || !logoUrl) return;

    setUploadingLogo(true);
    setMessage(null);

    try {
      // Try to extract file path from storage URL
      let filePath: string | null = null;
      
      // Check if it's a Supabase storage URL
      if (logoUrl.includes('/storage/v1/object/public/company-logos/')) {
        // Extract path after 'company-logos/'
        const urlParts = logoUrl.split('/company-logos/');
        if (urlParts.length > 1) {
          filePath = urlParts[1].split('?')[0]; // Remove query params
        }
      }
      
      // If we couldn't extract from URL, try common file paths
      if (!filePath) {
        const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
        for (const ext of extensions) {
          const testPath = `${user.id}/logo.${ext}`;
          // Try to list files to see if it exists
          const { data } = await supabase.storage
            .from('company-logos')
            .list(user.id);
          
          if (data && data.some(f => f.name === `logo.${ext}`)) {
            filePath = testPath;
            break;
          }
        }
      }
      
      // Delete from storage if we found a path
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from('company-logos')
          .remove([filePath]);
        
        // Don't throw if file doesn't exist in storage (might already be deleted)
        if (deleteError && !deleteError.message.includes('not found')) {
          console.warn('Storage delete warning:', deleteError);
        }
      }

      // Clear from database
      const { error: updateError } = await supabase
        .from('business_club_customers')
        .update({ company_logo_url: null })
        .eq('auth_user_id', user.id);

      if (updateError) {
        // Try upsert if update fails
        const { error: upsertError } = await supabase
          .from('business_club_customers')
          .upsert({
            auth_user_id: user.id,
            company_logo_url: null,
          }, {
            onConflict: 'auth_user_id'
          });
        
        if (upsertError) throw upsertError;
      }

      setLogoUrl(null);
      setMessage({ type: 'success', text: 'Bedrijfslogo succesvol verwijderd!' });
    } catch (error: any) {
      console.error('Logo delete error:', error);
      setMessage({ type: 'error', text: error.message || 'Fout bij verwijderen bedrijfslogo' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Wachtwoorden komen niet overeen' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Wachtwoord moet minimaal 6 tekens lang zijn' });
      return;
    }

    setChangingPassword(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Wachtwoord succesvol gewijzigd!' });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Fout bij wijzigen wachtwoord' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleEmailChange = async () => {
    if (!user || !newEmail || newEmail === email) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      // Update in customer table
      const { error: updateError } = await supabase
        .from('business_club_customers')
        .update({ email: newEmail })
        .eq('auth_user_id', user.id);

      if (updateError) throw updateError;

      setEmail(newEmail);
      setMessage({ type: 'success', text: 'Email succesvol gewijzigd! Controleer uw nieuwe email voor verificatie.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Fout bij wijzigen email' });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      // Remove cache-busting query parameters before saving to database
      const cleanAvatarUrl = photoUrl ? photoUrl.split('?')[0] : null;
      const cleanLogoUrl = logoUrl ? logoUrl.split('?')[0] : null;

      const { error } = await supabase
        .from('business_club_customers')
        .upsert({
          auth_user_id: user.id,
          company_name: companyName,
          name,
          email: email || user.email,
          phone,
          company,
          website,
          description,
          store,
          datum: datum || null,
          geboortedatum: geboortedatum || null,
          company_logo_url: cleanLogoUrl,
          avatar_url: cleanAvatarUrl,
          tags: tags || [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'auth_user_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Reload profile to ensure all data is fresh
      await loadProfile();
      
      setMessage({ type: 'success', text: 'Profiel succesvol bijgewerkt!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Fout bij bijwerken profiel' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <FaUser className="text-gray-700" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profielgegevens</h2>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-6 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Photo and Logo Upload */}
      <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">Profielfoto</label>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-3xl sm:text-4xl text-gray-400" />
                  )}
                </div>
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">Uploaden...</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  whileHover={{ scale: uploadingPhoto ? 1 : 1.05 }}
                  whileTap={{ scale: uploadingPhoto ? 1 : 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCamera />
                  {photoUrl ? 'Foto wijzigen' : 'Foto uploaden'}
                </motion.button>
                {photoUrl && (
                  <motion.button
                    type="button"
                    onClick={handlePhotoDelete}
                    disabled={uploadingPhoto}
                    whileHover={{ scale: uploadingPhoto ? 1 : 1.05 }}
                    whileTap={{ scale: uploadingPhoto ? 1 : 0.95 }}
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash />
                    Foto verwijderen
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <FaBuilding />
              Bedrijfslogo
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 rounded-lg">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <FaBuilding className="text-3xl sm:text-4xl text-gray-400" />
                  )}
                </div>
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-xs">Uploaden...</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <motion.button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  whileHover={{ scale: uploadingLogo ? 1 : 1.05 }}
                  whileTap={{ scale: uploadingLogo ? 1 : 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCamera />
                  {logoUrl ? 'Logo wijzigen' : 'Logo uploaden'}
                </motion.button>
                {logoUrl && (
                  <motion.button
                    type="button"
                    onClick={handleLogoDelete}
                    disabled={uploadingLogo}
                    whileHover={{ scale: uploadingLogo ? 1 : 1.05 }}
                    whileTap={{ scale: uploadingLogo ? 1 : 0.95 }}
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash />
                    Logo verwijderen
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Form */}
      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Naam
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Uw naam"
            />
          </div>

          <div>
            <label htmlFor="geboortedatum" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaBirthdayCake />
              Geboortedatum
            </label>
            <input
              type="date"
              id="geboortedatum"
              value={geboortedatum}
              onChange={(e) => setGeboortedatum(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        {/* Email Change */}
        <div className="p-4 bg-gray-50 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaEnvelope />
            Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            {newEmail !== email && (
              <motion.button
                type="button"
                onClick={handleEmailChange}
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Wijzigen
              </motion.button>
            )}
          </div>
        </div>

        {/* Password Change */}
        <div className="p-4 bg-gray-50 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <FaLock />
            Wachtwoord
          </label>
          <div className="flex items-center gap-4">
            <input
              type="password"
              value="••••••••"
              disabled
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <motion.button
              type="button"
              onClick={handleOpenPasswordModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <FaLock />
              Wachtwoord wijzigen
            </motion.button>
          </div>
        </div>

        {/* Company Information */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bedrijfsinformatie</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrijfsnaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Bedrijfsnaam"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoon
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="+32 XXX XX XX XX"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Beschrijf uw bedrijf..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-2">
                  Store <span className="text-red-500">*</span>
                </label>
                <select
                  id="store"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="sisera">Sisera</option>
                  <option value="boss">Boss</option>
                </select>
              </div>

              <div>
                <label htmlFor="datum" className="block text-sm font-medium text-gray-700 mb-2">
                  Datum
                </label>
                <input
                  type="date"
                  id="datum"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tags</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Selecteer tags die uw bedrijf het beste beschrijven. Deze tags helpen andere leden u te vinden.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-64 sm:max-h-96 overflow-y-auto p-3 sm:p-4 border border-gray-200 rounded-md">
            {availableTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTags([...tags, tag]);
                    } else {
                      setTags(tags.filter((t) => t !== tag));
                    }
                  }}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-black text-white text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="w-full px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FaSave />
          {saving ? 'Opslaan...' : 'Profielgegevens opslaan'}
        </motion.button>
      </form>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaLock />
                Wachtwoord wijzigen
              </h3>
              <button
                onClick={handleClosePasswordModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nieuw wachtwoord
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nieuw wachtwoord"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bevestig nieuw wachtwoord
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Bevestig nieuw wachtwoord"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newPassword && confirmPassword) {
                      handlePasswordChange();
                    }
                  }}
                />
              </div>

              {newPassword && newPassword.length < 6 && (
                <p className="text-sm text-red-600">
                  Wachtwoord moet minimaal 6 tekens lang zijn
                </p>
              )}

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600">
                  Wachtwoorden komen niet overeen
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={handleClosePasswordModal}
                  disabled={changingPassword}
                  whileHover={{ scale: changingPassword ? 1 : 1.02 }}
                  whileTap={{ scale: changingPassword ? 1 : 0.98 }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuleren
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={changingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                  whileHover={{ scale: changingPassword ? 1 : 1.02 }}
                  whileTap={{ scale: changingPassword ? 1 : 0.98 }}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? 'Wijzigen...' : 'Bevestigen'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileSettings;


