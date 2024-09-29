import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import React from 'react';
import { IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5';

export default function StudentMonthlyReceivableDesktop({ receivable, className, role }) {
	return (
		<>
			<tr className={className}>
				<td>{receivable.contact.name}</td>
				<td>{receivable.contact.student.no_ref ?? ''}</td>
				<td>{receivable.contact.last_level?.level}</td>
				<td className='text-end'>IDR. { formatNumber(receivable.value) }</td>
				<td className='text-end'>
					{role !== 'viewer' && (
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
										href={route('cashflow.student-monthly-receivable.show', {organization: receivable.organization_id, receivable: receivable.id})}
									>
										<IoSearchOutline />
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
