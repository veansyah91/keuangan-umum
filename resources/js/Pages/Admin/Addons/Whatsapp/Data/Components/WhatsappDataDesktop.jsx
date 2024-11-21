import dayjs from 'dayjs';
import React from 'react'
import { FiEdit } from 'react-icons/fi';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiSignalTowerLine } from 'react-icons/ri';

export default function WhatsappDataDesktop(
  {whatsappPlugin, handleEdit, className, handleCheckConnection, processing}
) {  
  return (
    <tr className={className}>
      <td className=''>
        <div className='text-xs'>{ whatsappPlugin.organization.id }</div>
        <div>{ whatsappPlugin.organization.name }</div>        
      </td>
      <td className=''>{ whatsappPlugin.phone }</td>
      <td className=''>{ whatsappPlugin.expired_date ? dayjs(whatsappPlugin.expired_date).locale('id').format('DD MMMM YYYY') : '-' }</td>
      <td className=''>
        <div>URL: { whatsappPlugin.url ?? "-" }</div>
        <div>App Key: { whatsappPlugin.appKey ?? "-" }</div>
        <div>Auth Key: { whatsappPlugin.authkey ?? "-" }</div>
      </td>
      <td className={ whatsappPlugin.connection ? 'text-green-600' : 'text-red-600' }>{ whatsappPlugin.connection ? 'connected' : 'disconnected' }</td>
      <td className=''>{ whatsappPlugin.last_connection ? dayjs(whatsappPlugin.last_connection).locale('id').format('DD MMMM YYYY') : '-' }</td>
      <td className={ whatsappPlugin.is_active ? 'text-green-600' : 'text-red-600' }>{ whatsappPlugin.is_active ? 'Aktif' : 'Tidak Aktif'}</td>
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
              <button onClick={handleEdit} disabled={processing}>
                <FiEdit />
                Edit
              </button>
            </li>
            {
              (whatsappPlugin.is_active && whatsappPlugin.appKey && whatsappPlugin.authkey)  
              ? <li>
                <button onClick={handleCheckConnection} disabled={processing}>
                  <RiSignalTowerLine />
                  Cek Koneksi
                </button>
              </li>
              : null
            }

          </ul>
        </div>
      </td>
    </tr>
  )
}
