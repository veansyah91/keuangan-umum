import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5'
import { RiBookletLine } from 'react-icons/ri'

export default function SavingBalanceMobile({ member, role, handleDelete, handleEdit }) {
  return (
    <>
      <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
        <div className='text-start my-auto'>
          <div className='text-sm'>No. Ref: { member.no_ref }</div>
          <div className='text-sm'>Kategori: { member.saving_category.name }</div>
          <div>
            {member.contact.name}
          </div>
          <div className='text-sm font-bold text-green-600'>
            Saldo: IDR. {formatNumber(member.value)}
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
                className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
                <li>
                  <Link href={route('cashflow.saving.balance.show',{organization: member.organization_id, balance: member.id})}>
                    <RiBookletLine />
                    Cetak Buku Tabungan
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
