import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical,} from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StaffSalaryPaymentDetailMobile({ payment, role, detail }) {
		
  return (
    <>
			<div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
				<div className='text-start my-auto w-6/12'>
					<div className='text-xs'>
						No. Ref: { detail.no_ref }
					</div>
					<div className='text-xs'>
						{ detail.name }
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(parseInt(detail.total))}</div>
				</div>
				<div className='text-start w-1/12'>
					{(role !== 'viewer') && (
						<div className='dropdown dropdown-left'>
							<div
								tabIndex={0}
								role='button'
								className={`bg-inherit bg-white border-none -z-50 text-gray-300'`}>
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
				</div>
			</div>
		</>
  )
}
