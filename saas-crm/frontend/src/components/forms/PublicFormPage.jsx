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
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #f8f5ff 0%, #faf5ff 50%, #f0fdf4 100%)'
    }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
          <i className="fas fa-spinner fa-spin text-2xl text-white" />
        </div>
        <p className="text-gray-600 font-medium">Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f8f5ff 0%, #faf5ff 50%, #f0fdf4 100%)'
    }}>
      <div className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-sm border border-gray-100">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-gray-700 font-medium text-lg">{error}</p>
      </div>
    </div>
  );

  const formColor = data.form.color || '#6366f1';

  return (
    <div className="min-h-screen" style={{ background: data?.appConfig?.app_bg_color || 'linear-gradient(135deg, #f8f5ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
      <div className="max-w-xl mx-auto py-12 px-4">
        {/* Form header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 hover:scale-110 hover:rotate-6"
            style={{
              background: `linear-gradient(135deg, ${formColor} 0%, ${formColor}99 100%)`,
              boxShadow: `0 8px 24px ${formColor}40`
            }}>
            <i className={`fas ${data.form.icon || 'fa-leaf'} text-3xl text-white`} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{data.form.nom}</h1>
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
