import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import FormRenderer from './FormRenderer';

export default function PublicFormPage() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) { setError('Aucun formulaire spécifié.'); setLoading(false); return; }
    api.get(`/api/forms/public/${formId}`)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4 block" />
        <p className="text-gray-500 font-medium">Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="glass rounded-2xl p-8 text-center border border-white/40 shadow-xl">
        <div className="text-6xl mb-5">❌</div>
        <p className="text-gray-700 font-medium text-lg">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen transition-all duration-500" style={{ background: data?.appConfig?.app_bg_color || '#f7f9fc' }}>
      <div className="max-w-xl mx-auto py-12 px-4">
        {/* Form header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            style={{ background: (data.form.color || '#111827') + '20', border: `2px solid ${data.form.color || '#111827'}` }}>
            <i className={`fas ${data.form.icon || 'fa-leaf'} text-2xl`} style={{ color: data.form.color || '#111827' }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.form.nom}</h1>
          <p className="text-gray-500 text-sm">Veuillez remplir le formulaire ci-dessous</p>
        </div>

        <FormRenderer
          form={data.form}
          fields={data.fields}
          standalone={false}
        />
      </div>
    </div>
  );
}
