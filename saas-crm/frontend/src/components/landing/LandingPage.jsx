import { useNavigate } from 'react-router-dom';

const features = [
  { icon: 'fa-wpforms', title: 'Form Builder', desc: 'Créez des formulaires multi-langues avec logique conditionnelle, quiz et champs personnalisés.', color: '#6366f1' },
  { icon: 'fa-calendar-check', title: 'Booking & RDV', desc: 'Gérez vos rendez-vous avec Google Calendar intégré, rappels automatiques et créneaux intelligents.', color: '#10b981' },
  { icon: 'fa-chart-bar', title: 'CRM Dashboard', desc: 'Suivez toutes vos réponses, filtrez, exportez et gérez vos leads depuis un tableau de bord unifié.', color: '#f59e0b' },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Coach de vie', text: 'FormSaaS a remplacé 3 outils différents. Mes clients réservent en ligne, je reçois les notifications sur Slack. Parfait !', avatar: '👩‍💼' },
  { name: 'Karim B.', role: 'Consultant RH', text: 'L\'interface en arabe avec RTL fonctionne parfaitement. Enfin un outil qui comprend le marché MENA.', avatar: '👨‍💼' },
  { name: 'Marie L.', role: 'Directrice agence', text: 'On gère 15 formulaires de leads clients. Le CRM intégré nous fait gagner 2h par jour.', avatar: '👩‍💻' },
];

const freeFeatures = ['1 formulaire', '10 réponses / mois', 'Calendrier basique', 'Partage public'];
const proFeatures = ['Formulaires illimités', 'Réponses illimitées', 'CRM complet', 'Google Calendar', 'Notifications Slack', 'Support prioritaire'];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-sans">
      {/* Nav */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="fas fa-layer-group text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FormSaaS</span>
          </div>
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Se connecter
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm mb-6 border border-indigo-200 font-medium text-indigo-700 slide-in-up">
            ✨ Forms · Bookings · CRM — tout en un
          </span>
          <h1 className="text-6xl font-bold mb-6 leading-tight slide-in-up" style={{animationDelay: '0.1s'}}>
            L'outil qui remplace<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift">
              Typeform + Calendly + HubSpot
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto slide-in-up" style={{animationDelay: '0.2s'}}>
            Créez des formulaires intelligents, gérez vos rendez-vous et suivez vos leads — en 6 langues, incluant l'arabe et l'hébreu.
          </p>
          <div className="flex gap-4 justify-center flex-wrap slide-in-up" style={{animationDelay: '0.3s'}}>
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
              Commencer gratuitement
            </button>
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium text-lg hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-0.5">
              Voir la démo →
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">Gratuit pour toujours · Pas de carte bancaire</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Un seul outil. Zéro friction.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={f.title}
                className="glass rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group border border-white/40"
                style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: f.color + '20' }}>
                  <i className={`fas ${f.icon} text-2xl`} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 via-transparent to-purple-100/30 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Tarifs simples</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="glass rounded-2xl p-8 border border-gray-200/60 hover:border-indigo-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-6">
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Gratuit</span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <i className="fas fa-check-circle text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')}
                className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-0.5">
                Commencer
              </button>
            </div>
            {/* Pro */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="rounded-2xl p-8 bg-white text-gray-900 relative hover:-translate-y-1 transition-all duration-500">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  ⭐ POPULAIRE
                </span>
                <div className="mb-6">
                  <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Pro</span>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$6</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {proFeatures.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                      <i className="fas fa-check-circle text-purple-600" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Commencer Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-white/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Ce que disent nos utilisateurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={t.name}
                className="glass rounded-2xl p-8 border border-white/40 hover:border-indigo-200/60 transition-all duration-500 hover:shadow-lg hover:-translate-y-2 float"
                style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-yellow-400 text-sm" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <span className="text-3xl">{t.avatar}</span>
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

      {/* CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-white slide-in-up">Prêt à simplifier votre workflow ?</h2>
          <p className="text-white/90 mb-10 text-lg slide-in-up" style={{animationDelay: '0.1s'}}>Rejoignez des centaines d'entrepreneurs qui gagnent du temps chaque jour.</p>
          <button onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg slide-in-up"
            style={{animationDelay: '0.2s'}}>
            Créer mon compte gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FormSaaS · Forms · Bookings · CRM
      </footer>
    </div>
  );
}
