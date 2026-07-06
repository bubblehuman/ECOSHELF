-- Need Provider Project Update v2.1
-- ============================================================
-- ECO SHELF — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Custom ENUM Types
-- ============================================================

CREATE TYPE user_type AS ENUM ('retailer', 'ngo');
CREATE TYPE listing_category AS ENUM ('grocery', 'restaurant', 'furniture', 'hotel');
CREATE TYPE listing_status AS ENUM ('available', 'claimed');


-- 2. Profiles Table
-- ============================================================
-- Linked 1:1 with auth.users. Stores org info and location.

CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  org_name      TEXT NOT NULL,
  user_type     user_type NOT NULL,
  address       TEXT,
  phone         TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Organization profiles for retailers and NGOs';


-- 3. Listings Table
-- ============================================================
-- Surplus inventory items posted by retailers.

CREATE TABLE listings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  category        listing_category NOT NULL,
  original_price  DECIMAL(10,2) NOT NULL,
  surplus_price   DECIMAL(10,2) NOT NULL,
  expiry_time     TIMESTAMPTZ NOT NULL,
  status          listing_status DEFAULT 'available',
  description     TEXT,
  claimed_by      UUID REFERENCES profiles(id),
  claimed_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE listings IS 'Surplus inventory listings from retailers';

-- Index for fast filtering
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_business ON listings(business_id);
CREATE INDEX idx_listings_expiry ON listings(expiry_time);


-- 4. Enable Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;


-- 5. RLS Policies — Profiles
-- ============================================================

-- Anyone can read profiles (needed for org name display on listings)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

-- Authenticated users can create their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 6. RLS Policies — Listings
-- ============================================================

-- Anyone can read all listings (app-side filters by status)
CREATE POLICY "Listings are viewable by everyone"
  ON listings
  FOR SELECT
  USING (true);

-- Only the listing owner (retailer) can insert
CREATE POLICY "Retailers can create their own listings"
  ON listings
  FOR INSERT
  WITH CHECK (auth.uid() = business_id);

-- Owners can update their listings; authenticated users can claim
CREATE POLICY "Authenticated users can update listings"
  ON listings
  FOR UPDATE
  USING (
    auth.uid() = business_id
    OR auth.uid() IS NOT NULL
  );

-- Only listing owners can delete
CREATE POLICY "Owners can delete their listings"
  ON listings
  FOR DELETE
  USING (auth.uid() = business_id);


-- ============================================================
-- DONE — Schema ready for Eco Shelf
-- ============================================================
