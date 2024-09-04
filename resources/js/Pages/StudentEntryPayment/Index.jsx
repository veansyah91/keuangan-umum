import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';
import StudentEntryPaymentMobile from './Components/StudentEntryPaymentMobile';
import StudentEntryPaymentDesktop from './Components/StudentEntryPaymentDesktop';


export default function Index({ organization, role, payments, searchFilter }) {
	console.log(payments);
	
	const [search, setSearch] = useState(searchFilter || '');

  return (
    <>
			{/* Mobile */}
			<Head title='Pembayaran Iuran Siswa' />
			<ToastContainer />

			{role !== 'viewer' && (
				<Link href={route('cashflow.student-entry-payment.create', organization.id)}>
					<AddButtonMobile label={'Tambah'} />
				</Link>
			)}
			<TitleMobile
				zIndex={'z-50'}
				search={search}
				setSearch={(e) => setSearch(e.target.value)}
				pageBefore={
					payments.links[0].url ? (
						<Link
							href={route('cashflow.student-entry-payment', {
								organization: organization.id,
								page: payments.current_page - 1,
								search: search,
							})}
							preserveState
							only={['payments']}>
							<IoPlayBack />
						</Link>
					) : (
						<div className='text-gray-300'>
							<IoPlayBack />
						</div>
					)
				}
				pageAfter={
					payments.links[payments.links.length - 1].url ? (
						<Link
							href={route('cashflow.student-entry-payment', {
								organization: organization.id,
								page: payments.current_page + 1,
								search: search,
							})}
							only={['payments']}
							preserveState>
							<IoPlayForward />
						</Link>
					) : (
						<div className='text-gray-300'>
							<IoPlayForward />
						</div>
					)
				}
				page={
					<>
						{payments.current_page}/{payments.last_page}
					</>
				}
				data={payments}
				hasFilter={true}
				showFilter={() => setShowModalFilter(true)}
			/>
			<ContentMobile>
				{payments.data.map((payment) => (
					<StudentEntryPaymentMobile
						payment={payment}
						key={payment.id}
						handleDelete={() => handleDelete(payment)}
						role={role}
					/>
				))}
			</ContentMobile>

			{/* Desktop */}
			<ContainerDesktop>
				<TitleDesktop>
					<div className='my-auto w-7/12'>
						{role !== 'viewer' && (
							<div className='space-x-2'>
								<Link href={route('cashflow.student-entry-payment.create', organization.id)}>
									<PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
								</Link>
							</div>
						)}
					</div>	
					<div className='my-auto w-4/12 flex gap-5 justify-end'>
						<button className='py-3 px-3 border rounded-lg h-full' onClick={() => setShowModalFilter(true)}>
								<IoFilter />
						</button>
						
				</div>
					<div className='w-3/12 border flex rounded-lg'>
						<label htmlFor='search-input' className='my-auto ml-2'>
							<IoSearchSharp />
						</label>
						<input
							id='search-input'
							name='search-input'
							type='search'
							placeholder='Cari Siswa'
							className='w-full border-none focus:outline-none focus:ring-0'
							value={search || ''}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className='italic text-xs my-auto w-1/12 text-center'>
						<PageNumber data={payments} />
					</div>
					<div className='my-auto flex space-x-2 w-1/12'>
						<div className='my-auto'>
							{payments.links[0].url ? (
								<Link
									href={route('cashflow.student-entry-payment', {
										organization: organization.id,
										page: payments.current_page - 1,
										search: search,
									})}
									preserveState
									only={['payments']}>
									<IoPlayBack />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayBack />
								</div>
							)}
						</div>
						<div className='my-auto'>
							{payments.current_page}/{payments.last_page}
						</div>
						<div className='my-auto'>
							{payments.links[payments.links.length - 1].url ? (
								<Link
									href={route('cashflow.student-entry-payment', {
										organization: organization.id,
										page: payments.current_page + 1,
										search: search,
									})}
									only={['payments']}
									preserveState>
									<IoPlayForward />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayForward />
								</div>
							)}
						</div>
					</div>
				</TitleDesktop>

				<div className='sm:flex hidden gap-5'>
					<div className='w-full'>
						<ContentDesktop>
							<table className='table table-pin-rows table-pin-cols text-base'>
								<thead className='text-base text-gray-900'>
									<tr className=''>
										<th className='bg-gray-200'>Tanggal</th>
										<th className='bg-gray-200'>No Ref</th>
										<th className='bg-gray-200'>Nama</th>
										<th className='bg-gray-200'>Tahun Ajaran</th>
										<th className='bg-gray-200 text-end'>Jumlah Bayar</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{payments.data.map((payment, index) => (
										<StudentEntryDesktop
											key={index}
											payment={payment}
											className={`${index % 2 == 0 && 'bg-gray-100'} text-sm`}
											handleDelete={() => handleDelete(payment)}
											role={role}
										/>
									))}
								</tbody>
							</table>
						</ContentDesktop>
					</div>
				</div>
			</ContainerDesktop>
			{/* Desktop */}
		</>
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Pembayaran Iuran Tahunan Siswa</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Pembayaran Iuran Tahunan Siswa'
		backLink={
			<Link href={route('cashflow', page.props.organization.id)}>
				<IoArrowBackOutline />
			</Link>
		}
		breadcrumbs={
			<div className='text-sm breadcrumbs'>
				<ul>
					<li className='font-bold'>
						<Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
					</li>
					<li>Pembayaran Iuran Tahunan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
