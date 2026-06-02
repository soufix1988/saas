export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <div className="relative flex-1 min-w-64 group">
      <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-hover:text-purple-500 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-gray-400"
      />
    </div>
  );
}
