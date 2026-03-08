
-- Favorites table for services and articles
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id text NOT NULL,
  item_type text NOT NULL DEFAULT 'service',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Article likes table
CREATE TABLE public.article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can count likes" ON public.article_likes FOR SELECT USING (true);
CREATE POLICY "Users can like articles" ON public.article_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike articles" ON public.article_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
