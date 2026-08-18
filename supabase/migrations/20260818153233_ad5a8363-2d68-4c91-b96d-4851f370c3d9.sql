
-- 1. Project case-study fields + status
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS solution text,
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS challenges text,
  ADD COLUMN IF NOT EXISTS learning text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'shipped';

-- 2. Moments metadata
ALTER TABLE public.moments
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS location text;

-- 3. Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  org text,
  period text,
  detail text,
  sort_order integer NOT NULL DEFAULT 999,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read achievements" ON public.achievements;
CREATE POLICY "public read achievements" ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write achievements" ON public.achievements;
CREATE POLICY "admin write achievements" ON public.achievements FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4. About content
UPDATE public.about_profile SET
  tagline = 'AI & Full-Stack Developer',
  long_bio = E'Computer Engineering student at TSSM''s BSCOER under Savitribai Phule Pune University, based in Pune, India. I enjoy turning real-world problems into practical software products, especially at the intersection of artificial intelligence, full-stack development, cloud technologies, and data-driven systems.\n\nI learn by building — from AI-powered applications and developer tools to civic-tech concepts and rapid hackathon prototypes. My goal is to create technology that is useful beyond the screen.',
  current_focus = 'Building RoadFix AI';

-- 5. Projects
UPDATE public.projects SET
  description = 'Real-time disaster response platform designed to connect victims, volunteers, NGOs, and government workers through location-aware reporting and coordination.',
  problem = 'Emergency information can become fragmented during disasters, making coordination between affected people, volunteers, NGOs, and authorities difficult.',
  solution = 'Sachet is a real-time disaster response platform designed to connect victims, volunteers, NGOs, and government workers through location-aware reporting and coordination.',
  features = ARRAY['Live GPS-based reports','Helper map','AI-assisted severity scoring','Real-time response coordination','Multi-language support','PWA experience'],
  challenges = 'Keeping location-aware reports in sync in real time while keeping the interface usable on low-end devices and weak networks.',
  learning = 'Designing around realtime data, multi-language interfaces, and offline-friendly PWA behaviour.',
  categories = ARRAY['Full-Stack','AI'],
  stack = ARRAY['Next.js','TypeScript','Tailwind CSS','Supabase','Gemini AI','i18next','PWA'],
  github_url = 'https://github.com/Prem-91/sachet-india-s-lifeline',
  live_url = 'https://sachet-aid-connect.lovable.app/',
  featured = true, sort_order = 1
WHERE name = 'Sachet';

UPDATE public.projects SET
  description = 'An AI-powered mock interview assistant designed to help students practice technical interviews without simply giving away the answer.',
  problem = 'Most AI tools hand over the full solution, so students get the answer but not the reasoning practice an interview actually tests.',
  solution = 'The system identifies the interview topic and provides increasingly useful progressive hints instead of immediately revealing the complete solution.',
  features = ARRAY['Progressive hints instead of full answers','Topic detection across DSA, OS, DBMS, OOP and System Design','Conversational practice interface'],
  challenges = 'Prompting the model to withhold the solution and escalate hints gradually while staying genuinely helpful.',
  learning = 'How prompt design and constraints shape whether an AI tool actually teaches something.',
  categories = ARRAY['Full-Stack','AI'],
  stack = ARRAY['Vite','React','TypeScript','shadcn/ui','Tailwind CSS','Gemini AI'],
  github_url = 'https://github.com/Prem-91/interview-coach-ai-05',
  live_url = 'https://interview-ai-iota-nine.vercel.app/',
  featured = true, sort_order = 2
WHERE name = 'Interview Coach AI';

UPDATE public.projects SET
  description = 'AI-powered memory and context management system for storing, organizing and retrieving contextual information.',
  problem = 'Important information becomes difficult to organize and retrieve as users interact with multiple applications, documents, and sources.',
  solution = 'A system designed to store, organize, and retrieve contextual information using AI-assisted processing.',
  features = ARRAY['Secure memory storage','AI-assisted retrieval','Custom categorization','JWT-based accounts'],
  challenges = 'Splitting the app across a Node API and a Python ML service while keeping retrieval fast and the data model simple.',
  learning = 'Working across a JavaScript backend and a Python ML layer in one product.',
  categories = ARRAY['Full-Stack','AI'],
  stack = ARRAY['React.js','Node.js','Express','MongoDB','JWT','Python','TensorFlow'],
  github_url = 'https://github.com/Prem-91/ai-memory-vault',
  live_url = 'https://ai-context-bridge.vercel.app',
  featured = true, sort_order = 3
