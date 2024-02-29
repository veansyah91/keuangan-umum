export default function InputLabel({ value, className = '', fontSize = ' text-[1rem]', children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 ` + className + fontSize}>
            {value ? value : children}
        </label>
    );
}
