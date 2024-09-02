import React, { useEffect, useState, createContext } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import AccountSchoolEdit from './Components/AccountSchoolEdit';
import AccountSchoolData from './Components/AccountSchoolData';

export const AccountSchool = createContext();

export default function Index({ organization, accountSchool, accounts }) {
	const [isEdit, setIsEdit] = useState(false);

  return (
    <AccountSchool.Provider value={{ isEdit, setIsEdit }}>
			<Head title='Data Akun' />
			<ToastContainer />

			<div className='sm:pt-0 pb-16 pt-12 print:font-["Open_Sans"]'>
				<div className='bg-white py-2 sm:pt-0 md:px-10 px-2 space-4'>
					{
						isEdit
						? <AccountSchoolEdit accountSchool={accountSchool} accounts={accounts} />
						: <AccountSchoolData accountSchool={accountSchool}/>
					}
				</div>
			</div>
			</AccountSchool.Provider>
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Daftar Akun Sekolah</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Data Akun'
		backLink={
			<Link href={route('data-ledger', page.props.organization.id)}>
				<IoArrowBackOutline />
			</Link>
		}
		breadcrumbs={
			<div className='text-sm breadcrumbs'>
				<ul>
					<li className='font-bold'>
						<Link href={route('data-ledger', page.props.organization.id)}>Buku Besar</Link>
					</li>
					<li>Daftar Akun Sekolah</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
)
