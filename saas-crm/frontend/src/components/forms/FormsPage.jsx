import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForms } from '../../hooks/useForms';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useToast } from '../ui/Toast';
import api from '../../lib/api';
import Modal from '../ui/Modal';
import translations from '../../i18n/translations';

export default function FormsPage() {
  const { forms, loading, reload } = useForms();
  const { user, appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  const shareUrl = id => `${window.location.origin}/public?formId=${id}`;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t.forms}</h1>
        {user?.isAdmin && (
          <button onClick={() => navigate('/forms/new')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
            <i className="fas fa-plus" /> {t.newForm}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t.loading}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map(form => (
            <div key={form.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: form.color + '30' }}>
                    <i className={`fas ${form.icon || 'fa-leaf'}`} style={{ color: form.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{form.nom}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${form.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {form.statut}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400 text-xs mb-4 flex-wrap">
                {form.adv_config?.isAppointment && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">RDV</span>}
                {form.adv_config?.isQuiz && <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Quiz</span>}
                {form.langue && <span>{form.langue.toUpperCase()}</span>}
              </div>

              <div className="flex gap-1 flex-wrap">
                <button onClick={() => navigate(`/forms/${form.id}/edit`)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1">
                  <i className="fas fa-edit" /> {t.edit}
                </button>
                <button onClick={() => window.open(`/public?formId=${form.id}`, '_blank')}
                  className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  title="Aperçu du formulaire">
                  <i className="fas fa-eye" />
                </button>
                <button onClick={() => navigate(`/crm?formId=${form.id}`)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                  title="Voir les réponses">
                  <i className="fas fa-table" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(shareUrl(form.id)); addToast('Lien copié !'); }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                  title="Copier le lien">
                  <i className="fas fa-link" />
                </button>
                <button onClick={() => handleDuplicate(form.id)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
                  title="Dupliquer">
                  <i className="fas fa-copy" />
                </button>
                {user?.isAdmin && (
                  <button onClick={() => setConfirmDelete(form)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                    title="Supprimer">
                    <i className="fas fa-trash" />
                  </button>
                )}
              </div>
            </div>
          ))}
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
