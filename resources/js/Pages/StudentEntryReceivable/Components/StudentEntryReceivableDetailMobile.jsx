import BadgeDanger from '@/Components/Badges/BadgeDanger';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import formatNumber from '@/Utils/formatNumber';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import React from 'react';
import { BiDetail } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { IoCreateOutline, IoEllipsisVertical, IoSearchOutline, IoTrash } from 'react-icons/io5';

export default function StudentEntryReceivableDetailMobile({ receivable, className, role, handleEdit}) {	
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
						receivable.receivable_value > 0 
						? <BadgeDanger>Belum Lunas</BadgeDanger>
						: <BadgeSuccess>Lunas</BadgeSuccess>
					}
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(receivable.receivable_value)}</div>
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
				</div>
			</div>
		</>
	);
}
