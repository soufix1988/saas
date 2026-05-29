import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { FIELD_TYPES } from './FieldTypes';
import ConditionalLogicEditor from './ConditionalLogic';
import translations from '../../i18n/translations';
import { useAuth } from '../../hooks/useAuth.jsx';

const FONTS = ["'Poppins', sans-serif", "'Roboto', sans-serif", "'Montserrat', sans-serif", "'Cairo', sans-serif"];
const ICONS = ['fa-leaf','fa-star','fa-heart','fa-bolt','fa-graduation-cap','fa-stethoscope','fa-briefcase','fa-home','fa-globe','fa-rocket'];
const PATTERNS = ['bg-solid','bg-dots','bg-grid','bg-waves','bg-zigzag','bg-hexagons','bg-triangles','bg-circles','bg-crosshatch'];
const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const PART_LIMITS = ['unlimited','once','daily','weekly'];

const DEFAULT_FORM = {
  nom: '',
  langue: 'fr',
  rtl: false,
  theme: 'light',
  font: "'Poppins', sans-serif",
  color: '#9cf566',
  text_color: '#111827',
  icon: 'fa-leaf',
  adv_config: {},
};

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const [form, setForm] = useState(DEFAULT_FORM);
  const [fields, setFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('fields'); // fields | design | advanced | appointment

  useEffect(() => {
    if (id) {
      api.get(`/api/forms/${id}`).then(({ form: f, fields: fs }) => {
        setForm(f);
        setFields(fs || []);
      }).catch(() => addToast('Erreur chargement', 'error'));
    }
  }, [id]);

  function setAdv(key, val) {
    setForm(f => ({ ...f, adv_config: { ...f.adv_config, [key]: val } }));
  }

  function addField() {
    setFields(prev => [...prev, {
      _tmpId: Date.now(),
      label: '',
      type: 'text',
      options: '',
      requis: false,
      logique: '',
      is_unique: false,
      description: '',
      desc_style: 'light',
      correct_answer: '',
      points: 0,
      image_url: '',
    }]);
  }

  function updateField(idx, key, val) {
    setFields(prev => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  }

  function removeField(idx) {
    setFields(prev => prev.filter((_, i) => i !== idx));
  }

  function moveField(idx, dir) {
    const arr = [...fields];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setFields(arr);
  }

  async function handleSave() {
    if (!form.nom.trim()) { addToast('Nom requis', 'error'); return; }
    setSaving(true);
    try {
      if (id) {
        await api.put(`/api/forms/${id}`, { ...form, fields });
        addToast('Formulaire mis à jour');
      } else {
        const newForm = await api.post('/api/forms', form);
        await api.put(`/api/forms/${newForm.id}`, { ...form, fields });
        addToast('Formulaire créé');
        navigate(`/forms/${newForm.id}/edit`);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  const shareUrl = id ? `${window.location.origin}/public?formId=${id}` : '';

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{id ? t.edit : t.newForm}</h1>
        <div className="flex gap-2">
          {id && (
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); addToast('Lien copié !'); }}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <i className="fas fa-link" /> {t.copyLink}
            </button>
          )}
          <button onClick={() => navigate('/forms')} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
            {t.cancel}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-60 flex items-center gap-2">
            <i className="fas fa-save" /> {saving ? '...' : t.save}
          </button>
        </div>
      </div>

      {/* Form name */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <input
          type="text"
          value={form.nom}
          onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
          placeholder={t.formName + ' *'}
          className="w-full text-xl font-semibold border-0 outline-none bg-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {['fields','design','advanced','appointment'].map(tab_ => (
          <button key={tab_} onClick={() => setTab(tab_)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors
              ${tab === tab_ ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
            {tab_ === 'fields' ? 'Champs' : tab_ === 'design' ? 'Design' : tab_ === 'advanced' ? 'Avancé' : 'Rendez-vous'}
          </button>
        ))}
      </div>

      {/* Tab: Fields */}
      {tab === 'fields' && (
        <div className="space-y-3">
          {fields.map((field, idx) => (
            <FieldEditor
              key={field._tmpId || field.id || idx}
              field={field}
              idx={idx}
              allFields={fields}
              onChange={(key, val) => updateField(idx, key, val)}
              onRemove={() => removeField(idx)}
              onMoveUp={() => moveField(idx, -1)}
              onMoveDown={() => moveField(idx, 1)}
              isQuiz={!!form.adv_config?.isQuiz}
              t={t}
            />
          ))}
          <button onClick={addField}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <i className="fas fa-plus" /> {t.addField}
          </button>
        </div>
      )}

      {/* Tab: Design */}
      {tab === 'design' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t.primaryColor}</label>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Couleur texte</label>
              <input type="color" value={form.text_color} onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Police</label>
            <select value={form.font} onChange={e => setForm(f => ({ ...f, font: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t.icon}</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors
                    ${form.icon === ic ? 'border-gray-900 bg-gray-100' : 'border-gray-200 hover:border-gray-400'}`}>
                  <i className={`fas ${ic}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t.bgPattern}</label>
            <div className="grid grid-cols-3 gap-2">
              {PATTERNS.map(p => (
                <button key={p} type="button" onClick={() => setAdv('pattern', p)}
                  className={`h-14 rounded-lg border-2 ${form.adv_config?.pattern === p ? 'border-gray-900' : 'border-gray-200'} ${p}`}>
                  <span className="text-xs text-gray-600">{p.replace('bg-','')}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <input type="checkbox" checked={form.rtl} onChange={e => setForm(f => ({ ...f, rtl: e.target.checked }))} />
              {t.rtl}
            </label>
          </div>
        </div>
      )}

      {/* Tab: Advanced */}
      {tab === 'advanced' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t.successMessage}</label>
            <textarea value={form.adv_config?.successMessage || ''} onChange={e => setAdv('successMessage', e.target.value)}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t.openDate}</label>
              <input type="datetime-local" value={form.adv_config?.openDate || ''} onChange={e => setAdv('openDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t.closeDate}</label>
              <input type="datetime-local" value={form.adv_config?.closeDate || ''} onChange={e => setAdv('closeDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t.participation}</label>
            <select value={form.adv_config?.participation || 'unlimited'} onChange={e => setAdv('participation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {PART_LIMITS.map(p => <option key={p} value={p}>{t[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t.timer}</label>
            <input type="number" min="0" value={form.adv_config?.timer || ''} onChange={e => setAdv('timer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.adv_config?.isQuiz} onChange={e => setAdv('isQuiz', e.target.checked)} />
            <span className="text-sm font-medium">{t.quiz}</span>
          </label>
        </div>
      )}

      {/* Tab: Appointment */}
      {tab === 'appointment' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.adv_config?.isAppointment} onChange={e => setAdv('isAppointment', e.target.checked)} />
            <span className="text-sm font-semibold">{t.appointment}</span>
          </label>

          {form.adv_config?.isAppointment && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t.validation}</label>
                <select value={form.adv_config?.aptValidation || 'direct'} onChange={e => setAdv('aptValidation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="direct">{t.direct}</option>
                  <option value="manual">{t.manual}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.duration}</label>
                  <input type="number" min="5" step="5" value={form.adv_config?.aptDuration || 30}
                    onChange={e => setAdv('aptDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.capacity}</label>
                  <input type="number" min="1" value={form.adv_config?.aptCapacity || 1}
                    onChange={e => setAdv('aptCapacity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.startTime}</label>
                  <input type="time" value={form.adv_config?.aptStart || '09:00'} onChange={e => setAdv('aptStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.endTime}</label>
                  <input type="time" value={form.adv_config?.aptEnd || '18:00'} onChange={e => setAdv('aptEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.lunchStart}</label>
                  <input type="time" value={form.adv_config?.aptLunchStart || ''} onChange={e => setAdv('aptLunchStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t.lunchEnd}</label>
                  <input type="time" value={form.adv_config?.aptLunchEnd || ''} onChange={e => setAdv('aptLunchEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t.daysOff}</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day, i) => {
                    const daysOff = form.adv_config?.aptDaysOff || [];
                    const checked = daysOff.includes(i);
                    return (
                      <label key={day} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input type="checkbox" checked={checked} onChange={e => {
                          const arr = [...(form.adv_config?.aptDaysOff || [])];
                          if (e.target.checked) setAdv('aptDaysOff', [...arr, i]);
                          else setAdv('aptDaysOff', arr.filter(d => d !== i));
                        }} />
                        {day}
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FieldEditor({ field, idx, allFields, onChange, onRemove, onMoveUp, onMoveDown, isQuiz, t }) {
  const [expanded, setExpanded] = useState(true);
  const showOptions = ['select','radio','checkbox'].includes(field.type);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 p-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={e => { e.stopPropagation(); onMoveUp(); }} className="text-gray-300 hover:text-gray-600 leading-none"><i className="fas fa-chevron-up text-xs" /></button>
          <button type="button" onClick={e => { e.stopPropagation(); onMoveDown(); }} className="text-gray-300 hover:text-gray-600 leading-none"><i className="fas fa-chevron-down text-xs" /></button>
        </div>
        <span className="flex-1 text-sm font-medium truncate">{field.label || `Champ ${idx + 1}`}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{field.type}</span>
        {field.requis && <span className="text-xs text-red-400">*</span>}
        <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }} className="text-red-400 hover:text-red-600 ml-1">
          <i className="fas fa-trash text-sm" />
        </button>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-400 text-xs`} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t.fieldLabel} *</label>
              <input value={field.label} onChange={e => onChange('label', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t.fieldType}</label>
              <select value={field.type} onChange={e => onChange('type', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none">
                {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>
            </div>
          </div>

          {showOptions && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{t.options} (virgule)</label>
              <input value={field.options} onChange={e => onChange('options', e.target.value)}
                placeholder="Option A, Option B, Option C"
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t.description}</label>
            <div className="flex gap-2">
              <input value={field.description} onChange={e => onChange('description', e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
              <select value={field.desc_style} onChange={e => onChange('desc_style', e.target.value)}
                className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg">
                <option value="light">léger</option>
                <option value="bold">gras</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
            <input value={field.image_url} onChange={e => onChange('image_url', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t.logic}</label>
            <ConditionalLogicEditor
              value={field.logique}
              onChange={val => onChange('logique', val)}
              fields={allFields.filter((_, i) => i < allFields.indexOf ? allFields.indexOf(field) : true).filter(f => f.label)}
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={field.requis} onChange={e => onChange('requis', e.target.checked)} />
              {t.required}
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={field.is_unique} onChange={e => onChange('is_unique', e.target.checked)} />
              {t.unique}
            </label>
          </div>

          {isQuiz && (
            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Bonne réponse</label>
                <input value={field.correct_answer} onChange={e => onChange('correct_answer', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Points</label>
                <input type="number" min="0" value={field.points} onChange={e => onChange('points', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
