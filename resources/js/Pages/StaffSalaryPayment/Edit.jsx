import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import InputLabel from '@/Components/InputLabel';
import formatNumber from '@/Utils/formatNumber';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import FormInput from '@/Components/FormInput';

const details = (categories, details) => {
	return categories.map(category => {
		let findDetail = details.find(detail => detail.category_id === category.id);
		return {
			id: category.id,
			name: category.name,
			value: findDetail.qty > 0 ? findDetail.value/findDetail.qty : category.value,
			unit: category.unit,
			is_cut: category.is_cut ? true : false,
			has_hour: category.has_hour ? true : false,
			qty: findDetail.qty,
			total: findDetail.value
		}
	});
}

export default function Edit({ organization, role, categories, payment, contact }) {	
	const { data, setData, processing, patch } = useForm({
		value:payment.details.reduce((acc, detail) => acc + detail.value, 0),
		details: details(categories, payment.details)
	});

	const handleChangeHour =(values, index) => {	
		let tempData = {...data};
		tempData.details[index] = {
			...tempData.details[index],
			qty: values.floatValue || 0,
			total: (values.floatValue || 0) * tempData.details[index].value
		}

		tempData.value = tempData.details.reduce((acc, detail) => acc + detail.total, 0);
		setData(tempData);		

	};

	const handleChangeValue = (values, index) => {
		let tempData = {...data};
		tempData.details[index] = {
			...tempData.details[index],
			value: values.floatValue || 0,
			total: (values.floatValue || 0) * tempData.details[index].qty
		}

		tempData.value = tempData.details.reduce((acc, detail) => acc + detail.total, 0);
		setData(tempData);		
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();

		patch(route('cashflow.staff-salary-payment.staff.update', {organization: organization.id, payment:payment.id, staff: contact.id}),{
			onError: errors => {
				console.log(errors);				
			}
		})

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

							<div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
								<div className='w-full sm:w-1/12 my-auto text-center'>
									<Link href={route('cashflow.staff-salary-payment.show', {organization: organization.id, id: payment.id})}>
										<SecondaryButton className='w-full'>
											<div className='text-center w-full'>Batal</div>
										</SecondaryButton>
									</Link>
								</div>

								<div className='w-full sm:w-1/12 text-center'>
									<PrimaryButton className='w-full' disabled={processing}>
										<div className='text-center w-full'>Ubah</div>
									</PrimaryButton>
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
					<li>Ubah Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
