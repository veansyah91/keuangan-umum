import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { IoCreateOutline, IoEllipsisVertical, IoTrash } from 'react-icons/io5';

export default function StudentMonthlyReceivableDetailMobile({ receivable, className, role, handleEdit, handleDelete }) {	
	return (
		<>
			<div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
				<div className='text-start my-auto'>
					<div className='text-xs'>
						<div>Tanggal: {dayjs(receivable.date).locale('id').format('MMMM DD, YYYY')}</div>
					</div>
          <div>
						{receivable.no_ref}
					</div>
          <div>
          {
						receivable.paid_date 
						? <BadgeSuccess>Lunas</BadgeSuccess>
						: <BadgeDanger>Belum Lunas</BadgeDanger>
					}
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(receivable.debit)}</div>
				</div>
				<div className='text-start'>
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
				</div>
			</div>
		</>
	);
}
