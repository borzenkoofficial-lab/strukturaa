
-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  address text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Project stages table
CREATE TABLE public.project_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  sort_order integer NOT NULL DEFAULT 0,
  photos text[] DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;

-- Projects RLS: clients see own projects
CREATE POLICY "Clients can view own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

-- Projects RLS: admins full access
CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Stages RLS: clients see stages of own projects
CREATE POLICY "Clients can view own project stages" ON public.project_stages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.projects WHERE projects.id = project_stages.project_id AND projects.client_id = auth.uid()
  ));

-- Stages RLS: admins full access
CREATE POLICY "Admins can manage project stages" ON public.project_stages
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Updated_at trigger for projects
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
