import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5'

export default function WhatsappComponentDesktop({
  invoice, className, role
}) {
  return (
    <tr className={ className }>
      <td className=''>{ dayjs(invoice.created_at).format('DD MMMM YYYY, HH:mm:ss') }</td>
      <td className=''>{ invoice.no_ref }</td>
      <td className=''>{ invoice.product }</td>
      <td className='text-end'>IDR. { formatNumber(invoice.price) }</td>
      <td className={`text-center ${invoice.status == 'paid' && 'text-green-600'}
                                  ${invoice.status == 'pending' && 'text-yellow-600'}
                                  ${invoice.status == 'canceled' && 'text-red-600'}`}>
        {invoice.status == 'paid' && 'Telah Bayar'}
        {invoice.status == 'pending' && 'Menunggu'}
        {invoice.status == 'canceled' && 'Dibatalkan'}
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
										className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
										<li>
                        <Link
                          href={route('add-ons.whatsapp-invoice.show', {organization: invoice.organization_id, invoice: invoice.id})}>
                          <IoSearchOutline /> Detail
                        </Link>
                    </li>
									</ul>
							</div>
					)}
      </td>
    </tr>
  )
}
