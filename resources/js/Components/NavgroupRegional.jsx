import { Link } from '@inertiajs/react';
import React from 'react';

export default function NavgroupRegional() {
    return (
        <ul className='menu bg-white rounded-box '>
            <li className={route().current('admin.data-master.province') ? 'border-l-2 border-gray-900' : undefined}>
                <Link href={route('admin.data-master.province')} className='px-2'>
                    Provinsi
                </Link>
            </li>
            <li className={route().current('admin.data-master.regency') ? 'border-l-2 border-gray-900' : undefined}>
                <Link href={route('admin.data-master.regency')} className='px-2'>
                    Kabupaten / Kota
                </Link>
            </li>
            <li className={route().current('admin.data-master.district') ? 'border-l-2 border-gray-900' : undefined}>
                <Link href={route('admin.data-master.district')} className='px-2'>
                    Kecamatan
                </Link>
            </li>
            <li className={route().current('admin.data-master.village') ? 'border-l-2 border-gray-900' : undefined}>
                <Link href={route('admin.data-master.village')} className='px-2'>
                    Desa / Kelurahan
                </Link>
            </li>
        </ul>
    );
}
