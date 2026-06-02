import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForms } from '../../hooks/useForms';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useToast } from '../ui/Toast';
import api from '../../lib/api';
import Modal from '../ui/Modal';
import translations from '../../i18n/translations';

const TEMPLATES = [
  {
    nom: 'Prise de RDV',
    icon: 'fa-calendar-check',
    color: '#6366f1',
    langue: 'fr',
    adv_config: { isAppointment: true, aptDuration: 30, aptValidation: 'auto' },
    fields: [
      { label: 'Nom complet', type: 'text', requis: true },
      { label: 'Email', type: 'email', requis: true },
      { label: 'Téléphone', type: 'tel', requis: false },
      { label: 'Service', type: 'select', options: 'Consultation|Formation|Coaching', requis: true },
      { label: 'Notes', type: 'textarea', requis: false },
    ],
  },
  {
    nom: 'Feedback Client',
    icon: 'fa-star',
    color: '#f59e0b',
    langue: 'fr',
    adv_config: {},
    fields: [
      { label: 'Nom', type: 'text', requis: false },
      { label: 'Email', type: 'email', requis: false },
      { label: 'Note', type: 'select', options: '⭐⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐|⭐⭐|⭐', requis: true },
      { label: 'Commentaire', type: 'textarea', requis: false },
    ],
  },
  {
    nom: 'Inscription Newsletter',
    icon: 'fa-envelope',
    color: '#10b981',
    langue: 'fr',
    adv_config: {},
    fields: [
      { label: 'Nom', type: 'text', requis: true },
      { label: 'Email', type: 'email', requis: true },
      { label: 'Ville', type: 'text', requis: false },
    ],
  },
  {
    nom: 'Devis en ligne',
    icon: 'fa-file-invoice',
    color: '#3b82f6',
    langue: 'fr',
    adv_config: {},
    fields: [
      { label: 'Nom', type: 'text', requis: true },
      { label: 'Entreprise', type: 'text', requis: false },
      { label: 'Email', type: 'email', requis: true },
      { label: 'Téléphone', type: 'tel', requis: false },
      { label: 'Description du projet', type: 'textarea', requis: true },
      { label: 'Budget', type: 'select', options: 'Moins de 1 000€|1 000 – 5 000€|5 000 – 10 000€|Plus de 10 000€', requis: false },
    ],
  },
  {
    nom: 'Candidature emploi',
    icon: 'fa-briefcase',
    color: '#8b5cf6',
    langue: 'fr',
    adv_config: {},
    fields: [
      { label: 'Nom', type: 'text', requis: true },
      { label: 'Prénom', type: 'text', requis: true },
      { label: 'Email', type: 'email', requis: true },
      { label: 'Téléphone', type: 'tel', requis: false },
      { label: 'Poste souhaité', type: 'text', requis: true },
      { label: 'Message de motivation', type: 'textarea', requis: false },
    ],
  },
];

