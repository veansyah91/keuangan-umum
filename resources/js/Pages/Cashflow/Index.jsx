import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import { FaHandHoldingUsd, FaMoneyBillWaveAlt, FaWallet } from 'react-icons/fa';
import CardMenu from '@/Components/CardMenu';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { SlNotebook } from "react-icons/sl";
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { PiMoney } from 'react-icons/pi';
import { CgNotes } from 'react-icons/cg';

export default function Index({ organization, menus }) {		
	return (
		<>
			<Head title='Arus Kas' />

			{/* Desktop */}
			<ContainerDesktop>
				<section className='pt-5 pb-10'>
					<div className='flex justify-center gap-6'>
						<Link href={route('cashflow.cash-in', organization.id)}>
								<CardMenu bgColor={'bg-cyan-500'} icon={<FaHandHoldingUsd />} title={'Penerimaan'} />
						</Link>
						<Link href={route('cashflow.cash-out', organization.id)}>
							<CardMenu
								bgColor={'bg-rose-500'}
								icon={
									<div className='rotate-180'>
										<FaHandHoldingUsd />
									</div>
								}
								title={'Pengeluaran'}
							/>
						</Link>
						<Link href={route('cashflow.cash-mutation', organization.id)}>
							<CardMenu bgColor={'bg-orange-500'} icon={<FaMoneyBillTransfer />} title={'Mutasi Kas'} />
						</Link>
					</div>
				</section>
					{
						menus.find(menu => menu.menu_name === "SISWA")
						&& <section className='text-center font-bold'>
								<section className='pt-2 pb-10 space-y-3'>
								<div className='text-center font-bold'>
									Siswa
								</div>
								<div className='flex justify-center gap-6'>
									<Link href={route('cashflow.student-monthly-payment', organization.id)}>
										<CardMenu 
											bgColor={'bg-orange-900'} 
											icon={<LiaMoneyBillWaveSolid />} 
											title={'Pembayaran Iuran Bulanan'} 
										/>
									</Link>
									<Link href={route('cashflow.student-monthly-receivable', organization.id)}>
										<CardMenu 
											bgColor={'bg-slate-600'} 
											icon={<SlNotebook />} 
											title={'Piutang Iuran Bulanan'} 
										/>
									</Link>
									<Link href={route('cashflow.student-entry-payment', organization.id)}>
										<CardMenu 
											bgColor={'bg-blue-600'} 
											icon={<PiMoney />} 
											title={'Pembayaran Iuran Tahunan'} 
										/>
									</Link>
									<Link href={route('cashflow.student-entry-receivable', organization.id)}>
										<CardMenu 
											bgColor={'bg-red-600'} 
											icon={<CgNotes />} 
											title={'Piutang Iuran Tahunan'} 
										/>
									</Link>
									<Link href={route('cashflow.student-entry-receivable-payment', organization.id)}>
										<CardMenu 
											bgColor={'bg-green-600'} 
											icon={<FaMoneyBillWaveAlt />} 
											title={'Pembayaran Piutang Iuran Tahunan'} 
										/>
									</Link>
								</div>
								</section> 
						</section>
					} 
					{
						menus.find(menu => menu.menu_name === "STAFF")
						&& <section className='text-center font-bold'>
						<section className='pt-2 pb-10 space-y-3'>
							<div className='text-center font-bold'>
								Staff
							</div>
							<div className='flex justify-center gap-6'>
								<Link href={route('cashflow.staff-salary-payment', organization.id)}>
									<CardMenu 
										bgColor={'bg-green-500'} 
										icon={<LiaMoneyBillWaveSolid />} 
										title={'Pembayaran Gaji Bulanan'} 
									/>
								</Link>
							</div>
						</section>  
						</section>
					}	
					{
						menus.find(menu => menu.menu_name === "SIMPAN PINJAM")
						&& <section className='text-center font-bold'>
						<section className='pt-2 pb-10 space-y-3'>
							<div className='text-center font-bold'>
								Simpan
							</div>
							<div className='flex justify-center gap-6'>
								<Link href={route('cashflow.saving', organization.id)}>
									<CardMenu 
										bgColor={'bg-blue-400'} 
										icon={<FaWallet />} 
										title={'Simpan'} 
									/>
								</Link>
							</div>
						</section>  
						</section>
					}					
			</ContainerDesktop>
			{/* Desktop */}

			{/* Mobile */}
			<section>
				<div className='sm:hidden flex flex-wrap pt-14 px-2 mx-auto bg-white gap-2 w-full justify-center'>
					<Link href={route('cashflow.cash-in', organization.id)}>
						<CardMenu bgColor={'bg-cyan-500'} icon={<FaHandHoldingUsd />} title={'Penerimaan'} />
					</Link>
					<Link href={route('cashflow.cash-out', organization.id)}>
						<CardMenu
							bgColor={'bg-rose-500'}
							icon={
								<div className='rotate-180'>
									<FaHandHoldingUsd />
								</div>
							}
							title={'Pengeluaran'}
						/>
					</Link>
					<Link href={route('cashflow.cash-mutation', organization.id)}>
						<CardMenu bgColor={'bg-orange-500'} icon={<FaMoneyBillTransfer />} title={'Mutasi Kas'} />
					</Link>
				</div>
				
				{
					menus.find(menu => menu.menu_name === "SISWA") &&
					<div className='sm:hidden pt-5 bg-white '>
						<div className='text-center font-bold'>
							Siswa
						</div>
						<div className='flex flex-wrap pt-2 px-2 mx-auto gap-2 w-full justify-center'>
							<Link href={route('cashflow.student-monthly-payment', organization.id)}>
								<CardMenu 
									bgColor={'bg-orange-900'} 
									icon={<LiaMoneyBillWaveSolid />} 
									title={'Pembayaran Iuran Bulanan'} 
								/>
							</Link>
							<Link href={route('cashflow.student-monthly-receivable', organization.id)}>
								<CardMenu 
									bgColor={'bg-slate-600'} 
									icon={<SlNotebook />} 
									title={'Piutang Iuran Bulanan'} 
								/>
							</Link>
							<Link href={route('cashflow.student-entry-payment', organization.id)}>
								<CardMenu 
									bgColor={'bg-blue-600'} 
									icon={<PiMoney />} 
									title={'Pembayaran Iuran Tahunan'} 
								/>
							</Link>
							<Link href={route('cashflow.student-entry-receivable', organization.id)}>
								<CardMenu 
									bgColor={'bg-red-600'} 
									icon={<CgNotes />} 
									title={'Piutang Iuran Tahunan'} 
								/>
							</Link>
							<Link href={route('cashflow.student-entry-receivable-payment', organization.id)}>
								<CardMenu 
									bgColor={'bg-green-600'} 
									icon={<FaMoneyBillWaveAlt />} 
									title={'Pembayaran Piutang Iuran Tahunan'} 
								/>
							</Link>
						</div>
					</div>
				}

				{
					menus.find(menu => menu.menu_name === "STAFF") &&
					<div className='sm:hidden pt-5 bg-white '>
						<div className='text-center font-bold'>
							Staf
						</div>
						<div className='flex flex-wrap pt-2 px-2 mx-auto gap-2 w-full justify-center'>
							<Link href={route('cashflow.staff-salary-payment', organization.id)}>
								<CardMenu 
									bgColor={'bg-slate-800'} 
									icon={<LiaMoneyBillWaveSolid />} 
									title={'Pembayaran Gaji Bulanan'} 
								/>
							</Link>
						</div>
					</div>
				}	

				{
					menus.find(menu => menu.menu_name === "SIMPAN PINJAM") &&
					<div className='sm:hidden pt-5 bg-white '>
						<div className='text-center font-bold'>
							Simpan
						</div>
						<div className='flex flex-wrap pt-2 px-2 mx-auto gap-2 w-full justify-center'>
							<Link href={route('cashflow.saving', organization.id)}>
								<CardMenu 
									bgColor={'bg-blue-400'} 
									icon={<FaWallet />} 
									title={'Simpan'} 
								/>
							</Link>
						</div>
					</div>
				}				
			</section>			
			{/* Mobile */}
		</>
	);
}

Index.layout = (page) => (
    <AuthenticatedLayout
			header={<Header></Header>}
			children={page}
			user={page.props.auth.user}
			role={page.props.role}
			organization={page.props.organization}
			title='Arus Kas'
    />
);
