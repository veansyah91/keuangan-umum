import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import DropdownAction from '@/Components/DropdownAction';
import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentMobile({ receivable, role, handleDelete, handleEdit }) {
    console.log();
    
    return (
        <>
            <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
                <div className='text-start my-auto'>
                    <div>
                        {receivable.contact.name}
                    </div>
                    <div className='text-xs'>
                        <div>No Siswa: {receivable.contact.student.no_ref}</div>
                        <div>Kelas Terakhir: {receivable.contact.last_level?.level}</div>
                    </div>
                </div>
                <div className='text-end my-auto w-5/12'>
                    <div>IDR {formatNumber(receivable.value)}</div>
                </div>
                <div className='text-start'>
                    {role !== 'viewer' && (
                        <div className='dropdown dropdown-left'>
                            <div
                                tabIndex={0}
                                role='button'
                                className={`btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                                <IoEllipsisVertical />
                            </div>
                            <ul
                                tabIndex={0}
                                className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
                                <li>
                                    <button onClick={handleEdit}>
                                        <IoCreateOutline />
                                        Ubah
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleDelete}>
                                        <IoTrash />
                                        Hapus
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
