export const FIELD_TYPES = [
  { value: 'text', label: 'Texte court', icon: 'fa-font' },
  { value: 'textarea', label: 'Texte long', icon: 'fa-align-left' },
  { value: 'number', label: 'Nombre', icon: 'fa-hashtag' },
  { value: 'date', label: 'Date', icon: 'fa-calendar' },
  { value: 'select', label: 'Liste déroulante', icon: 'fa-chevron-down' },
  { value: 'radio', label: 'Choix unique', icon: 'fa-dot-circle' },
  { value: 'checkbox', label: 'Cases à cocher', icon: 'fa-check-square' },
];

export default function FieldInput({ field, value, onChange, disabled = false }) {
  const opts = (field.options || '').split(',').map(o => o.trim()).filter(Boolean);

  const cls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors text-sm";

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          required={field.requis}
          rows={3}
          className={cls + ' resize-none'}
        />
      );
    case 'number':
      return (
        <input type="number" value={value || ''} onChange={e => onChange(e.target.value)}
          disabled={disabled} required={field.requis} className={cls} />
      );
    case 'date':
      return (
        <input type="date" value={value || ''} onChange={e => onChange(e.target.value)}
          disabled={disabled} required={field.requis} className={cls} />
      );
    case 'select':
      return (
        <select value={value || ''} onChange={e => onChange(e.target.value)}
          disabled={disabled} required={field.requis} className={cls}>
          <option value="">— choisir —</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div className="space-y-1">
          {opts.map(o => (
            <label key={o} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={field.label} value={o} checked={value === o}
                onChange={() => onChange(o)} disabled={disabled} required={field.requis} />
              <span className="text-sm">{o}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-1">
          {opts.map(o => {
            const checked = Array.isArray(value) ? value.includes(o) : false;
            return (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => {
                    const arr = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) onChange([...arr, o]);
                    else onChange(arr.filter(v => v !== o));
                  }}
                  disabled={disabled}
                />
                <span className="text-sm">{o}</span>
              </label>
            );
          })}
        </div>
      );
    default:
      return (
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          disabled={disabled} required={field.requis} className={cls} />
      );
  }
}
