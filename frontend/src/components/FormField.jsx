export default function FormField({
  id,
  label,
  type = 'text',
  icon,
  value,
  onChange,
  error,
  autoComplete,
  placeholder
}) {
  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface-variant">
        {label}
      </label>
      <div
        className={[
          'flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-surface-container-high/60',
          'border transition-colors',
          error ? 'border-error' : 'border-transparent focus-within:border-primary'
        ].join(' ')}
      >
        {icon && <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
        />
      </div>
      {error && <span className="font-label-sm text-label-sm text-error">{error}</span>}
    </div>
  );
}
