import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react'
import { BiDetail } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { IoEllipsisVertical } from 'react-icons/io5';

export default function StudentEntryReceivableDetailDesktop({
  receivable, className, role,
}) {  
  return (
    <tr className={className}>
      <td>
        { dayjs(receivable.date).locale('id').format('MMMM DD, YYYY') }
      </td>
      <td className='text-start'>{ receivable.no_ref }</td>
      <td className='text-start'>{ receivable.study_year }</td>
      <td className='text-end'>IDR. { formatNumber(receivable.receivable_value) }</td>
      <td className='text-start'>
      {
        receivable.receivable_value > 0 
        ? <BadgeDanger>Belum Lunas</BadgeDanger>
        : <BadgeSuccess>Lunas</BadgeSuccess>
      }
      </td>
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
              className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'
            >
              {
                receivable.receivable_value > 0 &&
                <li>
                  <Link 
                    href={route('cashflow.student-entry-receivable-payment.create', {
                            organization: receivable.organization_id, 
                            contact: receivable.contact.name,
                            selectedContact: receivable.contact.id
                          })}
                  >
                    <GiMoneyStack />
                      Bayar
                  </Link>
                </li>   
              }
              
              <li>
                <Link 
                  href={route('cashflow.student-entry-receivable-payment.create', {
                          organization: receivable.organization_id, 
                          contact: receivable.contact.name,
                          selectedContact: receivable.contact.id
                        })}
                >
                  <BiDetail />
                    Detail
                </Link>
              </li> 
            </ul>
          </div>
        )}
      </td>
    </tr>
  )
}
