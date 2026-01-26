# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for profile photos and company logos.

## Quick Setup

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run the Storage Setup Script**
   - Open the file `setup_storage_buckets.sql`
   - Copy and paste the entire contents into the SQL Editor
   - Click "Run" to execute

This will create:
- `avatars` bucket for profile photos
- `company-logos` bucket for company logos
- Storage policies that allow users to upload/update/delete their own files
- Public read access for viewing images

## What Gets Created

### Storage Buckets
- **avatars**: Stores user profile photos (5MB limit, images only)
- **company-logos**: Stores company logos (5MB limit, images only)

### Storage Policies
- Users can only upload/update/delete files in their own folder (`{user_id}/`)
- Public read access for viewing images
- File size limit: 5MB per file
- Allowed types: JPEG, PNG, WebP, GIF

## How It Works

1. When a user uploads a profile photo:
   - File is stored in `avatars/{user_id}/avatar.{ext}`
   - Public URL is saved to `business_club_customers.avatar_url`

2. When a user uploads a company logo:
   - File is stored in `company-logos/{user_id}/logo.{ext}`
   - Public URL is saved to `business_club_customers.company_logo_url`

## Troubleshooting

### "Bucket not found" error
- Make sure you've run `setup_storage_buckets.sql` in the Supabase SQL Editor

### "Permission denied" error
- Check that storage policies were created correctly
- Verify the user is authenticated

### Images not displaying
- Check that the buckets are set to `public: true`
- Verify the URLs are being saved correctly in the database

## Manual Setup (Alternative)

If you prefer to set up buckets manually:

1. Go to Storage in Supabase Dashboard
2. Create two buckets:
   - `avatars` (public: true)
   - `company-logos` (public: true)
3. Add storage policies manually (see `setup_storage_buckets.sql` for policy definitions)

