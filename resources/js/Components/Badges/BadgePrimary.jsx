export default function BadgePrimary({ children, width = '' }) {
  return (
      <span
          className={`text-center inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 ring-1 ring-inset ring-cyan-600/10 ${width}`}>
          {children}
      </span>
  );
}

