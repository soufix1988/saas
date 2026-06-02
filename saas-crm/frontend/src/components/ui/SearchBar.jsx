export default function SearchBar({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <div className="relative flex-1 min-w-64 group">
      <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium focus:outline-none transition-all duration-300 hover:border-gray-300 placeholder:text-gray-400 text-gray-800"
        style={{ outline: 'none' }}
        onFocus={e => {
          e.target.style.borderColor = '#a78bfa';
          e.target.style.boxShadow = '0 0 0 4px rgba(167,139,250,0.12)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
