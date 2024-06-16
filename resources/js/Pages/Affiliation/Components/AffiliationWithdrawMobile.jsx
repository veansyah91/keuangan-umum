import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import BadgeWarning from '@/Components/Badges/BadgeWarning'
import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5/index.esm'

export default function AffiliationWithdrawMobile({ affiliationWithdraw }) {
  return (
    <div className='text-gray-900 py-2 px-3 border flex gap-5 justify-between' key={affiliationWithdraw.id}>
      <div className='text-start my-auto w-1/2'>
        <div className='text-xs'>
          {dayjs(affiliationWithdraw.created_at).format('MMM DD, YYYY')}
        </div>
        <div>
          {affiliationWithdraw.no_ref}
        </div>
        <div className='text-xs'>
          {affiliationWithdraw.description}
        </div>
        <div className='text-sm'>
          Status: { affiliationWithdraw > 0 
                    ? <BadgeSuccess>Sukses</BadgeSuccess>
                    : <BadgeWarning>Mengunggu</BadgeWarning>
                  }
        </div>
      </div>
      <div className='text-end w-5/12 my-auto'>
        <div>IDR {formatNumber(affiliationWithdraw.value)}</div> 
      </div>
      <div className="dropdown dropdown-left my-auto">
        <div                             
          tabIndex={0} 
          role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
          <IoEllipsisVertical />
        </div>
          <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
              
              <li>           
                <Link href={route('affiliationWithdraw.detail', affiliationWithdraw.id)}>
                  <IoSearchOutline /> Detail / Tanda Terima
                </Link>
              </li>
          </ul>
      </div>
    </div>
  )
}
