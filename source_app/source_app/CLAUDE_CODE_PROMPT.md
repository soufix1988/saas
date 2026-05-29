# 🚀 PROMPT POUR CLAUDE CODE
## Migration : Google Apps Script → SaaS Web Moderne

---

## CONTEXTE

Tu vas migrer une application Google Apps Script vers un vrai SaaS web.
Le code source original est dans les fichiers `.gs` et `.html` de ce dossier.

**Lis TOUS les fichiers source avant de commencer.**

---

## STACK CIBLE

- **Frontend** : React + Vite + TailwindCSS
- **Backend** : Node.js + Express
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth + login custom (identifiant/mot de passe)
- **Emails** : Resend (nodemailer en fallback)
- **Calendar** : Google Calendar API
- **Hébergement** : Vercel (frontend) + Railway (backend)

---

## STRUCTURE DU PROJET À CRÉER

```
saas-crm/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── GoogleLoginBtn.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── MobileHeader.jsx
│   │   │   ├── forms/
│   │   │   │   ├── FormBuilder.jsx
│   │   │   │   ├── FormRenderer.jsx
│   │   │   │   ├── FieldTypes.jsx
│   │   │   │   └── ConditionalLogic.jsx
│   │   │   ├── appointments/
│   │   │   │   ├── AppointmentModule.jsx
│   │   │   │   ├── SlidePanel.jsx
│   │   │   │   ├── TimeSlotPicker.jsx
│   │   │   │   └── BulkActions.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── KPICards.jsx
│   │   │   │   ├── WeeklyChart.jsx
│   │   │   │   ├── TodayAgenda.jsx
│   │   │   │   └── MonthlyCalendar.jsx
│   │   │   ├── crm/
│   │   │   │   ├── EntriesTable.jsx
│   │   │   │   └── EntryRow.jsx
│   │   │   ├── admin/
│   │   │   │   ├── UsersManager.jsx
│   │   │   │   ├── AccessManager.jsx
│   │   │   │   └── AppConfig.jsx
│   │   │   └── ui/
│   │   │       ├── Toast.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── SearchBar.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useForms.js
│   │   │   └── useAppointments.js
│   │   ├── lib/
│   │   │   ├── supabase.js
│   │   │   └── api.js
│   │   ├── i18n/
│   │   │   └── translations.js   # FR/EN/ES/DE/AR/HE
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── forms.js
│   │   │   ├── entries.js
│   │   │   ├── appointments.js
│   │   │   ├── dashboard.js
│   │   │   ├── users.js
│   │   │   └── config.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   ├── services/
│   │   │   ├── calendar.js      # Google Calendar API
│   │   │   ├── email.js         # Resend
│   │   │   └── cache.js         # Node-cache
│   │   ├── db/
│   │   │   └── supabase.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
└── README.md
```

---

## BASE DE DONNÉES SUPABASE — SCHÉMA EXACT

Crée ce schéma SQL dans `supabase/migrations/001_initial_schema.sql` :

```sql
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

-- Utilisateurs SaaS (login custom)
CREATE TABLE saas_users (
  id TEXT PRIMARY KEY,  -- Format: USR-XXXX ou 'admin'
  password TEXT NOT NULL,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formulaires
CREATE TABLE forms (
  id TEXT PRIMARY KEY,  -- Format: F_timestamp ou F_MED_timestamp
  nom TEXT NOT NULL,
  langue TEXT DEFAULT 'fr',
  rtl BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'light',
  font TEXT DEFAULT '''Poppins'', sans-serif',
  color TEXT DEFAULT '#9cf566',
  statut TEXT DEFAULT 'Actif',  -- Actif | Supprimé
  text_color TEXT DEFAULT '#111827',
  icon TEXT DEFAULT 'fa-leaf',
  adv_config JSONB DEFAULT '{}',  -- isAppointment, isQuiz, aptDuration, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Champs de chaque formulaire
CREATE TABLE form_fields (
  id SERIAL PRIMARY KEY,
  form_id TEXT REFERENCES forms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL,  -- text|textarea|number|date|select|radio|checkbox
  options TEXT DEFAULT '',
  requis BOOLEAN DEFAULT FALSE,
  logique TEXT DEFAULT '',  -- Ex: "champX:valeurY"
  ordre INTEGER DEFAULT 1,
  is_unique BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  desc_style TEXT DEFAULT 'light',  -- light | bold
  correct_answer TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  image_url TEXT DEFAULT ''
);

-- Droits d'accès
CREATE TABLE access_rights (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES saas_users(id) ON DELETE CASCADE,
  form_id TEXT,  -- NULL = droits globaux
  is_admin BOOLEAN DEFAULT FALSE,
  can_view BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  can_view_dashboard BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, form_id)
);

-- Réponses (une ligne par soumission)
CREATE TABLE form_entries (
  id SERIAL PRIMARY KEY,
  form_id TEXT REFERENCES forms(id) ON DELETE CASCADE,
  user_id TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  rdv_date DATE,
  rdv_time TEXT,
  rdv_status TEXT DEFAULT 'En attente',  -- En attente | Confirmé | Annulé
  score_quiz TEXT,
  data JSONB DEFAULT '{}',  -- Toutes les réponses dynamiques
  row_index INTEGER  -- Pour compatibilité avec l'ancien système
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
```

