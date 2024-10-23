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
	return categories.map(category => {
		let findDetail = details.find(detail => detail.category_id === category.id);
		return {
			id: category.id,
			name: category.name,
			value: findDetail.value/findDetail.qty,
			unit: category.unit,
			is_cut: category.is_cut ? true : false,
			has_hour: category.has_hour ? true : false,
			qty: findDetail.qty,
			total: findDetail.value
		}
	});
}

export default function Edit({ organization, role, categories, payment, contact }) {
	const { data, setData } = useForm({
		value: payment.value,
		details: details(categories, payment.details)
	});

	const handleChangeHour =(values, index) => {	
		// let tempContactForm = {...contactForm};
		// let valueUsed = values.floatValue || 0;
				
		// tempContactForm.categories[index] = {
		// 	...tempContactForm.categories[index],
		// 	qty: valueUsed,
		// 	total: valueUsed * tempContactForm.categories[index].value * (tempContactForm.categories[index].is_cut ? -1 : 1)
		// }		

		// tempContactForm = {
		// 	...tempContactForm,
		// 	value: tempContactForm.categories.reduce((acc, category) => acc + category.total , 0)
		// }

		// let tempData = {...data};

		// tempData.details[step] = tempContactForm;

		// tempData.value = tempData.details.reduce((acc, detail) => acc + detail.value , 0);

		setData(tempData);		
	};

	const handleChangeValue = (values, index) => {
		// let tempContactForm = {...contactForm};
		// let valueUsed = values.floatValue || 0;
				
		// tempContactForm.categories[index] = {
		// 	...tempContactForm.categories[index],
		// 	value: valueUsed,
		// 	total: valueUsed * tempContactForm.categories[index].qty * (tempContactForm.categories[index].is_cut ? -1 : 1)
		// }		

		// tempContactForm = {
		// 	...tempContactForm,
		// 	value: tempContactForm.categories.reduce((acc, category) => acc + category.total , 0)
		// }

		// let tempData = {...data};

		// tempData.details[step] = tempContactForm;

		// tempData.value = tempData.details.reduce((acc, detail) => acc + detail.value , 0);

		setData(tempData);		
	}
	
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

							<div className='mt-5 overflow-x-auto'>
								<div className='w-[750px] md:w-full'>
									<div className='flex font-bold gap-3 border-b py-3'>
										<div className='w-4/12'>Kategori</div>
										<div className='w-2/12 text-end'>Jam/Hari</div>
										<div className='w-3/12 text-end'>Nilai</div>
										<div className='w-3/12 text-end'>Total</div>
									</div>
									{
										data.details.map((category, index) => 
											<div className='flex gap-3 border-b py-3' key={index}>
												<div className={`w-5/12 my-auto${category.is_cut ? ' text-red-500' : ''}`}>{ category.name }</div>
												<div className='w-1/12 text-end'>
													{
														category.has_hour && <div className='gap-1'>
															<NumericFormat
																value={category.qty}
																customInput={TextInput}
																onValueChange={(values) => handleChangeHour(values, index)}
																thousandSeparator={true}
																className={`text-end w-full${category.is_cut ? ' text-red-500' : ''}`}
																prefix={''}
															/>
															<div className='my-auto hidden md:block text-xs'>{category.unit}</div>
														</div>
													}
												</div>
												<div className='w-3/12 text-end'>
													<NumericFormat
														value={category.value}
														customInput={TextInput}
														onValueChange={(values) => handleChangeValue(values, index)}
														thousandSeparator={true}
														className={`text-end w-full${category.is_cut ? ' text-red-500' : ''}`}
														prefix={'IDR. '}
													/>
												</div>
												<div className='w-3/12 text-end'>
													<NumericFormat
														value={category.total}
														customInput={TextInput}
														thousandSeparator={true}
														className={`text-end w-full${category.is_cut ? ' text-red-500' : ''}`}
														prefix={'IDR. '}
														disabled='disabled'
													/>
												</div>
											</div>
										)
									}
									<div className='flex font-bold gap-3 border-b py-3'>
										<div className='w-5/12'>Total</div>
										<div className='w-7/12 text-end'>IDR. {formatNumber(data.value)}</div>
									</div>
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
