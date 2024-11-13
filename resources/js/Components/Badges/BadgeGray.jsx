export default function BadgeGray({ children, width = '' }) {
  return (
      <span
          className={`text-center inline-flex items-center rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10 ${width}`}>
          {children}
      </span>
  );
}
