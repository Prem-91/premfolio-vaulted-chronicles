
-- ============ ADMIN EMAIL ALLOWLIST ============
CREATE TABLE public.admin_emails (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_emails TO authenticated;
GRANT ALL ON public.admin_emails TO service_role;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins can read allowlist" ON public.admin_emails
  FOR SELECT TO authenticated
  USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

INSERT INTO public.admin_emails (email) VALUES ('shindeprem695@gmail.com');

-- helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails
    WHERE lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
  );
$$;

-- ============ ABOUT (singleton) ============
CREATE TABLE public.about_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  tagline TEXT NOT NULL,
  long_bio TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  github_url TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  current_focus TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_profile TO anon, authenticated;
GRANT ALL ON public.about_profile TO service_role;
ALTER TABLE public.about_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read about" ON public.about_profile FOR SELECT USING (true);
CREATE POLICY "admin write about" ON public.about_profile FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.about_profile (name, initials, tagline, long_bio, location, email, github_url, linkedin_url, resume_url, current_focus)
VALUES (
  'Prem Shinde','PS',
  'Full-stack & backend engineer building thoughtful software.',
  'Computer Engineering student at SPPU / TSSM''s BSCOER in Pune, India. I build full-stack systems with React, Node and Python — focused on real-time data, sensible architecture, and tools that solve actual problems for actual people.',
  'Pune, Maharashtra, India',
  'shindeprem695@gmail.com',
  'https://github.com/Prem-91',
  'https://www.linkedin.com/in/premshinde0/',
  '/prem-shinde-resume.pdf',
  'CS student + freelance dev'
);

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  stack TEXT[] NOT NULL DEFAULT '{}',
  categories TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  year TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "admin write projects" ON public.projects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.projects (name, description, stack, categories, github_url, live_url, year, featured, sort_order) VALUES
('Sachet','Real-time disaster response platform connecting victims with NGOs, volunteers and government workers across India. Live GPS reports, helper map, and AI-scored severity.',
 ARRAY['Next.js','TypeScript','Tailwind','Supabase','Gemini AI','i18next','PWA'],
 ARRAY['Full-Stack','AI'],
 'https://github.com/Prem-91', NULL, '2025', true, 1),
('Interview Coach AI','Ethical AI mock-interview assistant. Detects topic & intent (DSA, OS, DBMS, OOP, System Design) and delivers progressive hints — never the full solution.',
 ARRAY['Vite','React','TypeScript','shadcn/ui','Tailwind','Gemini AI'],
 ARRAY['Full-Stack','AI'],
 'https://github.com/Prem-91','https://interview-ai-ripis.lovable.app','2025', true, 2);

-- ============ EXPERIENCES ============
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  period TEXT NOT NULL,
  detail TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'exp', -- 'edu' | 'exp'
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experiences TO anon, authenticated;
GRANT ALL ON public.experiences TO service_role;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "admin write experiences" ON public.experiences FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.experiences (title, org, period, detail, kind, sort_order) VALUES
('B.Tech, Computer Engineering','TSSM''s BSCOER · Savitribai Phule Pune University','Sept 2024 – Dec 2028','GPA 8.68/10 (Sem 1 & 2). Coursework: DSA, DBMS, ML, OOP.','edu',1),
('Google Student Ambassador','Google','2025 — Present','Selected as a Google Student Ambassador — representing Google''s developer community on campus, running learning sessions, and driving student engagement with Google technologies.','exp',2),
('Active Member — ACES','Association of Computer Engineering Students','2024 — Present','Organize technical workshops and coding events for 150+ Computer Engineering students.','exp',3),
('Open Source Contributor','GitHub','Ongoing','Contributing to OSS projects — improving code quality, fixing issues, and writing documentation.','exp',4),
('Hackathon Builder','Multiple events','Ongoing','Building rapid prototypes for local community problems.','exp',5);

-- ============ SKILLS GROUPS ============
CREATE TABLE public.skills_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills_groups TO anon, authenticated;
GRANT ALL ON public.skills_groups TO service_role;
ALTER TABLE public.skills_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read skills" ON public.skills_groups FOR SELECT USING (true);
CREATE POLICY "admin write skills" ON public.skills_groups FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.skills_groups (name, items, sort_order) VALUES
('Languages', ARRAY['Python','TypeScript','JavaScript','Java','C','SQL','HTML/CSS'], 1),
('Frameworks', ARRAY['React','Next.js','Node.js','Flask','Pandas','NumPy'], 2),
('Cloud & DevOps', ARRAY['AWS','Google Cloud','Supabase','Cloudinary','Git','GitHub'], 3),
('Databases', ARRAY['PostgreSQL','MongoDB','Supabase'], 4),
('AI / Tools', ARRAY['Gemini AI','REST APIs','PWA','i18next','Tailwind CSS'], 5);

-- ============ MOMENTS (public events/photos) ============
CREATE TABLE public.moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE,
  caption TEXT,
  image_path TEXT NOT NULL, -- storage path in 'moments' bucket
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.moments TO anon, authenticated;
GRANT ALL ON public.moments TO service_role;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read moments" ON public.moments FOR SELECT USING (true);
CREATE POLICY "admin write moments" ON public.moments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ MOMENTS STORAGE POLICIES (bucket created separately) ============
CREATE POLICY "public read moments bucket" ON storage.objects FOR SELECT
  USING (bucket_id = 'moments');
CREATE POLICY "admin upload moments" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'moments' AND public.is_admin());
CREATE POLICY "admin update moments" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'moments' AND public.is_admin());
CREATE POLICY "admin delete moments" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'moments' AND public.is_admin());
