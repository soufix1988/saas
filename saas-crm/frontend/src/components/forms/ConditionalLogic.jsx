/**
 * Evaluates if a field should be visible based on conditional logic string.
 * Logic format: "fieldLabel:value" — show this field only when that field equals that value.
 */
export function evaluateLogic(logicStr, formValues) {
  if (!logicStr || !logicStr.trim()) return true;
  const [fieldLabel, expectedValue] = logicStr.split(':');
  if (!fieldLabel || expectedValue === undefined) return true;
  const actual = formValues[fieldLabel.trim()];
  if (Array.isArray(actual)) return actual.includes(expectedValue.trim());
  return String(actual || '').trim() === expectedValue.trim();
}

export default function ConditionalLogicEditor({ value, onChange, fields }) {
  const parts = (value || '').split(':');
  const selectedField = parts[0] || '';
  const selectedValue = parts[1] || '';

  const field = fields.find(f => f.label === selectedField);
  const hasOptions = field && ['select', 'radio', 'checkbox'].includes(field.type);
  const optionsList = hasOptions ? (field.options || '').split(',').map(o => o.trim()).filter(Boolean) : [];

  function update(fld, val) {
    if (!fld) { onChange(''); return; }
    onChange(`${fld}:${val}`);
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <select
        value={selectedField}
        onChange={e => update(e.target.value, '')}
        className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none"
      >
        <option value="">— aucune —</option>
        {fields.map(f => (
          <option key={f.label} value={f.label}>{f.label}</option>
        ))}
      </select>
      {selectedField && (
        <>
          <span className="text-gray-400 text-sm">=</span>
          {optionsList.length > 0 ? (
            <select
              value={selectedValue}
              onChange={e => update(selectedField, e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none"
            >
              <option value="">—</option>
              {optionsList.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              type="text"
              value={selectedValue}
              onChange={e => update(selectedField, e.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none"
              placeholder="valeur"
            />
          )}
        </>
      )}
    </div>
  );
}
