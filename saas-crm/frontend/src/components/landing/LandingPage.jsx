import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: 'fa-wpforms',
    title: 'Form Builder',
    desc: 'Créez des formulaires multi-langues avec logique conditionnelle, quiz et champs personnalisés.',
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #e9d5ff 100%)',
    color: '#7c3aed',
  },
  {
    icon: 'fa-calendar-check',
    title: 'Booking & RDV',
    desc: 'Gérez vos rendez-vous avec Google Calendar intégré, rappels automatiques et créneaux intelligents.',
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fce7f3 100%)',
    color: '#ec4899',
  },
  {
    icon: 'fa-chart-bar',
    title: 'CRM Dashboard',
    desc: 'Suivez toutes vos réponses, filtrez, exportez et gérez vos leads depuis un tableau de bord unifié.',
    gradient: 'linear-gradient(135deg, #a5f3fc 0%, #cffafe 100%)',
    color: '#06b6d4',
  },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Coach de vie', text: 'FormSaaS a remplacé 3 outils différents. Mes clients réservent en ligne, je reçois les notifications sur Slack. Parfait !', avatar: '👩‍💼' },
  { name: 'Karim B.', role: 'Consultant RH', text: "L'interface en arabe avec RTL fonctionne parfaitement. Enfin un outil qui comprend le marché MENA.", avatar: '👨‍💼' },
  { name: 'Marie L.', role: 'Directrice agence', text: 'On gère 15 formulaires de leads clients. Le CRM intégré nous fait gagner 2h par jour.', avatar: '👩‍💻' },
];

const freeFeatures = ['1 formulaire', '10 réponses / mois', 'Calendrier basique', 'Partage public'];
const proFeatures = ['Formulaires illimités', 'Réponses illimitées', 'CRM complet', 'Google Calendar', 'Notifications Slack', 'Support prioritaire'];

const icons = [
  { icon: 'fa-envelope', color: '#ec4899', bg: '#fbcfe8' },
  { icon: 'fa-square-check', color: '#6366f1', bg: '#e9d5ff' },
  { icon: 'fa-calendar-days', color: '#3b82f6', bg: '#bfdbfe' },
  { icon: 'fa-chart-simple', color: '#06b6d4', bg: '#a5f3fc' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #f8f5ff 0%, #faf5ff 50%, #f0fdf4 100%)'
    }}>
      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-50" style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(99,102,241,0.1)'
      }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
            }}>
              <i className="fas fa-layer-group text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900">FormSaaS</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              Se connecter
            </button>
            <button onClick={() => navigate('/login')} className="btn-premium text-sm">
              Essayer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Floating icons */}
          <div className="relative h-96 hidden md:flex items-center justify-center">
            {icons.map((item, idx) => (
              <div key={idx}
                className="absolute w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 cursor-default"
                style={{
                  background: item.bg,
                  border: `2px solid white`,
                  transform: `rotate(${idx * 90}deg) translateY(-100px)`,
                  animation: `float 4s ease-in-out infinite`,
                  animationDelay: `${idx * 0.2}s`
                }}>
                <i className={`fas ${item.icon} text-2xl`} style={{ color: item.color }} />
              </div>
            ))}
          </div>

          {/* Right: Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-6 slide-in-up">
              ✨ NOUVELLE PLATEFORME
            </span>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1] slide-in-up text-gray-900"
              style={{ animationDelay: '0.1s' }}>
              L'outil qui remplace
              <br />
              <span className="text-gradient">
                Typeform + Calendly + HubSpot
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl slide-in-up"
              style={{ animationDelay: '0.2s' }}>
              Créez des formulaires intelligents, gérez vos rendez-vous et suivez vos leads — en 6 langues, incluant l'arabe et l'hébreu.
            </p>

            <div className="flex flex-wrap gap-4 slide-in-up" style={{ animationDelay: '0.3s' }}>
              <button onClick={() => navigate('/login')} className="btn-premium">
                Commencer gratuitement →
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary">
                Voir la démo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Gratuit pour toujours · Pas de carte bancaire</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-500">Un seul outil. Zéro friction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={f.title}
                className="card-float p-8 hover:-translate-y-3 transition-all duration-500 slide-in-up cursor-default"
                style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110 hover:rotate-6"
                  style={{ background: f.gradient }}>
                  <i className={`fas ${f.icon} text-2xl`} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Tarifs simples</h2>
            <p className="text-lg text-gray-500">Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="card-float p-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase text-gray-500">Gratuit</span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-5xl font-black text-gray-900">$0</span>
                  <span className="text-gray-500">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <i className="fas fa-check-circle text-purple-500 text-xs" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')} className="btn-secondary w-full">
                Commencer
              </button>
            </div>

            {/* Pro */}
            <div className="card-float p-8 relative border-2" style={{
              borderColor: '#6366f1',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
              boxShadow: '0 16px 48px rgba(99,102,241,0.2)'
            }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full"
                style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                ⭐ POPULAIRE
              </span>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase text-purple-600">Pro</span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-5xl font-black text-gradient">$6</span>
                  <span className="text-gray-500">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <i className="fas fa-check-circle text-pink-500 text-xs" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')} className="btn-premium w-full">
                Commencer Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-16">
            Ce que disent nos utilisateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={t.name}
                className="card-float p-8 hover:-translate-y-2 transition-all duration-500 slide-in-up float"
                style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400 text-sm" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="card-float p-12 text-center" style={{
            background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
            borderColor: 'rgba(99,102,241,0.2)',
            boxShadow: '0 16px 48px rgba(99,102,241,0.12)'
          }}>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Prêt à simplifier votre workflow ?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Rejoignez des centaines d'entrepreneurs qui gagnent du temps chaque jour.
            </p>
            <button onClick={() => navigate('/login')} className="btn-premium">
              Créer mon compte gratuitement
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 text-center text-sm text-gray-400"
        style={{ borderTop: '1px solid #f3f4f6' }}>
        © {new Date().getFullYear()} FormSaaS · Forms · Bookings · CRM
      </footer>
    </div>
  );
}