---

## FONCTIONNALITÉS À REPRODUIRE (LISTE EXHAUSTIVE)

### 1. AUTH
- [x] Login identifiant/mot de passe (table saas_users)
- [x] Login Google OAuth (Supabase Auth)
- [x] Session persistante (localStorage)
- [x] Logout propre
- [x] Contexte utilisateur : identifier, email, fullName, isAdmin, rights{}
- [x] Cache utilisateur (5 min)

### 2. FORM BUILDER
- [x] 7 types de champs : text, textarea, number, date, select, radio, checkbox
- [x] Drag pour réordonner (boutons haut/bas)
- [x] Label, options, description (style léger/gras), image base64
- [x] Logique conditionnelle : "champX:valeurY" → affiche/cache le champ
- [x] Champ requis + ID unique (anti-doublon)
- [x] Mode Quiz : bonne réponse + points par champ
- [x] Config design : couleur, police, icône, motif fond, couleur fond, image fond URL
- [x] Config avancé : message succès, objectif/sous-titre
- [x] Période ouverture/fermeture (datetime)
- [x] Limite participation : illimité, une fois, quotidien, hebdomadaire
- [x] Timer/chronomètre (anti-triche, persistant localStorage)
- [x] RTL toggle
- [x] Duplication de formulaire
- [x] Suppression (avec nettoyage des champs et droits)
- [x] Lien public partageable (?formId=...)