WHERE name = 'Context Bridge';

INSERT INTO public.projects (name, description, problem, solution, features, challenges, learning, stack, categories, github_url, live_url, year, featured, sort_order, status)
SELECT * FROM (VALUES
  ('StadiumPulse.AI',
   'Real-time operations platform concept for stadium and mega-event logistics — a control centre for organizers, staff, volunteers and fans.',
   'Large events are still coordinated over fragmented radios and spreadsheets, so hazards, congestion and volunteer gaps surface late.',
   'A unified, mobile-responsive control centre that centralises event-day workflows: crowd movement, hazard reports and volunteer scheduling, with AI assistance on top.',
   ARRAY['Real-time operations dashboard','Hazard and incident reporting','Volunteer scheduling','Fan-facing mobile portal','AI assistance via Gemini'],
   'Modelling many roles (organizer, staff, volunteer, fan) over one realtime data layer without the UI becoming unusable.',
   'Designing role-based realtime interfaces on TanStack Start and Supabase.',
   ARRAY['React 19','TanStack Start','TypeScript','Supabase','Vercel AI SDK','Gemini 2.5 Flash'],
   ARRAY['Full-Stack','AI'],
   'https://github.com/Prem-91/stadium-smart-ai', NULL, '2026', true, 4, 'shipped'),
  ('Carbon Companion',
   'Mobile-first carbon tracking app that turns footprint tracking into a gamified habit loop with AI-assisted insights.',
   'Carbon tracking is tedious and preachy, so people abandon it before it changes any habit.',
   'A playful tracker with an evolving avatar, AI coaching over the last 30 days of data, a receipt/bill scanner and a what-if simulator.',
   ARRAY['Evolving carbon avatar','AI sustainability coach','AI receipt and bill scanner','What-if lifestyle simulator','Quests and badges'],
   'Turning messy receipt and bill inputs into structured, categorised CO2 estimates.',
   'Combining gamification with AI extraction in a mobile-first product.',
   ARRAY['TanStack Start','React','TypeScript','Tailwind CSS','Supabase','Gemini AI'],
   ARRAY['Full-Stack','AI'],
   'https://github.com/Prem-91/Carbon-Companion-0', NULL, '2026', false, 5, 'shipped'),
  ('GitOps CD on Kubernetes',
   'A GitOps-style continuous delivery pipeline: commits build a container image, push it to Artifact Registry, then update Kubernetes manifests to trigger a deploy.',
   'Manual deploys to Kubernetes are hard to audit and hard to roll back.',
   'Two repositories — app and env — where the env repo holds deployment manifests, so candidate and production branches become a deployment history.',
   ARRAY['Cloud Build CI/CD pipeline','Container images in Artifact Registry','Environments-as-code manifests','Rollback via git history'],
   'Wiring build triggers, registries and manifest updates so a push safely reaches a cluster.',
   'How GitOps makes deployments reviewable and reversible.',
   ARRAY['Google Cloud','Cloud Build','Kubernetes (GKE)','Artifact Registry','Docker','Python'],
   ARRAY['Backend'],
   'https://github.com/Prem-91/hello-cloudbuild-app', NULL, '2026', false, 6, 'shipped'),
  ('Developer Portfolio',
   'This site — a database-driven portfolio with a private admin dashboard for editing every section, plus an image gallery backed by cloud storage.',
   'A static portfolio goes stale, and editing content meant editing code every time.',
   'A full-stack portfolio where content lives in the database and an authenticated admin dashboard handles all create, edit and delete operations.',
   ARRAY['Admin-only CMS dashboard','Row-level-security protected content','Image uploads to cloud storage','Resume upload and download','Animated single-page experience'],
   'Keeping the admin surface genuinely locked down while all content stays publicly readable and fast.',
   'Auth, row-level security and file storage in a real production app.',
   ARRAY['TanStack Start','React','TypeScript','Tailwind CSS','Framer Motion','Supabase'],
   ARRAY['Full-Stack','Open Source'],
   'https://github.com/Prem-91/premfolio-vaulted-chronicles', 'https://premshinde.lovable.app', '2026', false, 7, 'shipped'),
  ('RoadFix AI',
   'AI-powered civic technology designed to make reporting potholes and unsafe roads easier by converting real-world road problems into structured, actionable reports.',
   'Reporting a damaged or unsafe road is slow and unstructured, so problems go unrecorded.',
   'Turn a photo of a road problem into a structured, actionable report using AI and computer vision.',
   ARRAY['Photo-based road issue reporting','Computer-vision assisted classification','Structured, actionable reports'],
   NULL, NULL,
   ARRAY['AI','Computer Vision','Civic Tech'],
   ARRAY['AI'],
   NULL, NULL, '2026', false, 0, 'building')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM public.projects p WHERE p.name = v.column1);

