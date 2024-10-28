import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentMonthlyReceivableDetailDesktop({ receivable, className, role, handleEdit, handleDelete }) {
	return (
		<>
			<tr className={className}>
				<td>{receivable.no_ref}</td>
				<td>{dayjs(receivable.date).locale('id').format('MMMM DD, YYYY')}</td>
				<td>{receivable.month}</td>
				<td>{receivable.study_year}</td>
				<td className='text-end'>IDR. { formatNumber(receivable.debit) }</td>
				<td>
					{
						receivable.paid_date 
						? <BadgeSuccess>Lunas</BadgeSuccess>
						: <BadgeDanger>Belum Lunas</BadgeDanger>
					}
				</td>
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
										href={route('cashflow.student-monthly-receivable.edit', {organization: receivable.receivable.organization_id, receivable: receivable.receivable_id,ledger:receivable.id})}
									>
										<IoCreateOutline />
										Ubah
									</Link>
								</li>
								<li>
									<button onClick={handleDelete}>
										<IoTrash />
										Hapus
									</button>
								</li>
							</ul>
						</div>
					)}
				</td>
			</tr>
		</>
	);
}
