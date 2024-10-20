import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgePrimary from '@/Components/Badges/BadgePrimary';
import BadgeSecondary from '@/Components/Badges/BadgeSecondary';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import DropdownAction from '@/Components/DropdownAction';
import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StaffSalaryPaymentMobile({ payment, role, handleDelete, handleEdit }) {
	return (
		<>
			<div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
				<div className='text-start my-auto w-6/12'>
					<div className='text-xs'>
						{dayjs(payment.date).format('MMMM DD, YYYY')}
					</div>
					<div className='text-xs'>
						{ payment.no_ref }
					</div>
					<div>
					</div>
					<div className='text-xs'>
						<div>Bulan: {formatMonth(payment.month)} ({payment.month})</div>
						<div>Tahun: {payment.study_year}</div>
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(payment.value)}</div>
				</div>
				<div className='text-start w-1/12'>
					{(role !== 'viewer' && payment.type !== 'receivable') && (
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
										href={route('cashflow.staff-salary-payment.show', {organization: payment.organization_id, id: payment.id})}
									>
										<LiaFileInvoiceSolid />
											Detail
									</Link>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

