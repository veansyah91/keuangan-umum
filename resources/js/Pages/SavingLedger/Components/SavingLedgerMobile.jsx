import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function SavingLedgerMobile({
  ledger, role, handleDelete, handleEdit 
}) {    
  return (
    <>
      <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
        <div className='text-start my-auto'>
          <div className='text-sm'>Tanggal: { dayjs(ledger.date).locale('id').format('MMMM YYYY, DD') }</div>
          <div className='text-sm'>No. Ref: { ledger.no_ref }</div>
          <div className='text-sm'>No. Rekening: </div>
          <div>
            <div>{ledger.saving_balance.no_ref}</div>
            <div>an. {ledger.saving_balance.contact.name}</div>            
          </div>
          <div className={`text-sm font-bold ${ledger.debit > 0 ? 'text-red-600' : 'text-green-600'}`}>
            IDR. { ledger.debit > 0 ? formatNumber(ledger.debit) : formatNumber(ledger.credit)} ({ ledger.debit > 0 ? "D" : "C"})
          </div>
          
        </div>
        <div className='text-start'>
          {role !== 'viewer' && (
            <div className='dropdown dropdown-left'>
              <div
                tabIndex={0}
                role='button'
                className={`btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                <IoEllipsisVertical />
              </div>
              <ul
                tabIndex={0}
                className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'
              >
                <li>
                  <Link
                      href={route('cashflow.saving.ledger.show', {
                        organization: ledger.organization_id,
                        ledger: ledger.id,
                      })}>
                      <LiaFileInvoiceSolid />Detail / Cetak 
                  </Link>
                </li>

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
        </div>
      </div>
    </>
  )
}
