-- Fix security vulnerability: Restrict profile visibility to own profiles only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new restrictive policy that only allows users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);