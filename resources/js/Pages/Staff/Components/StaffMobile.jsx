import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import DropdownAction from '@/Components/DropdownAction';
import { Link } from '@inertiajs/react';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentMobile({ contact, role, handleDelete, handleEdit, handleShow }) {
    return (
        <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
            <div className='text-start my-auto w-8/12'>
                <div>{contact.name}</div>
                <div className='text-xs flex gap-2'>
                    <div>Tahun Masuk: </div>
                    <div>
                        {contact.staff.entry_year}
                    </div>
                </div>
                <div className='text-xs flex gap-2'>
                    <div>Posisi: </div>
                    <div>
                        {contact.staff.position}
                    </div>
                </div>
                <div className='text-xs flex gap-2'>
                    <div>Alamat:</div>
                    <div>{contact.address}</div>
                </div>
            </div>
            <div className='text-start my-auto w-3/12'>
            {
                contact.is_active 
                ? <BadgeSuccess>Aktif</BadgeSuccess>
                : <BadgeDanger>Tidak Aktif</BadgeDanger>
            }
            </div>
            <div className='text-start my-auto w-1/12'>
                {role !== 'viewer' && 
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
                                <button onClick={handleShow}>
                                    <IoSearchOutline />
                                    Detail
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

                }
            </div>
        </div>
    );
}