### 3. MODE RENDEZ-VOUS (BOOKING)
- [x] Toggle "Mode Rendez-vous" dans le builder
- [x] Validation : directe (auto-confirmé) ou sur approbation (manuelle)
- [x] Capacité max par créneau (ex: 2 patients en même temps)
- [x] Durée de la consultation (ex: 30 min)
- [x] Plage horaire : heure début, heure fin
- [x] Pause déjeuner : début pause, fin pause
- [x] Jours de fermeture : cases à cocher lundi→dimanche
- [x] Créneaux calculés automatiquement (ex: 09:00, 09:30, 10:00...)
- [x] Créneaux passés bloqués (si aujourd'hui)
- [x] Créneaux complets bloqués (selon capacité)
- [x] Jours fermés bloqués + toast d'erreur
- [x] Champs injectés auto dans le formulaire public : RDV_Date + RDV_Time

### 4. GOOGLE CALENDAR
- [x] Création auto d'événement à la soumission (mode direct)
- [x] Création à l'approbation (mode manuel)
- [x] Suppression si RDV supprimé ou annulé
- [x] Mise à jour si date/heure modifiée
- [x] Titre : "RDV: {patientName} ({formName})"

### 5. EMAILS AUTOMATIQUES
- [x] Email de réception (envoyé au client dès soumission, mode direct)
- [x] Email d'attente (envoyé au client, mode manuel)
- [x] Email de confirmation (après approbation admin)
- [x] Email d'annulation (avec option notifier/pas notifier)
- [x] Email de modification (si date/heure changée par admin)
- [x] Design HTML responsive (email template beau)
- [x] Message personnalisé par formulaire
- [x] Pièce jointe Drive URL (fetch + attach comme blob)
- [x] Multilingue : FR/EN/ES/DE/AR/HE
- [x] Détection auto de l'email dans les réponses (regex)
- [x] RTL pour emails Arabe/Hébreu

### 6. CRM — BASE DE DONNÉES
- [x] Tableau des entrées (inversé : plus récent en premier)
- [x] Filtrage texte en temps réel
- [x] Modification d'une entrée (pré-remplit le formulaire)
- [x] Suppression avec option notifier le client (si mode RDV)
- [x] Export PDF d'une entrée (impression)
- [x] Colonne ID unique mise en valeur
- [x] Badges Score Quiz en vert
- [x] Droits : voir / modifier / supprimer (séparés)

### 7. MODULE RENDEZ-VOUS (VUE ADMIN)
- [x] Recherche de formulaire par nom
- [x] Liste des RDV avec heure, patient, date, statut (badge coloré)
- [x] Filtres : Tous / En attente / Confirmés
- [x] Filtre par date
- [x] Recherche texte libre
- [x] Panneau coulissant de détails (slide panel)
- [x] Bouton "Approuver" dans le panneau
- [x] **Actions groupées** (bulk) :
  - Sélection individuelle (checkbox par carte)
  - Sélectionner tout
  - Confirmer la sélection
  - Annuler la sélection (avec option notifier)
  - Supprimer la sélection (avec option notifier)
- [x] Tri : du plus récent au plus ancien

### 8. DASHBOARD
- [x] Accès conditionné au droit "can_view_dashboard"
- [x] KPI cards :
  - RDV aujourd'hui (confirmés)
  - En attente d'approbation
  - Note de satisfaction moyenne (⭐)
- [x] Graphique barres hebdomadaire (lun→dim) : confirmés vs en attente
- [x] Agenda du jour : liste des RDV confirmés du jour (triés par heure)
  - Clic → ouvre le panneau de détails
- [x] Calendrier mensuel :
  - Vue grille 7 colonnes
  - Intensité de couleur selon nombre de RDV
  - Par projet : icône + nom + compteurs (confirmés / en attente)
  - Jour actuel mis en valeur

### 9. GESTION UTILISATEURS (ADMIN)
- [x] Créer un utilisateur (nom, prénom, mot de passe, email)
- [x] ID auto-généré : USR-XXXX
- [x] Liste des comptes avec mot de passe visible (admin)
- [x] Supprimer un utilisateur (supprime aussi ses droits)
- [x] Attribuer un formulaire à un utilisateur avec droits :
  - Voir tableau (CRM)
  - Modifier des entrées
  - Supprimer des entrées
  - Voir le Dashboard
- [x] Tableau des droits existants avec bouton supprimer

### 10. CONFIG APP (ADMIN)
- [x] Nom de l'application
- [x] Icône menu (FontAwesome select)
- [x] Logo personnalisé (upload → base64, affiché en cercle)
- [x] Langue interface (FR/EN/ES/DE/AR/HE)
- [x] Couleur primaire + couleur texte bouton
- [x] Couleur fond global
- [x] Motif de fond (9 motifs SVG dynamiques)
- [x] Image de fond URL
- [x] Preview live avant save

### 11. INTERNATIONALISATION
- [x] 6 langues : FR, EN, ES, DE, AR, HE
- [x] RTL dynamique (Arabe + Hébreu)
- [x] Bootstrap RTL/LTR switché dynamiquement
- [x] Polices adaptées (Cairo/Tajawal pour Arabe)
- [x] Toutes les chaînes de l'UI traduites
- [x] Emails traduits selon la langue de l'app

### 12. DESIGN & UX
- [x] Sidebar fixe (desktop) + header mobile avec hamburger
- [x] 9 motifs de fond SVG dynamiques (couleur suit la couleur primaire)
- [x] Animations fadeIn sur changement de vue
- [x] Toasts (succès/erreur) en haut à droite
- [x] Modals de confirmation custom
- [x] Responsive complet (mobile/tablette/desktop)
- [x] Formulaire public : URL partageable, mode sans sidebar
- [x] Impression PDF (styles @media print)
- [x] KaTeX pour formules mathématiques dans les quiz

---

## VARIABLES D'ENVIRONNEMENT

Crée un `.env` dans `backend/` :

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key

# Google Calendar API
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Resend (emails)
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@yourdomain.com

# App
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_min_32_chars
```

Crée un `.env` dans `frontend/` :

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## INSTRUCTIONS D'EXÉCUTION

```bash
# 1. Install
cd frontend && npm install
cd ../backend && npm install

# 2. Setup Supabase
# Crée un projet sur supabase.com
# Execute supabase/migrations/001_initial_schema.sql dans l'éditeur SQL

# 3. Remplis les .env

# 4. Lance
cd backend && npm run dev    # Port 3001
cd frontend && npm run dev   # Port 5173
```

---

## PRIORITÉ DE CONSTRUCTION

1. Schéma SQL + connexion Supabase
2. Backend Auth (login custom + JWT)
3. Frontend Login + Sidebar + Router
4. Form Builder (créer/modifier/supprimer)
5. Formulaire public (rendu + soumission)
6. CRM table (lire/modifier/supprimer entrées)
7. Module Rendez-vous (vue admin + booking public)
8. Emails + Google Calendar
9. Dashboard KPI + Graphiques
10. Gestion utilisateurs + droits
11. Config app + i18n

---

## NOTES IMPORTANTES

- **Ne rien supprimer** : chaque fonctionnalité listée doit être reproduite
- L'ancien `CacheService` Apps Script → `node-cache` (TTL 1h)
- L'ancien `Google Sheets Data_[formId]` → table `form_entries` avec `form_id` et `data JSONB`
- Le champ `adv_config JSONB` stocke tout : isAppointment, isQuiz, aptDuration, aptDaysOff[], etc.
- Le lien public `?formId=xxx` doit fonctionner sans login
- Le mode RTL doit switcher Bootstrap CSS dynamiquement
- Les motifs SVG sont dans le CSS (9 classes bg-*)
- KaTeX doit être importé via CDN dans le formulaire public

