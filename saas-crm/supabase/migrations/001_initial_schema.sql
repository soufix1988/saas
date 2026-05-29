-- Config globale de l'application
CREATE TABLE app_config (
  id SERIAL PRIMARY KEY,
  app_name TEXT DEFAULT 'FormSaaS',
  app_icon TEXT DEFAULT 'fa-layer-group',
  app_color TEXT DEFAULT '#111827',
  app_text_color TEXT DEFAULT '#ffffff',
  app_lang TEXT DEFAULT 'fr',
  app_logo TEXT DEFAULT '',
  app_pattern TEXT DEFAULT 'bg-solid',
  app_bg_color TEXT DEFAULT '#f7f9fc',
  app_bg_img TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_config (app_name, app_icon, app_color, app_text_color, app_lang, app_pattern, app_bg_color)
VALUES ('FormSaaS', 'fa-layer-group', '#111827', '#ffffff', 'fr', 'bg-solid', '#f7f9fc');

-- Utilisateurs SaaS (login custom)
CREATE TABLE saas_users (
  id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO saas_users (id, password, email, nom, prenom)
VALUES ('admin', 'admin123', 'admin@formsaas.com', 'Admin', 'Super');

-- Formulaires
CREATE TABLE forms (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  langue TEXT DEFAULT 'fr',
  rtl BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'light',
  font TEXT DEFAULT '''Poppins'', sans-serif',
  color TEXT DEFAULT '#9cf566',
  statut TEXT DEFAULT 'Actif',
  text_color TEXT DEFAULT '#111827',
  icon TEXT DEFAULT 'fa-leaf',
  adv_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Champs de chaque formulaire
CREATE TABLE form_fields (
  id SERIAL PRIMARY KEY,
  form_id TEXT REFERENCES forms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  options TEXT DEFAULT '',
  requis BOOLEAN DEFAULT FALSE,
  logique TEXT DEFAULT '',
  ordre INTEGER DEFAULT 1,
  is_unique BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  desc_style TEXT DEFAULT 'light',
  correct_answer TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  image_url TEXT DEFAULT ''
);

-- Droits d'accès
CREATE TABLE access_rights (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES saas_users(id) ON DELETE CASCADE,
  form_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  can_view BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  can_view_dashboard BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, form_id)
);

-- Réponses
CREATE TABLE form_entries (
  id SERIAL PRIMARY KEY,
  form_id TEXT REFERENCES forms(id) ON DELETE CASCADE,
  user_id TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  rdv_date DATE,
  rdv_time TEXT,
  rdv_status TEXT DEFAULT 'En attente',
  score_quiz TEXT,
  data JSONB DEFAULT '{}',
  row_index INTEGER,
  gcal_event_id TEXT
);

-- Journal d'audit
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  form_id TEXT,
  user_id TEXT,
  action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_form_entries_form_id ON form_entries(form_id);
CREATE INDEX idx_form_entries_rdv_date ON form_entries(rdv_date);
CREATE INDEX idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX idx_access_rights_user_id ON access_rights(user_id);
