import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className='min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100'>
            <div>
                <img src='/img/logo.png' alt='logo' width={125} className='mx-auto mb-2 pb-2' />
                <Link href='/'>
                    <h2 className='font-bold text-[#053128] text-4xl'>Keuangan Umum</h2>
                </Link>
            </div>

            <div className='w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg'>
                {children}
            </div>
        </div>
    );
}
