import formatNumber from '@/Utils/formatNumber'
import dayjs from 'dayjs';
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'

export default function SavingLedgerDesktop({ ledger, className, role, handleDelete, handleEdit }) {  
  return (
    <>
      <tr className={`${className} hover:bg-slate-50/70`}>
        <td>{dayjs(ledger.date).locale('id').format('DD MMMM YYYY')}</td>
        <td>{ledger.no_ref}</td>
        <td>
          <div>{ledger.saving_balance.no_ref}</div>
          <div className='text-xs'>{ledger.saving_balance.contact.name}</div>
          <div className='text-sm font-bold'>
            {ledger.saving_balance.contact.contact_categories[0].name}
          </div>
        </td>
        <td className={`text-end font-bold ${ledger.credit > 0 ? 'text-green-800': 'text-red-800'}`}>IDR. { formatNumber(ledger.debit > 0 ? ledger.debit : ledger.credit) }({ ledger.debit > 0 ? 'D' : 'C' })</td>
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
  )
}
