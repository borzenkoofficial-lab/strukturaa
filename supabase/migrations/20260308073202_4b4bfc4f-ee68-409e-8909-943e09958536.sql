
-- Drop overly permissive policy and replace with auth-only
DROP POLICY "Anyone can insert views" ON public.story_views;

CREATE POLICY "Authenticated users can insert views"
  ON public.story_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = viewer_id);
