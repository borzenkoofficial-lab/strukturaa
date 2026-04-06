
CREATE TABLE public.contractor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  company_type TEXT DEFAULT 'individual', -- individual, ip, ooo
  inn TEXT,
  description TEXT,
  specializations TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  city TEXT,
  phone TEXT,
  website TEXT,
  avatar_url TEXT,
  portfolio_photos TEXT[] DEFAULT '{}',
  completed_projects INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contractor profiles viewable by everyone"
ON public.contractor_profiles FOR SELECT
USING (published = true);

CREATE POLICY "Users can view own contractor profile"
ON public.contractor_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contractor profile"
ON public.contractor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contractor profile"
ON public.contractor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage contractor profiles"
ON public.contractor_profiles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_contractor_profiles_updated_at
BEFORE UPDATE ON public.contractor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
