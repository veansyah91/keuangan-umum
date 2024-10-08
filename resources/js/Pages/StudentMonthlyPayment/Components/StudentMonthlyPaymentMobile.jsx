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

export default function StudentMobile({ payment, role, handleDelete, handleEdit }) {
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
						{payment.contact.name}
					</div>
					<div className='text-xs'>
						<div>Bulan: {formatMonth(payment.month)} ({payment.month})</div>
						<div>Tahun Ajaran: {payment.study_year}</div>
					</div>
				</div>
				<div className='text-end my-auto w-5/12'>
					<div>IDR {formatNumber(payment.value)}</div>
					<div>
					{
						payment.type == 'now' && <BadgeSuccess>Lunas</BadgeSuccess>
					}
					{
						payment.type == 'prepaid' && <BadgePrimary>Bayar Dimuka</BadgePrimary>
					}
					{
						payment.type == 'receivable' && <BadgeSecondary>Belum Bayar</BadgeSecondary>
					}
					</div>
				</div>
				<div className='text-start w-1/12'>
					{(role !== 'viewer' && payment.type !== 'receivable') && (
						<div className='dropdown dropdown-left'>
							<div
								tabIndex={0}
								role='button'
								className={`btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
								<IoEllipsisVertical />
							</div>
							<ul
								tabIndex={0}
								className='dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56'>
								<li>
									<Link 
										href={route('cashflow.student-monthly-payment.show', {organization: payment.organization_id, payment: payment.id})}
									>
										<LiaFileInvoiceSolid />
											Detail / Cetak 
									</Link>
								</li>
								{
									!payment.receivable_ledger && 
									<li>
										<Link href={route('cashflow.student-monthly-payment.edit', { organization: payment.organization_id, payment: payment.id })}>
											<IoCreateOutline />
											Ubah
										</Link>
									</li>
								}    
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
