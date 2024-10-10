import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import studyYear from '@/Utils/studyYear';
import FormInput from '@/Components/FormInput';

const monthNow = () => {
  let month = dayjs().format('MM');
  return month;
}

export default function Create({
  organization, role, categories, newRef, date, cashAccounts, contacts
}) {
  const { data, setData, post, reset, errors } = useForm({
    value: 0,
    organization_id : organization.id,
    no_ref: newRef,
    date: date,
    month:parseInt(monthNow()),
    study_year:studyYear(),
		details:[]
  })

	// function
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(data);
		
		post(route('cashflow.staff-salary-payment.store'),{
			onSuccess: ({ props }) => {
				console.log(props);
				
			}
		})


	}
  
  return (
    <>
			<Head title='Piutang Iuran Bulanan Siswa' />
      <ToastContainer />

			<FormInput onSubmit={handleSubmit}>
				<div className='w-full sm:mt-2 sm:py-5'>
					<div className='sm:mx-auto px-3 sm:px-5'>
						<div>

						</div>
						<div>Detail</div>
						<div>

						</div>
					</div>
				</div>
			</FormInput>
		</>
  )
}

Create.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Pembayaran Gaji Bulanan</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Pembayaran Gaji Bulanan'
		backLink={
			<Link href={route('cashflow', page.props.organization.id)}>
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
					<li>Tambah Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
