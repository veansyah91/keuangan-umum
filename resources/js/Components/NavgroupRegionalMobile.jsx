import { Link } from '@inertiajs/react';
import React from 'react';

export default function NavgroupRegionalMobile({ onClick }) {
    return (
        <>
            <button onClick={onClick} className='bg-gray-900 text-white'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                </svg>
            </button>
            <Link
                className={`text-xs ${route().current('admin.data-master.province') ? 'active font-bold' : undefined}`}
                href={route('admin.data-master.province')}>
                Provinsi
            </Link>
            <Link
                className={`text-xs  ${route().current('admin.data-master.regency') ? 'active font-bold' : undefined}`}
                href={route('admin.data-master.regency')}>
                Kota / Kabupaten
            </Link>
            <Link
                className={`text-xs  ${route().current('admin.data-master.district') ? 'active font-bold' : undefined}`}
                href={route('admin.data-master.district')}>
                Kecamatan
            </Link>
            <Link
                className={`text-xs  ${route().current('admin.data-master.village') ? 'active font-bold' : undefined}`}
                href={route('admin.data-master.village')}>
                Kelurahan / Desa
            </Link>
        </>
    );
}
