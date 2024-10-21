import formatMonth from '@/Utils/formatMonth';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function StaffSalaryPaymentDesktop({ payment, className, role }) {
	return (
		<>
			<tr className={className}>
				<td>{dayjs(payment.date).locale('id').format('MMMM DD, YYYY')}</td>
				<td>{ payment.no_ref }</td>
				<td>{formatMonth(payment.month)} ({payment.month})</td>
				<td>{payment.study_year}</td>
				<td className='text-end'>IDR. { formatNumber(payment.value) }</td>
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
												href={route('cashflow.staff-salary-payment.show', {organization: payment.organization_id, id: payment.id})}
											>
												<LiaFileInvoiceSolid />
													Detail 
											</Link>
										</li>
									</ul>
							</div>
					)}
				</td>
			</tr>
		</>
	);
}

