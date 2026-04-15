
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Politicians
CREATE TABLE public.politicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  initials TEXT,
  avatar_color TEXT DEFAULT '#B11226',
  true_pct NUMERIC DEFAULT 0,
  false_pct NUMERIC DEFAULT 0,
  misleading_pct NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.politicians ENABLE ROW LEVEL SECURITY;

-- Fact checks
CREATE TABLE public.fact_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  claim TEXT NOT NULL,
  verdict TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  category TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  featured BOOLEAN DEFAULT false,
  shares INTEGER DEFAULT 0,
  politician_id UUID REFERENCES public.politicians(id) ON DELETE SET NULL,
  sources_count INTEGER DEFAULT 0,
  confidence_level TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fact_checks ENABLE ROW LEVEL SECURITY;

-- Claim submissions
CREATE TABLE public.claim_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_text TEXT NOT NULL,
  context TEXT,
  source TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.claim_submissions ENABLE ROW LEVEL SECURITY;

-- Ticker items
CREATE TABLE public.ticker_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticker_items ENABLE ROW LEVEL SECURITY;

-- Site stats
CREATE TABLE public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_fact_checks INTEGER DEFAULT 0,
  false_claims_pct NUMERIC DEFAULT 0,
  politicians_tracked INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Newsletter signups
CREATE TABLE public.newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_politicians_updated BEFORE UPDATE ON public.politicians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fact_checks_updated BEFORE UPDATE ON public.fact_checks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_claim_submissions_updated BEFORE UPDATE ON public.claim_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_ticker_items_updated BEFORE UPDATE ON public.ticker_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign admin role on signup for admin email
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'admin@semadata.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();

-- RLS Policies

-- user_roles
CREATE POLICY "Admins read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- politicians
CREATE POLICY "Public read politicians" ON public.politicians FOR SELECT USING (true);
CREATE POLICY "Admin insert politicians" ON public.politicians FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update politicians" ON public.politicians FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete politicians" ON public.politicians FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- fact_checks
CREATE POLICY "Public read fact_checks" ON public.fact_checks FOR SELECT USING (true);
CREATE POLICY "Admin insert fact_checks" ON public.fact_checks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update fact_checks" ON public.fact_checks FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete fact_checks" ON public.fact_checks FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- claim_submissions
CREATE POLICY "Public insert claims" ON public.claim_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read claims" ON public.claim_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update claims" ON public.claim_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete claims" ON public.claim_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ticker_items
CREATE POLICY "Public read active ticker" ON public.ticker_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage ticker" ON public.ticker_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_stats
CREATE POLICY "Public read stats" ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "Admin manage stats" ON public.site_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- newsletter_signups
CREATE POLICY "Public insert newsletter" ON public.newsletter_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read newsletter" ON public.newsletter_signups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete newsletter" ON public.newsletter_signups FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
