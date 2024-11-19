import formatNumber from '@/Utils/formatNumber'
import dayjs from 'dayjs'
import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { IoEllipsisVertical } from 'react-icons/io5'

export default function WhatsappInvoiceDesktop(
  {invoice, handleEdit, className}
) {
  return (
    <tr className={className}>
      <td className=''>
        <div className='text-xs'>{ invoice.organization.id }</div>
        <div>{ invoice.organization.name }</div>
      </td>
      <td className=''>{ dayjs(invoice.created_at).locale('id').format('DD MMMM YYYY, HH:mm:ss') }</td>
      <td className=''>{ invoice.no_ref }</td>
      <td className='uppercase'>{ invoice.product }</td>
      <td className='text-end'>IDR. { formatNumber(invoice.price) }</td>
      <td className='text-center'>
        {invoice.status == 'paid' && <div className='italic text-green-600 my-auto'>Lunas</div>}
        {invoice.status == 'pending' && (
            <div className='italic text-yellow-600 my-auto'>Menunggu</div>
        )}
        {invoice.status == 'canceled' && <div className='italic text-red-600 my-auto'>Batal</div>}
        {invoice.status == 'paid' && (
            <div className='text-xs'>
                <div>Dikonfirmasi</div>
                <div>Oleh:{invoice.accepted_by.name}</div>
                <div>Pada:{dayjs(invoice.updated_at).format('MMM DD, YYYY')}</div>
            </div>
        )}
      </td>
      <td className='text-end'>
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
                <FiEdit />
                Edit
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  )
}
