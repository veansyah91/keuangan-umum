import rupiah from '@/Utils/rupiah';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5';

export default function OrganizationInvoiceMobile({organizationInvoice, handleEdit, ...props}) {
    return (
        <div className='border-2' {...props}>
            <div className=' text-gray-900 py-2 border flex justify-between px-2'>
                <div className='w-1/2'>
                    <div>
                        {organizationInvoice.no_ref}
                    </div>
                    <div className='text-sm'>
                        {organizationInvoice.organization.name}
                    </div>
                    <div className='text-sm'>
                        Dibuat: {dayjs(organizationInvoice.created_at).format('MMM DD, YYYY') }
                    </div>
                </div>
                <div className='w-1/2 text-end flex justify-end gap-1'>
                    <div className='w-7/8'>
                        <div>{rupiah(organizationInvoice.price)}</div>
                        <div className='text-xs italic'>({organizationInvoice.product})</div>
                        <div className='text-sm font-bold'>
                            {organizationInvoice.status == 'paid' && <div className='text-green-600'>Lunas</div>}
                            {organizationInvoice.status == 'pending' && <div className='text-yellow-600'>Menunggu</div>}
                            {organizationInvoice.status == 'canceled' && <div className='text-red-600'>Batal</div>}
                            
                        </div>
                    </div>
                    <div className='w-1/8'>
                        
                        <div className="dropdown dropdown-left">
                            <div                             
                                tabIndex={organizationInvoice.status !== 'pending' ? '' : 0} 
                                role="button" className={`btn bg-white border-none hover:bg-gray-100 -z-50 ${organizationInvoice.status !== 'pending' && 'text-gray-300'}`}>
                                <IoEllipsisVertical />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60">
                                <li>                                
                                    <button 
                                        onClick={handleEdit}
                                    ><IoCreateOutline />Konfirmasi Pembayaran</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {
                organizationInvoice.accepted_by_user_id 
                && <div className='border p-2 text-xs bg-green-100'>
                    <div>
                        Dikonfirmasi
                    </div>
                    <div className='flex justify-between '>
                        <div>Oleh: {organizationInvoice.accepted_by.name}</div>
                        <div>Pada: {dayjs(organizationInvoice.updated_at).format('MMM DD, YYYY')}</div>
                    </div>
                </div>
            }
        </div>
    )
}
