import React, { useState, createContext } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import AccountStaffEdit from './Components/AccountStaffEdit';
import AccountStaffData from './Components/AccountStaffData';

export const AccountStaffState = createContext();

export default function Index({ organization, accountStaff, accounts }) {
	const [isEdit, setIsEdit] = useState(false);

  return (
    <AccountStaffState.Provider value={{ isEdit, setIsEdit }}>
			<Head title='Data Akun' />
			<ToastContainer />

			<div className='sm:pt-0 pb-16 pt-12 print:font-["Open_Sans"]'>
				<div className='bg-white py-2 sm:pt-0 md:px-10 px-2 space-4'>
					{
						isEdit
						? <AccountStaffEdit accountStaff={accountStaff} accounts={accounts} organization={organization} />
						: <AccountStaffData accountStaff={accountStaff}/>
					}
				</div>
			</div>
			</AccountStaffState.Provider>
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Daftar Akun Staf</Header>}
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
					<li>Daftar Akun Staf</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
)
