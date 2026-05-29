export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <div className="relative">
      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-gray-400 transition-colors"
      />
    </div>
  );
}
