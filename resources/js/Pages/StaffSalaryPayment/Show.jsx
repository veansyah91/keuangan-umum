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

export default function Show({ role, organization, details, payment, searchFilter, flash }) {
	const [search, setSearch] = useState(searchFilter || '');	

  console.log(details);
  
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
      
      </ContentMobile>
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
