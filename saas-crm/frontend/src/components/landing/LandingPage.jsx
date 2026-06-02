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
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <i className="fas fa-layer-group text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FormSaaS</span>
          </div>
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            Se connecter
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm mb-6 border border-white/20">
            ✨ Forms · Bookings · CRM — tout en un
          </span>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            L'outil qui remplace<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Typeform + Calendly + HubSpot
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Créez des formulaires intelligents, gérez vos rendez-vous et suivez vos leads — en 6 langues, incluant l'arabe et l'hébreu.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Commencer gratuitement
            </button>
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 border border-white/30 text-white rounded-xl font-medium text-lg hover:bg-white/10 transition-colors">
              Voir la démo →
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-6">Gratuit pour toujours · Pas de carte bancaire</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-center text-gray-500 mb-12">Un seul outil. Zéro friction.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color + '20' }}>
                  <i className={`fas ${f.icon} text-xl`} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Tarifs simples</h2>
          <p className="text-center text-gray-500 mb-12">Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gratuit</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <i className="fas fa-check text-gray-400" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')}
                className="w-full py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Commencer
              </button>
            </div>
            {/* Pro */}
            <div className="border-2 border-gray-900 rounded-2xl p-8 bg-gray-900 text-white relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                POPULAIRE
              </span>
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Pro</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">$6</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <i className="fas fa-check text-green-400" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')}
                className="w-full py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Commencer Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Ce que disent nos utilisateurs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à simplifier votre workflow ?</h2>
        <p className="text-gray-300 mb-8">Rejoignez des centaines d'entrepreneurs qui gagnent du temps chaque jour.</p>
        <button onClick={() => navigate('/login')}
          className="px-10 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
          Créer mon compte gratuitement
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FormSaaS · Forms · Bookings · CRM
      </footer>
    </div>
  );
}
