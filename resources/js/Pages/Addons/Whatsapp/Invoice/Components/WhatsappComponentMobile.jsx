import formatNumber from '@/Utils/formatNumber'
import { Link } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5'

export default function WhatsappComponentMobile({
  invoice, role
}) {
  return (
    <div className='bg-white shadow-sm px-6 py-3 flex border'>
      <div className='w-6/12'>
        <div>{invoice.no_ref}</div>
        <div className='uppercase'>{invoice.product}</div>
        <div>
          Status:
          <span
              className={`italic
                      ${invoice.status == 'paid' && 'text-green-600'}
                      ${invoice.status == 'pending' && 'text-yellow-600'}
                      ${invoice.status == 'canceled' && 'text-red-600'}
                  `}>
              {invoice.status == 'paid' && 'Telah Bayar'}
              {invoice.status == 'pending' && 'Menunggu'}
              {invoice.status == 'canceled' && 'Dibatalkan'}
          </span>
        </div>
      </div>
      <div className='w-5/12 text-end text-xl my-auto'>
        IDR. {formatNumber(invoice.price)}
      </div>
      <div className='w-1/12 my-auto text-end'>
        <div className='dropdown dropdown-left'>
          <div
            tabIndex={0}
            role='button'
            className='btn bg-white border-none hover:bg-gray-100'>
            <IoEllipsisVertical />
          </div>
          <ul
            tabIndex={0}
            className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10'>
            <li>
            <Link
              href={route('add-ons.whatsapp-invoice.show', {organization: invoice.organization_id, invoice: invoice.id})}>
              <IoSearchOutline /> Detail
            </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
