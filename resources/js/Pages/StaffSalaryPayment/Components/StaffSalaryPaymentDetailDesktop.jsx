import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import React from 'react'
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StaffSalaryPaymentDetailDesktop({ payment, role, detail, className }) {

  return (
		<>
			<tr className={className}>
				<td>{ detail.no_ref }</td>
				<td>{ detail.name }</td>
				<td>{ detail.position }</td>
				<td className='text-end'>IDR {formatNumber(parseInt(detail.total))}</td>
        <td className='text-end'>
          {(role !== 'viewer') && (
						<div className='dropdown dropdown-left'>
							<div
								tabIndex={0}
								role='button'
								className={`bg-inherit border-none -z-50 text-gray-300'`}>
								<IoEllipsisVertical />
							</div>
							<ul
								tabIndex={0}
								className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
								<li>
									<Link 
										href={route('cashflow.staff-salary-payment.staff', {organization: payment.organization_id, id: payment.id, staff: parseInt(detail.contact_id)})}
									>
										<LiaFileInvoiceSolid />
											Detail / Print
									</Link>
								</li>
								<li>
									<Link href={route('cashflow.staff-salary-payment.staff.edit', { organization: payment.organization_id, id: payment.id, staff: parseInt(detail.contact_id) })}>
										<IoCreateOutline />
										Ubah
									</Link>
								</li>
							</ul>
						</div>
					)}
        </td>
      </tr>
    </>
  )
}