export default function FormsPage() {
  const { forms, loading, reload } = useForms();
  const { user, appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState(null);

  async function handleDelete(id) {
    await api.delete(`/api/forms/${id}`).catch(e => addToast(e.message, 'error'));
    addToast('Formulaire supprimé');
    setConfirmDelete(null);
    reload();
  }

  async function handleDuplicate(id) {
    await api.post(`/api/forms/${id}/duplicate`).catch(e => addToast(e.message, 'error'));
    addToast('Formulaire dupliqué');
    reload();
  }

  async function handleUseTemplate(tpl) {
    setCreatingTemplate(tpl.nom);
    try {
      const form = await api.post('/api/forms', {
        nom: tpl.nom,
        langue: tpl.langue,
        icon: tpl.icon,
        color: tpl.color,
        adv_config: tpl.adv_config,
      });
      if (tpl.fields?.length) {
        await api.put(`/api/forms/${form.id}`, {
          fields: tpl.fields.map((f, i) => ({ ...f, ordre: i + 1 })),
        });
      }
      addToast(`Formulaire "${tpl.nom}" créé !`);
      setShowTemplates(false);
      navigate(`/forms/${form.id}/edit`);
    } catch (e) {
      addToast(e.message, 'error');
    } finally {
      setCreatingTemplate(null);
    }
  }

  const shareUrl = id => `${window.location.origin}/public?formId=${id}`;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t.forms}</h1>
        {user?.isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => setShowTemplates(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <i className="fas fa-magic" /> Templates
            </button>
            <button onClick={() => navigate('/forms/new')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
              <i className="fas fa-plus" /> {t.newForm}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <i className="fas fa-spinner fa-spin text-gray-400 text-2xl" />
        </div>
      ) : forms.length === 0 && user?.isAdmin ? (
        /* Onboarding welcome */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-layer-group text-3xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur FormSaaS ! 🎉</h2>
          <p className="text-gray-500 mb-8 max-w-sm">Créez votre premier formulaire ou partez d'un modèle prêt à l'emploi.</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => navigate('/forms/new')}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2">
              <i className="fas fa-plus" /> Créer un formulaire vide
            </button>
            <button onClick={() => setShowTemplates(true)}
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
              <i className="fas fa-magic" /> Choisir un template
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, idx) => (
            <div key={form.id}
              className="group glass rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-white/40 hover:border-white/80"
              style={{ '--form-color': form.color || '#9cf566', animationDelay: `${idx * 0.05}s` }}>
              <div className="h-1.5 bg-gradient-to-r" style={{ background: `linear-gradient(90deg, var(--form-color), var(--form-color))` }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: 'var(--form-color)' + '20' }}>
                      <i className={`fas ${form.icon || 'fa-leaf'} text-lg`} style={{ color: 'var(--form-color)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">{form.nom}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mt-1 ${form.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {form.statut}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs mb-5 flex-wrap">
                  {form.adv_config?.isAppointment && <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">📅 RDV</span>}
                  {form.adv_config?.isQuiz && <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">❓ Quiz</span>}
                  {form.langue && <span className="text-gray-600 font-medium">{form.langue.toUpperCase()}</span>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => navigate(`/forms/${form.id}/edit`)}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg bg-gray-100/80 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 transition-all duration-300 text-xs font-semibold"
                    title="Modifier">
                    <i className="fas fa-edit text-base" />
                    Éditer
                  </button>
                  <button onClick={() => window.open(`/public?formId=${form.id}`, '_blank')}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg bg-blue-100/60 text-blue-700 hover:bg-blue-200 transition-all duration-300 text-xs font-semibold"
                    title="Aperçu du formulaire">
                    <i className="fas fa-eye text-base" />
                    Voir
                  </button>
                  <button onClick={() => navigate(`/crm?formId=${form.id}`)}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg bg-gray-100/80 hover:bg-gray-200 text-gray-700 transition-all duration-300 text-xs font-semibold"
                    title="Voir les réponses">
                    <i className="fas fa-table text-base" />
                    CRM
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button onClick={() => { navigator.clipboard.writeText(shareUrl(form.id)); addToast('Lien copié !'); }}
                    className="px-2 py-2 rounded-lg bg-gray-100/60 hover:bg-gray-200 text-gray-600 transition-all duration-300 text-sm"
                    title="Copier le lien">
                    <i className="fas fa-link" />
                  </button>
                  <button onClick={() => handleDuplicate(form.id)}
                    className="px-2 py-2 rounded-lg bg-gray-100/60 hover:bg-gray-200 text-gray-600 transition-all duration-300 text-sm"
                    title="Dupliquer">
                    <i className="fas fa-copy" />
                  </button>
                  {user?.isAdmin && (
                    <button onClick={() => setConfirmDelete(form)}
                      className="px-2 py-2 rounded-lg bg-red-100/60 text-red-600 hover:bg-red-200 transition-all duration-300 text-sm"
                      title="Supprimer">
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTemplates(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Choisir un template</h2>
              <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATES.map(tpl => (
                <button key={tpl.nom} onClick={() => handleUseTemplate(tpl)} disabled={!!creatingTemplate}
                  className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left disabled:opacity-60">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tpl.color + '20' }}>
                    {creatingTemplate === tpl.nom
                      ? <i className="fas fa-spinner fa-spin" style={{ color: tpl.color }} />
                      : <i className={`fas ${tpl.icon}`} style={{ color: tpl.color }} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{tpl.nom}</p>
                    <p className="text-gray-400 text-xs">{tpl.fields.length} champs</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal open={!!confirmDelete} title="Supprimer ce formulaire ?"
        onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)}
        confirmLabel="Supprimer" danger>
        <p className="text-sm text-gray-600">Supprimer <strong>{confirmDelete?.nom}</strong> et toutes ses entrées ?</p>
      </Modal>
    </div>
  );
}
