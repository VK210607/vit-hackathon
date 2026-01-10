-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('individual', 'healthcare_facility', 'ngo');

-- Create enum for donation types
CREATE TYPE public.donation_type AS ENUM ('blood', 'medicine', 'equipment');

-- Create enum for donation status
CREATE TYPE public.donation_status AS ENUM ('pending', 'approved', 'collected', 'dispatched', 'in_transit', 'delivered', 'in_stock');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected', 'dispatched', 'in_transit', 'delivered');

-- Create enum for priority level
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'critical');

-- Create enum for delivery type
CREATE TYPE public.delivery_type AS ENUM ('pickup', 'self_drop');

-- Create enum for blood types
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Create enum for gender
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    role user_role NOT NULL,
    -- Individual fields
    full_name TEXT,
    age INTEGER,
    phone_number TEXT,
    gender gender_type,
    aadhar TEXT,
    -- Healthcare facility fields
    facility_name TEXT,
    hfr_id TEXT,
    contact_number TEXT,
    -- NGO fields
    ngo_name TEXT,
    ngo_id TEXT,
    ngo_coordinator TEXT,
    -- Common fields
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    donation_type donation_type NOT NULL,
    -- Blood donation fields
    blood_type blood_type,
    -- Medicine/Equipment fields
    item_name TEXT,
    item_image_url TEXT,
    expiry_date DATE,
    quantity INTEGER DEFAULT 1,
    -- Delivery info
    delivery_type delivery_type,
    scheduled_date DATE,
    time_slot TEXT,
    -- Status tracking
    status donation_status NOT NULL DEFAULT 'pending',
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create requests table
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    request_type donation_type NOT NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    blood_type blood_type,
    priority priority_level NOT NULL DEFAULT 'medium',
    status request_status NOT NULL DEFAULT 'pending',
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blood donation camps table
CREATE TABLE public.blood_camps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    organizer TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create camp registrations table
CREATE TABLE public.camp_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camp_id UUID REFERENCES public.blood_camps(id) ON DELETE CASCADE NOT NULL,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blood_type blood_type NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(camp_id, donor_id)
);

-- Create donation history for tracking blood donations
CREATE TABLE public.blood_donation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blood_type blood_type NOT NULL,
    donation_date DATE NOT NULL,
    camp_id UUID REFERENCES public.blood_camps(id),
    lives_saved INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donation_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- NGOs can view all profiles for coordination
CREATE POLICY "NGOs can view all profiles"
ON public.profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Donations policies
CREATE POLICY "Donors can view their own donations"
ON public.donations FOR SELECT
USING (donor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Donors can insert their donations"
ON public.donations FOR INSERT
WITH CHECK (donor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "NGOs can view all donations"
ON public.donations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

CREATE POLICY "NGOs can update donation status"
ON public.donations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Requests policies
CREATE POLICY "Healthcare facilities can view their own requests"
ON public.requests FOR SELECT
USING (requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Healthcare facilities can insert requests"
ON public.requests FOR INSERT
WITH CHECK (requester_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "NGOs can view all requests"
ON public.requests FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

CREATE POLICY "NGOs can update request status"
ON public.requests FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Blood camps policies (public read)
CREATE POLICY "Anyone can view active blood camps"
ON public.blood_camps FOR SELECT
USING (is_active = true);

CREATE POLICY "NGOs can manage blood camps"
ON public.blood_camps FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Camp registrations policies
CREATE POLICY "Donors can view their registrations"
ON public.camp_registrations FOR SELECT
USING (donor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Donors can register for camps"
ON public.camp_registrations FOR INSERT
WITH CHECK (donor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "NGOs can view all registrations"
ON public.camp_registrations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Blood donation history policies
CREATE POLICY "Donors can view their donation history"
ON public.blood_donation_history FOR SELECT
USING (donor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "NGOs can manage donation history"
ON public.blood_donation_history FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND role = 'ngo'
    )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();