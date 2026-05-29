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
    <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: data?.appConfig?.app_bg_color || '#f7f9fc' }}>
      <div className="max-w-xl mx-auto py-8 px-4">
        {/* Form header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: data.form.color || '#111827' }}>
            <i className={`fas ${data.form.icon || 'fa-leaf'} text-white text-xl`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.form.nom}</h1>
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
