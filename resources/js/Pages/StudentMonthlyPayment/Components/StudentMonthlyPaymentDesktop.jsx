import BadgePrimary from '@/Components/Badges/BadgePrimary';
import BadgeSecondary from '@/Components/Badges/BadgeSecondary';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentDesktop({ payment, className, role, handleDelete, handleEdit }) {
    return (
        <>
            <tr className={className}>
                <td>{dayjs(payment.date).locale('id').format('MMMM DD, YYYY')}</td>
                <td>
                    <div className='text-xs'>
                        No. Siswa: {payment.contact.student.no_ref}
                    </div>
                    <div>
                        {payment.contact.name}
                    </div>
                </td>
                <td>{formatMonth(payment.month)} ({payment.month})</td>
                <td>{payment.study_year}</td>
                <td className='text-end'>IDR. { formatNumber(payment.value) }</td>
                <td className='text-start'>
                    {
                        payment.type == 'now' && <BadgeSuccess>Lunas</BadgeSuccess>
                    }
                    {
                        payment.type == 'prepaid' && <BadgePrimary>Bayar Dimuka</BadgePrimary>
                    }
                    {
                        payment.type == 'receivable' && <BadgeSecondary>Belum Bayar</BadgeSecondary>
                    }
                </td>
                <td className='text-end'>
                    {(role !== 'viewer' && payment.type !== 'receivable') && (
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
