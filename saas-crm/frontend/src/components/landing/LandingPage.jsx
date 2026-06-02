import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: 'fa-wpforms',
    title: 'Form Builder',
    desc: 'Créez des formulaires multi-langues avec logique conditionnelle, quiz et champs personnalisés.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glow: 'rgba(102,126,234,0.4)',
  },
  {
    icon: 'fa-calendar-check',
    title: 'Booking & RDV',
    desc: 'Gérez vos rendez-vous avec Google Calendar intégré, rappels automatiques et créneaux intelligents.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    glow: 'rgba(240,147,251,0.4)',
  },
  {
    icon: 'fa-chart-bar',
    title: 'CRM Dashboard',
    desc: 'Suivez toutes vos réponses, filtrez, exportez et gérez vos leads depuis un tableau de bord unifié.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)',
    glow: 'rgba(79,172,254,0.4)',
  },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Coach de vie', text: 'FormSaaS a remplacé 3 outils différents. Mes clients réservent en ligne, je reçois les notifications sur Slack. Parfait !', avatar: '👩‍💼' },
  { name: 'Karim B.', role: 'Consultant RH', text: "L'interface en arabe avec RTL fonctionne parfaitement. Enfin un outil qui comprend le marché MENA.", avatar: '👨‍💼' },
  { name: 'Marie L.', role: 'Directrice agence', text: 'On gère 15 formulaires de leads clients. Le CRM intégré nous fait gagner 2h par jour.', avatar: '👩‍💻' },
];

const freeFeatures = ['1 formulaire', '10 réponses / mois', 'Calendrier basique', 'Partage public'];
const proFeatures = ['Formulaires illimités', 'Réponses illimitées', 'CRM complet', 'Google Calendar', 'Notifications Slack', 'Support prioritaire'];

const stats = [
  { value: '10K+', label: 'Utilisateurs actifs' },
  { value: '500K+', label: 'Réponses collectées' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '6', label: 'Langues supportées' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #7b61ff 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #e91e8c 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #00d4aa 0%, transparent 70%)' }} />
      </div>

      {/* ===== NAV ===== */}
      <nav className="relative z-50 sticky top-0" style={{
        background: 'rgba(15,12,41,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)' }}>
              <i className="fas fa-layer-group text-white text-sm" />
            </div>
            <span className="font-bold text-white text-lg">FormSaaS</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-white/70 text-sm font-medium hover:text-white transition-colors rounded-xl hover:bg-white/5">
              Se connecter
            </button>
            <button onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
                boxShadow: '0 4px 20px rgba(123,97,255,0.4)'
              }}>
              Essayer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 slide-in-up"
            style={{
              background: 'rgba(123,97,255,0.15)',
              border: '1px solid rgba(123,97,255,0.3)',
              backdropFilter: 'blur(10px)'
            }}>
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" style={{ boxShadow: '0 0 8px #4ade80' }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              ✨ Forms · Bookings · CRM — tout en un
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-[1.1] slide-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">L'outil qui remplace</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 40%, #f472b6 70%, #fb923c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 4s ease infinite'
            }}>
              Typeform + Calendly + HubSpot
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto slide-in-up"
            style={{ color: 'rgba(255,255,255,0.6)', animationDelay: '0.2s' }}>
            Créez des formulaires intelligents, gérez vos rendez-vous et suivez vos leads — en 6 langues, incluant l'arabe et l'hébreu.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center slide-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => navigate('/login')}
              className="btn-premium text-lg px-10 py-4">
              Commencer gratuitement →
            </button>
            <button onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}>
              Voir la démo
            </button>
          </div>
          <p className="text-sm mt-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Gratuit pour toujours · Pas de carte bancaire requise
          </p>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 slide-in-up" style={{ animationDelay: '0.5s' }}>
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl px-6 py-5 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)'
                }}>
                <p className="text-3xl font-black mb-1" style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Tout ce dont vous
              <span style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}> avez besoin</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-lg">Un seul outil. Zéro friction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={f.title}
                className="relative group rounded-3xl p-8 cursor-default transition-all duration-500 hover:-translate-y-3 slide-in-up"
                style={{
                  animationDelay: `${idx * 0.15}s`,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)'
                }}>
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `0 20px 60px ${f.glow}` }} />

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: f.gradient, boxShadow: `0 8px 32px ${f.glow}` }}>
                  <i className={`fas ${f.icon} text-2xl text-white`} />
                </div>

                <h3 className="font-bold text-white mb-3 text-xl">{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-sm leading-relaxed">{f.desc}</p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: f.gradient }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Tarifs simples</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-lg">Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
              }}>
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Gratuit</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-6xl font-black text-white">$0</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(123,97,255,0.2)' }}>
                      <i className="fas fa-check text-xs" style={{ color: '#a78bfa' }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white'
                }}>
                Commencer gratuitement
              </button>
            </div>

            {/* Pro */}
            <div className="relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'linear-gradient(135deg, rgba(123,97,255,0.2) 0%, rgba(233,30,140,0.15) 100%)',
                border: '1px solid rgba(123,97,255,0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(123,97,255,0.2)'
              }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)', boxShadow: '0 4px 20px rgba(123,97,255,0.5)' }}>
                ⭐ PLUS POPULAIRE
              </span>
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>Pro</span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-6xl font-black" style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>$6</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)' }}>
                      <i className="fas fa-check text-xs text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')}
                className="btn-premium w-full py-3.5 text-sm">
                Commencer avec Pro →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-16">
            Ce que disent nos <span style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>utilisateurs</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={test.name}
                className="rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 float"
                style={{
                  animationDelay: `${idx * 0.3}s`,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)'
                }}>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  "{test.text}"
                </p>
                <div className="flex items-center gap-4 pt-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-3xl">{test.avatar}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{test.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(123,97,255,0.3) 0%, rgba(233,30,140,0.2) 100%)',
              border: '1px solid rgba(123,97,255,0.4)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 40px 100px rgba(123,97,255,0.3)'
            }}>
            {/* Background glow orbs */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7b61ff, transparent)' }} />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #e91e8c, transparent)' }} />

            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 relative z-10">
              Prêt à simplifier<br />votre workflow ?
            </h2>
            <p className="mb-10 text-lg relative z-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Rejoignez des centaines d'entrepreneurs qui gagnent du temps chaque jour.
            </p>
            <button onClick={() => navigate('/login')}
              className="relative z-10 btn-premium text-lg px-12 py-4">
              Créer mon compte gratuitement ✨
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-8 px-6 text-center text-sm"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.3)'
        }}>
        © {new Date().getFullYear()} FormSaaS · Forms · Bookings · CRM
      </footer>
    </div>
  );
}
