import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StudentEntryReceivablePaymentDesktop({
  payment, className, role, handleDelete
}) {  
  return (
    <tr className={className}>
      <td className='text-start'>{dayjs(payment.date).locale('id').format('MMMM DD, YYYY')}</td>
      <td className='text-start'>{payment.no_ref}</td>
      <td>
        <div className='text-xs'>
          No. Siswa: {payment.payment.contact.student.no_ref}
        </div>
        <div>
          {payment.payment.contact.name}
        </div>
      </td>
      <td className='text-start'>{payment.study_year}</td>
      <td className='text-end'>IDR. { formatNumber(payment.credit) }</td>
      <td className='text-end'>
        {(role !== 'viewer') && (
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
                  href={route('cashflow.student-entry-receivable-payment.show', {
                        organization: payment.payment.organization_id, 
                        id: payment.id,
                        
                      })}
                >
                  <LiaFileInvoiceSolid />
                    Detail / Cetak 
                </Link>
              </li>
              {
                !payment.receivable_ledger && 
                <li>
                  <Link href={route('cashflow.student-entry-receivable-payment.edit', { 
                                    organization: payment.payment.organization_id, 
                                    id: payment.id,
                                    contact: payment.payment.contact.name,
                                    selectedContact: payment.payment.contact.id
                  })}>
                    <IoCreateOutline />
                    Ubah
                  </Link>
                </li>
              }    
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
  )
}
