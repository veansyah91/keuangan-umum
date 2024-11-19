import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react'
import { FiEdit } from 'react-icons/fi';
import { IoEllipsisVertical } from 'react-icons/io5';

export default function WhatsappInvoiceDesktop(
  {whatsappPlugin, handleEdit, className}
) {  
  return (
    <tr className={className}>
      <td className=''>{ whatsappPlugin.organization.name }</td>
      <td className=''>{ whatsappPlugin.phone }</td>
      <td className=''>{ whatsappPlugin.expired_date ? dayjs(whatsappPlugin.expired_date).locale('id').format('DD MMMM YYYY') : '-' }</td>
      <td className=''>
        <div>App Key: { whatsappPlugin.appKey ?? "-" }</div>
        <div>Auth Key: { whatsappPlugin.authKey ?? "-" }</div>
      </td>
      <td className={ whatsappPlugin.connection ? 'text-green-600' : 'text-red-600' }>{ whatsappPlugin.connection ? 'connected' : 'disconnected' }</td>
      <td className=''>{ whatsappPlugin.expired_date ? dayjs(whatsappPlugin.expired_date).locale('id').format('DD MMMM YYYY') : '-' }</td>
      <td className={ whatsappPlugin.status ? 'text-green-600' : 'text-red-600' }>{ whatsappPlugin.status ? 'Aktif' : 'Tidak Aktif'}</td>
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
