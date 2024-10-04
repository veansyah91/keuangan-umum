import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'
import { LiaFileInvoiceSolid } from 'react-icons/lia'

export default function StudentEntryPaymentMobile({
  receivable, role
}) {  
  return (
    <>
			<div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
				<div className='text-start my-auto w-6/12'>
					<div className='text-xs'>
            No. Siswa: {receivable.contact.student.no_ref}
					</div>
					<div>
						{receivable.contact.name}
					</div>
					<div className='text-xs'>
						<div>Kelas: {receivable.contact.last_level.level}</div>
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(receivable.value)}</div>
				</div>
				<div className='text-start w-1/12'>
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
                    href={route('cashflow.student-entry-receivable.show', {organization: receivable.organization_id, studentEntryReceivable: receivable.id})}
                  >
                    <IoSearchOutline />
                      Detail
                  </Link>
                </li>   
              </ul>
            </div>
          )}
				</div>
			</div>
		</>
  )
}
