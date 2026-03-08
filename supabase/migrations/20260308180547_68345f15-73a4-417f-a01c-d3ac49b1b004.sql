
-- Allow admins to view ALL listings (not just active ones)
CREATE POLICY "Admins can view all listings"
ON public.listings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any listing
CREATE POLICY "Admins can update any listing"
ON public.listings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete any listing
CREATE POLICY "Admins can delete any listing"
ON public.listings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
