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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #7b61ff, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #e91e8c, transparent)' }} />
      </div>
      <div className="text-center relative z-10 scale-in">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)', boxShadow: '0 16px 48px rgba(123,97,255,0.5)' }}>
          <i className="fas fa-spinner fa-spin text-3xl text-white" />
        </div>
        <p className="text-white/70 font-medium text-lg">Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      <div className="text-center p-10 rounded-3xl max-w-sm mx-4 scale-in"
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(239,68,68,0.3)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
        }}>
        <div className="text-6xl mb-5">❌</div>
        <p className="text-white/80 font-medium text-lg">{error}</p>
      </div>
    </div>
  );

  const formColor = data.form.color || '#7b61ff';

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: data?.appConfig?.app_bg_color || '#f0f4ff' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${formColor}80, transparent)` }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: `radial-gradient(circle, ${formColor}50, transparent)` }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto py-12 px-4">
        {/* Form header */}
        <div className="text-center mb-8 fade-in">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 hover:scale-110 hover:rotate-6"
            style={{
              background: `linear-gradient(135deg, ${formColor} 0%, ${formColor}99 100%)`,
              boxShadow: `0 16px 48px ${formColor}60`
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
