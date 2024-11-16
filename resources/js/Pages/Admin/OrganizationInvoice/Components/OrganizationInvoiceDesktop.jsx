import rupiah from '@/Utils/rupiah';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5';

export default function OrganizationInvoiceDesktop({ organizationInvoice, className, handleEdit, ...props }) {
    return (
        <tr className={className} {...props}>
            <td>{organizationInvoice.organization.name}</td>
            <td>{organizationInvoice.no_ref}</td>
            <td>{organizationInvoice.product}</td>
            <td className='text-end'>{rupiah(organizationInvoice.price)}</td>
            <td>
                {organizationInvoice.status == 'paid' && <div className='italic text-green-600 my-auto'>Lunas</div>}
                {organizationInvoice.status == 'pending' && (
                    <div className='italic text-yellow-600 my-auto'>Menunggu</div>
                )}
                {organizationInvoice.status == 'canceled' && <div className='italic text-red-600 my-auto'>Batal</div>}
                {organizationInvoice.status == 'paid' && (
                    <div className='text-xs'>
                        <div>Dikonfirmasi</div>
                        <div>Oleh:{organizationInvoice.accepted_by.name}</div>
                        <div>Pada:{dayjs(organizationInvoice.updated_at).format('MMM DD, YYYY')}</div>
                    </div>
                )}
            </td>
            <td>{dayjs(organizationInvoice.created_at).format('MMM DD, YYYY')}</td>
            <td>
                <div className='dropdown dropdown-left'>
                    <div
                        tabIndex={organizationInvoice.status !== 'pending' ? '' : 0}
                        role='button'
                        className={`bg-inherit border-none -z-50 ${organizationInvoice.status !== 'pending' && 'text-gray-300'}`}>
                        <IoEllipsisVertical />
                    </div>
                    <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60'>
                        <li>
                            <button onClick={handleEdit}>
                                <IoCreateOutline />
                                Konfirmasi Pembayaran
                            </button>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    );
}