-- 6. Experiences
UPDATE public.experiences SET detail = 'Academic Performance — Sem 1–2: 8.68/10 · Sem 3–4: 8.41/10. Coursework: DSA, DBMS, ML, OOP.' WHERE kind = 'edu';
UPDATE public.experiences SET detail = 'Representing Google''s developer community on campus, helping students explore developer technologies, technical learning opportunities, and community initiatives.' WHERE title = 'Google Student Ambassador';
UPDATE public.experiences SET detail = 'Organizing and supporting technical workshops, coding events, and student-focused technology activities for 150+ Computer Engineering students.' WHERE title LIKE 'Active Member — ACES%';
UPDATE public.experiences SET detail = 'Building and publishing projects openly on GitHub, and contributing improvements, fixes and documentation to repositories I use.' WHERE title = 'Open Source Contributor';
UPDATE public.experiences SET detail = 'Building rapid prototypes around real-world problems, with a focus on AI, civic technology, full-stack systems, and practical user experiences.' WHERE title = 'Hackathon Builder';

-- 7. Skills groups
DELETE FROM public.skills_groups;
INSERT INTO public.skills_groups (name, items, sort_order) VALUES
  ('Languages', ARRAY['Python','TypeScript','JavaScript','Java','C','SQL','HTML/CSS'], 1),
  ('Frontend & Backend', ARRAY['React','Next.js','Node.js','Flask'], 2),
  ('Data', ARRAY['PostgreSQL','MongoDB','Supabase','Pandas','NumPy'], 3),
  ('Cloud & DevOps', ARRAY['AWS','Google Cloud','Supabase','Git','GitHub','Cloudinary'], 4),
  ('AI & Developer Tools', ARRAY['Gemini AI','REST APIs','PWA','i18next','Tailwind CSS'], 5);

-- 8. Moments metadata
UPDATE public.moments SET category = 'Conference', location = 'Mumbai' WHERE title ILIKE '%AWS Summit Mumbai%';
UPDATE public.moments SET title = 'AWS User Group Pune Community Meetup', category = 'Community', location = 'Pune' WHERE title ILIKE '%user group pune%';
UPDATE public.moments SET category = 'Community' WHERE title ILIKE '%Student Community Day%';
UPDATE public.moments SET category = 'Developer Event' WHERE title ILIKE '%Copilot%';
UPDATE public.moments SET category = 'Hackathon', location = 'TSSM''s BSCOER, Pune' WHERE title ILIKE '%Techathon%';

-- 9. Achievements seed
INSERT INTO public.achievements (title, org, period, detail, sort_order)
SELECT * FROM (VALUES
  ('Google Student Ambassador','Google','2025 — Present','Selected to represent Google''s developer community on campus and help students explore developer technologies and learning opportunities.',1),
  ('Academic Performance','TSSM''s BSCOER · SPPU','2024 — Present','Sem 1–2: 8.68/10 · Sem 3–4: 8.41/10 in Computer Engineering.',2),
  ('Technical & Community Leadership','ACES','2024 — Present','Organizing technical workshops and coding events for 150+ Computer Engineering students.',3),
  ('International Taekwondo Championship','Taekwondo',NULL,'Competed at an international-level Taekwondo championship.',4)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM public.achievements a WHERE a.title = v.column1);
