-- Create a security definer function to safely check user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Drop all existing SELECT policies on profiles to avoid conflicts
DROP POLICY IF EXISTS "NGOs can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "NGOs can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'ngo'::user_role);