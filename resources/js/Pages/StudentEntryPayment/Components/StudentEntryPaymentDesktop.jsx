import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoEllipsisVerticalCircle, IoTrash } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StudentEntryPaymentDesktop({
  payment, className, role, handleDelete
}) {  
  return (
    <tr className={className}>
      <td>{dayjs(payment.date).locale('id').format('MMMM DD, YYYY')}</td>
      <td>{ payment.no_ref }</td>
      <td>
        <div className='text-xs'>
          No. Siswa: {payment.contact.student.no_ref}
        </div>
        <div>
          {payment.contact.name}
        </div>
      </td>
      <td>{payment.study_year}</td>
      <td className='text-end'>IDR. { formatNumber(payment.value) }</td>
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
                  href={route('cashflow.student-entry-payment.show', {organization: payment.organization_id, payment: payment.id})}
                >
                  <LiaFileInvoiceSolid />
                    Detail / Cetak 
                </Link>
              </li>
              {
                !payment.receivable_ledger && 
                <li>
                  <Link href={route('cashflow.student-entry-payment.edit', { organization: payment.organization_id, payment: payment.id })}>
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