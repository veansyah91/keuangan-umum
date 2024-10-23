import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoReload, IoReloadCircleOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import InputLabel from '@/Components/InputLabel';
import Datepicker from 'react-tailwindcss-datepicker';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import formatNumber from '@/Utils/formatNumber';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import StaffSelectInput from '@/Components/SelectInput/StaffSelectInput';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import Modal from '@/Components/Modal';
import FormInput from '@/Components/FormInput';

const details = (categories, details) => {
	const newCategory = categories.map(category => {
		return {
			id: category.id,
			name: category.name,
			value: category.value,
			unit: category.unit,
			is_cut: category.is_cut ? true : false,
			has_hour: category.has_hour ? true : false,
			qty: category.has_hour ? 0 : 1,
			total: category.has_hour ? 0 : category.value
		}
	});

}

export default function Edit({ organization, role, categories, payment, contact }) {
	console.log(payment.details);
	
	// console.log(details(categories, payment.details));
	
	const { data, setData } = useForm({
		value: payment.value,
		details: payment.details
	});
	
	const handleSubmit = (e) => {
		e.preventDefault();

	}
  return (
    <>
      <Head title={`Ubah Pembayaran Gaji Staf ${contact.name}`} />
      <ToastContainer />

			<FormInput onSubmit={handleSubmit}>
				<div className='w-full sm:mt-2 sm:py-5'>
					<div className='sm:mx-auto px-3 sm:px-5'>
						{/* Head */}
						<section className='w-full md:w-10/12 mx-auto mt-5'>
							<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
								<div className='w-full sm:w-1/3 my-auto'>
									<InputLabel
										value={'Nama Staff'}
										htmlFor='name'
										className=' mx-auto my-auto'
									/>
								</div>

								<div className='w-full sm:w-2/3'>
									<TextInput
										id='name'
										name='name'
										className={`w-full`}
										placeholder='Nama'
										value={contact.name || ''}
										disabled
									/>
								</div>
							</div>
							<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
								<div className='w-full sm:w-1/3 my-auto'>
									<InputLabel
										value={'Jabatan'}
										htmlFor='position'
										className=' mx-auto my-auto'
									/>
								</div>

								<div className='w-full sm:w-2/3'>
									<TextInput
										id='position'
										name='position'
										className={`w-full`}
										placeholder='Jabatan'
										value={contact.staff.position || ''}
										disabled
									/>
								</div>
							</div>
							<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
								<div className='w-full sm:w-1/3 my-auto'>
									<InputLabel
										value={'No. Id'}
										htmlFor='id'
										className=' mx-auto my-auto'
									/>
								</div>

								<div className='w-full sm:w-2/3'>
									<TextInput
										id='id'
										name='id'
										className={`w-full`}
										placeholder='No.Id'
										value={contact.staff.no_ref || ''}
										disabled
									/>
								</div>
							</div>
						</section>
					</div>
				</div>
			</FormInput>
    </>
  )
}

Edit.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Ubah Pembayaran Gaji Bulanan</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Ubah Pembayaran Gaji Bulanan'
		backLink={
			<Link href={route('cashflow.staff-salary-payment.show', {organization: page.props.organization.id, id: page.props.payment.id})}>
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
					<li className='font-bold'>
						<Link href={route('cashflow.staff-salary-payment.show', { organization: page.props.organization.id, id: page.props.payment.id })}>Rincian Pembayaran Gaji Bulanan</Link>
					</li>
					<li>Ubah Pembayaran Gaji Bulanan {}</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
