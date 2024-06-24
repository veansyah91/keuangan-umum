import BadgeSecondary from '@/Components/Badges/BadgeSecondary';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function CashInDesktop({ cashIn, className, handleDelete, handleEdit, role }) {
    // console.log(cashIn);
    return (
        <>
            <tr className={className}>
                <td>{dayjs(cashIn.date).format('MMM DD, YYYY')}</td>
                <td>{cashIn.no_ref}</td>
                <td>{cashIn.contact.name}</td>
                <td>{cashIn.description}</td>
                <td className='text-end'>IDR {formatNumber(cashIn.value)}</td>
                <td className='text-center'>
                    {cashIn.journal.is_approved ? (
                        <BadgeSuccess>Diterima</BadgeSuccess>
                    ) : (
                        <BadgeSecondary>Draft</BadgeSecondary>
                    )}
                </td>
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
                                    <Link
                                        href={route('cashflow.cash-in.edit', {
                                            organization: cashIn.organization_id,
                                            cashIn: cashIn.id,
                                        })}>
                                        <IoCreateOutline /> Edit
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('cashflow.cash-in.show', {
                                            organization: cashIn.organization_id,
                                            cashIn: cashIn.id,
                                        })}>
                                        <IoSearchOutline /> Detail / Tanda Terima
                                    </Link>
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
