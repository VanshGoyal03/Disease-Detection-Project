/** Reusable controlled form input */
export default function FormInput({ id, label, type = 'text', value, onChange, placeholder = '' }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-green-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5
                   text-white placeholder-white/40 text-sm outline-none
                   focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
      />
    </div>
  )
}
