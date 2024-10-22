import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import PrimaryButton from '@/Components/PrimaryButton';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import StaffSalaryPaymentDetailMobile from './Components/StaffSalaryPaymentDetailMobile';
import StaffSalaryPaymentDetailDesktop from './Components/StaffSalaryPaymentDetailDesktop';
// import StaffSalaryPaymentDetailDesktop from './Components/StaffSalaryPaymentDetailDesktop';

export default function Show({ role, organization, details, payment, searchFilter, flash }) {
	const [search, setSearch] = useState(searchFilter || '');	
  
  return (
    <>
      {/* Mobile */}
			<Head title={`Pembayaran Gaji Bulan: ${payment.month}, Tahun: ${ payment.study_year }`} />
			<ToastContainer />

			{/* {role !== 'viewer' && (
				<Link href={route('cashflow.staff-salary-payment.create', organization.id)}>
					<AddButtonMobile label={'Tambah'} />
				</Link>
			)} */}
      
      <TitleMobile
				zIndex={'z-50'}
				search={search}
				setSearch={(e) => setSearch(e.target.value)}
				pageBefore={
					details.links[0].url ? (
						<Link
							href={route('cashflow.student-monthly-payment', {
								organization: organization.id,
								page: details.current_page - 1,
								search: search,
							})}
							preserveState
							only={['details']}>
							<IoPlayBack />
						</Link>
					) : (
						<div className='text-gray-300'>
							<IoPlayBack />
						</div>
					)
				}
				pageAfter={
					details.links[details.links.length - 1].url ? (
						<Link
							href={route('cashflow.student-monthly-payment', {
								organization: organization.id,
								page: details.current_page + 1,
								search: search,
							})}
							only={['details']}
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
						{details.current_page}/{details.last_page}
					</>
				}
				data={details}
				hasFilter={true}
				showFilter={() => setShowModalFilter(true)}
			/>

      <ContentMobile>
      	{details.data.map((detail, index) => (
					<StaffSalaryPaymentDetailMobile
						payment={payment}
						detail={detail}
						key={index}
						role={role}
					/>
				))}
      </ContentMobile>

			<ContainerDesktop>
				<TitleDesktop>
					<div className='my-auto w-7/12'>
						{/* {role !== 'viewer' && (
							<div className='space-x-2'>
								<Link href={route('cashflow.staff-salary-payment.create', organization.id)}>
									<PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
								</Link>
							</div>
						)} */}
					</div>
          <div className='my-auto w-4/12 flex gap-5 justify-end'>
						{/* <button className='py-3 px-3 border rounded-lg h-full' onClick={() => setShowModalFilter(true)}>
								<IoFilter />
						</button>	 */}
					</div>
					<div className='w-3/12 border flex rounded-lg'>
						<label htmlFor='search-input' className='my-auto ml-2'>
							<IoSearchSharp />
						</label>
						<input
							id='search-input'
							name='search-input'
							type='search'
							placeholder='Cari'
							className='w-full border-none focus:outline-none focus:ring-0'
							value={search || ''}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className='italic text-xs my-auto w-1/12 text-center'>
						<PageNumber data={details} />
					</div>
					<div className='my-auto flex space-x-2 w-1/12'>
						<div className='my-auto'>
							{details.links[0].url ? (
								<Link
									href={route('cashflow.student-monthly-payment', {
										organization: organization.id,
										page: details.current_page - 1,
										search: search,
									})}
									preserveState
									only={['details']}>
									<IoPlayBack />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayBack />
								</div>
							)}
						</div>
						<div className='my-auto'>
							{details.current_page}/{details.last_page}
						</div>
						<div className='my-auto'>
							{details.links[details.links.length - 1].url ? (
								<Link
									href={route('cashflow.student-monthly-payment', {
										organization: organization.id,
										page: details.current_page + 1,
										search: search,
									})}
									only={['details']}
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
										<th className='bg-gray-200'>No Ref</th>
										<th className='bg-gray-200'>Nama</th>
										<th className='bg-gray-200 text-end'>Nilai</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{details.data.map((detail, index) => (
										<StaffSalaryPaymentDetailDesktop
											payment={payment}
											detail={detail}
											key={index}
											role={role}
											className={`${index % 2 == 0 && 'bg-gray-100'} text-sm`}
										/>
									))}
								</tbody>
							</table>
						</ContentDesktop>	
					</div>	
				</div>
			</ContainerDesktop>
    </>
  )
}

Show.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Pembayaran Gaji Bulan: { page.props.payment.month }, Tahun: { page.props.payment.study_year }</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title={`Pembayaran Gaji Bulan: ${page.props.payment.month}, Tahun: ${ page.props.payment.study_year }`}
		backLink={
			<Link href={route('cashflow.staff-salary-payment', page.props.organization.id)}>
				<IoArrowBackOutline />
			</Link>
		}
		breadcrumbs={
			<div className='text-sm breadcrumbs'>
				<ul>
          <li className='font-bold'>
						<Link href={route('cashflow.staff-salary-payment', page.props.organization.id)}>Arus Kas</Link>
					</li>
          <li className='font-bold'>
						<Link href={route('cashflow.staff-salary-payment', page.props.organization.id)}>Pembayaran Gaji Bulanan</Link>
					</li>
					<li>Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
