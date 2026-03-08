
CREATE TABLE public.listing_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  viewer_id uuid,
  viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view
CREATE POLICY "Anyone can insert listing views"
ON public.listing_views FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = viewer_id);

-- Allow anonymous inserts too
CREATE POLICY "Anon can insert listing views"
ON public.listing_views FOR INSERT
TO anon
WITH CHECK (viewer_id IS NULL);

-- Everyone can read view counts
CREATE POLICY "Everyone can read listing views"
ON public.listing_views FOR SELECT
USING (true);

-- Create an index for fast count queries
CREATE INDEX idx_listing_views_listing_id ON public.listing_views(listing_id);
