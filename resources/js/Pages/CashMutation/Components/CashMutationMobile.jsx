import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function CashMutationMobile({ cashMutation, role, handleDelete }) {
    return (
        <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
            <div className='text-start my-auto w-1/2'>
                <div className='text-xs'>{dayjs(cashMutation.date).locale('id').format('MMM DD, YYYY')}</div>
                <div>{cashMutation.no_ref}</div>
                <div className='text-xs'>{cashMutation.description}</div>
            </div>
            <div className='text-end my-auto w-5/12'>
                <div>IDR {formatNumber(cashMutation.value)}</div>
            </div>
            <div className='text-start my-auto w-1/12'>
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
                                    href={route('cashflow.cash-mutation.edit', {
                                        organization: cashMutation.organization_id,
                                        cashMutation: cashMutation.id,
                                    })}>
                                    <IoCreateOutline /> Edit
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('cashflow.cash-mutation.show', {
                                        organization: cashMutation.organization_id,
                                        cashMutation: cashMutation.id,
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
            </div>
        </div>
    );
}
