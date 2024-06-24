import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center mb-1 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none text-[#4f8315]' +
                (active
                    ? ' focus:border-white font-extrabold'
                    : 'border-transparent opacity-60 hover:opacity-80 hover:border-white ') +
                className
            }>
            {children}
        </Link>
    );
}
