import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentDesktop({ receivable, className, role, handleDelete, handleEdit }) {
    return (
        <>
            <tr className={className}>
                <td>{receivable.contact.name}</td>
                <td>{receivable.contact.student.no_ref ?? ''}</td>
                <td>{receivable.contact.last_level?.level}</td>
                <td className='text-end'>IDR. { formatNumber(receivable.value) }</td>
                <td className='text-end'>
                    {role !== 'viewer' && (
                        <div className='dropdown dropdown-left'>
                            <div
                                tabIndex={0}
                                role='button'
                                className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
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
                </td>
            </tr>
        </>
    );
}
