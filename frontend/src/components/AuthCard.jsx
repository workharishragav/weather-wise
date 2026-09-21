export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] w-full">
      <div className="w-full max-w-md p-space-xl rounded-xl bg-surface-container-low/80 backdrop-blur-xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-container/15 blur-[90px] pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            {eyebrow && (
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">{eyebrow}</span>
            )}
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">{title}</h1>
            {subtitle && <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
