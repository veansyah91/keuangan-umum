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

export default function Index({ organization, role, payments }) {
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
							href={`/data-ledger/${organization.id}/payments?page=${payments.current_page - 1}&search=${search}`}
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
							href={`/data-ledger/${organization.id}/payments?page=${payments.current_page + 1}&search=${search}`}
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
