
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  condition TEXT NOT NULL DEFAULT 'used_good',
  price NUMERIC NOT NULL DEFAULT 0,
  photos TEXT[] DEFAULT '{}'::TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active shop items viewable by everyone" ON public.shop_items FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own shop items" ON public.shop_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create shop items" ON public.shop_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shop items" ON public.shop_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shop items" ON public.shop_items FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage shop items" ON public.shop_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));
