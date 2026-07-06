-- Need Provider Project Update v2.1
-- ============================================================
-- NEED PROVIDER — Local PostgreSQL Schema
-- Adapted from Supabase schema for standalone PostgreSQL
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Custom ENUM Types
-- ============================================================

CREATE TYPE user_type AS ENUM ('retailer', 'ngo');
CREATE TYPE listing_category AS ENUM ('clothes', 'shelter', 'books', 'educational_facilities', 'food');
CREATE TYPE listing_status AS ENUM ('available', 'claimed');


-- 2. Users Table (replaces Supabase auth.users)
-- ============================================================

CREATE TABLE users (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Local authentication table replacing Supabase auth.users';


-- 3. Profiles Table
-- ============================================================
-- Linked 1:1 with users. Stores org info and location.

CREATE TABLE profiles (
  id            UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  org_name      TEXT NOT NULL,
  user_type     user_type NOT NULL,
  address       TEXT,
  phone         TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Organization profiles for retailers and NGOs';


-- 4. Listings Table
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

-- Indexes for fast filtering
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_business ON listings(business_id);
CREATE INDEX idx_listings_expiry ON listings(expiry_time);
CREATE INDEX idx_listings_claimed_by ON listings(claimed_by);


-- ============================================================
-- DONE — Schema ready for local Need Provider
-- ============================================================
