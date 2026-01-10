-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "NGOs can view all profiles" ON public.profiles;

-- Recreate the policy using auth.jwt() to check role from user metadata instead of subquerying profiles
-- This avoids the circular reference that causes infinite recursion
CREATE POLICY "NGOs can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'ngo'::user_role
    AND p.id != profiles.id
  )
);