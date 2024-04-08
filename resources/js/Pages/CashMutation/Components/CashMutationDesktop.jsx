import BadgeSecondary from '@/Components/Badges/BadgeSecondary'
import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import BadgeWarning from '@/Components/Badges/BadgeWarning'
import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5'

export default function CashMutationDesktop({cashMutation, className, handleDelete, handleEdit, role}) {
  
  return (
    <>
      <tr className={className}>
          <td>{dayjs(cashMutation.date).format('MMM DD, YYYY')}</td>
          <td>{cashMutation.no_ref}</td>
          <td>{cashMutation.description}</td>
          <td className='text-end'>IDR {formatNumber(cashMutation.value)}</td>
          <td className='text-center'>
            {
              cashMutation.journal.is_approved 
              ? <BadgeSuccess>Diterima</BadgeSuccess>
              : <BadgeSecondary>Draft</BadgeSecondary>
            }
          </td>
          <td className='text-end'>
            {
                (role !== 'viewer') &&
                <div className="dropdown dropdown-left">
                    <div                             
                        tabIndex={0} 
                        role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                        <IoEllipsisVertical />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                        <li>                                
                        <Link href={route('cashflow.cash-mutation.edit', 
                                        {
                                          'organization':cashMutation.organization_id,
                                          'cashMutation' : cashMutation.id
                                        })}>
                          <IoCreateOutline /> Edit
                        </Link>   
                        </li>
                        <li>                                
                          <Link href={route('cashflow.cash-mutation.show', 
                                          {
                                            'organization':cashMutation.organization_id,
                                            'cashMutation' : cashMutation.id
                                          })}>
                            <IoSearchOutline /> Detail / Tanda Terima
                          </Link>
                        </li>
                        <li>                                
                            <button 
                                onClick={handleDelete}
                            ><IoTrash />Hapus</button>
                        </li>
                    </ul>
                </div>
            }
            
          </td>
      </tr>
    </>
  )
}
