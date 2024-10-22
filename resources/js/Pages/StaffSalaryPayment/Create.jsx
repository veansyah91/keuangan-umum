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

const monthNow = () => {
  let month = dayjs().format('MM');
  return month;
}

const monthList = () => {
  let monthListTemp = [];

  for (let index = 7; index < 13; index++) {
    monthListTemp = [
      ...monthListTemp, index
    ];
  }

  for (let index = 1; index < 7; index++) {
    monthListTemp = [
      ...monthListTemp, index
    ];
  }
  return monthListTemp;
}

const contactResource = (contacts) => {
	return contacts.map(contact => {
		return {
			id: contact.contact_id, 
			name: contact.contact.name, 
			position: contact.position, 
			no_ref:contact.no_ref,
		}
	})
}

const dataDetails = (contacts, categories) => {
	return contacts.map(contact => {
		return {
			id: contact.contact_id, 
			name: contact.contact.name, 
			position: contact.position, 
			no_ref: contact.no_ref,
			value: categories.reduce((acc, category) => acc + (category.has_hour ? 0 : category.value), 0),
			categories: categories.map(category => {
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
			})
		}
	})
}

export default function Create({
  organization, role, categories, newRef, date, cashAccounts, contacts, studyYears, history
}) {	
  const { data, setData, post, reset, errors } = useForm({
    value: 0,
    organization_id : organization.id,
    no_ref: newRef,
    date: date,
    month:parseInt(monthNow()),
    study_year:dayjs(date).format('YYYY').toString(),
		cash_account_id: '',
		details:dataDetails(contacts, categories)
  })
	
	const [dateValue, setDateValue] = useState({
		startDate: date,
		endDate: date,
	});	

	const [selectedContact, setSelectedContact] = useState({ id: null, name: '', position: '', no_ref:'' });
	const [contactForm, setContactForm] = useState({});
	const [showModal, setShowModal] = useState(false);

	const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

	const [debounceDateValue] = useDebounce(dateValue, 500);

	const prevDate = usePrevious(dateValue);

	const [step, setStep] = useState(0);	

	// useUffect
	useEffect(() => {
		handleSetDetails();
	},[]);

	// useUffect
	useEffect(() => {
		if (prevDate !== undefined) {
			reloadNewRef();
		}
}, [debounceDateValue]);

	// function
	const reloadNewRef = () => {
		router.reload({
			only: ['newRef'],
			data: {
				date: dateValue.startDate,
			},
			onSuccess: (page) => {
				setData('no_ref', page.props.newRef);
			},
		});
	};
	const handleSetDetails = () => {		
		setSelectedContact({
			id: contacts[0].contact_id, 
			name: contacts[0].contact.name, 
			position: contacts[0].position, 
			no_ref:contacts[0].no_ref
		});
		setContactForm({
			id: data.details[0].id, 
			name: data.details[0].name, 
			position: data.details[0].position, 
			no_ref:data.details[0].no_ref,
			categories:data.details[0].categories,
			value: data.details[0].categories.reduce((acc, category) => acc + (category.has_hour ? 0 : category.value), 0)
		});

		// get value
		let temData = data.details;

		setData('value', temData.reduce((acc, detail) => acc + detail.value, 0));
	}

	const handleDateValueChange = (newValue) => {
		setDateValue(newValue);
		setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
	};

	const handlePrevData = (tempStep) => {
		let tempData = tempStep - 1;

		setSelectedContact(contactResource(contacts)[tempData]);
		setContactForm({
			id: data.details[tempData].id, 
			name: data.details[tempData].name, 
			position: data.details[tempData].position, 
			no_ref:data.details[tempData].no_ref,
			categories:data.details[tempData].categories,
			value: data.details[tempData].categories.reduce((acc, category) => acc + (category.has_hour ? 0 : category.value), 0)
		});
		
		setStep(tempData);
	}

	const handleNextData = (tempStep) => {
		let tempData = tempStep + 1;

		setSelectedContact(contactResource(contacts)[tempData]);
		setContactForm({
			id: data.details[tempData].id, 
			name: data.details[tempData].name, 
			position: data.details[tempData].position, 
			no_ref:data.details[tempData].no_ref,
			categories:data.details[tempData].categories,
			value: data.details[tempData].categories.reduce((acc, category) => acc + (category.has_hour ? 0 : category.value), 0)
		});

		setStep(tempData);
	}

	const handleSelectedContact = (selected) => {
		if (selected) {
			setSelectedContact({
				id: selected.id, 
				name: selected.name, 
				position: selected.position, 
				no_ref:selected.no_ref
			});
			let index = contactResource(contacts).findIndex(user => user.id === selected.id);

			setContactForm({
				id: data.details[index].id, 
				name: data.details[index].name, 
				position: data.details[index].position, 
				no_ref:data.details[index].no_ref,
				categories:data.details[index].categories,
			});

			setStep(index);		
		}
	}

	const handleChangeHour =(values, index) => {	
		let tempContactForm = {...contactForm};
		let valueUsed = values.floatValue || 0;
				
		tempContactForm.categories[index] = {
			...tempContactForm.categories[index],
			qty: valueUsed,
			total: valueUsed * tempContactForm.categories[index].value * (tempContactForm.categories[index].is_cut ? -1 : 1)
		}		

		tempContactForm = {
			...tempContactForm,
			value: tempContactForm.categories.reduce((acc, category) => acc + category.total , 0)
		}

		setContactForm(tempContactForm);

		let tempData = {...data};

		tempData.details[step] = tempContactForm;

		tempData.value = tempData.details.reduce((acc, detail) => acc + detail.value , 0);

		setData(tempData);		
	};

	const handleChangeValue = (values, index) => {
		let tempContactForm = {...contactForm};
		let valueUsed = values.floatValue || 0;
				
		tempContactForm.categories[index] = {
			...tempContactForm.categories[index],
			value: valueUsed,
			total: valueUsed * tempContactForm.categories[index].qty * (tempContactForm.categories[index].is_cut ? -1 : 1)
		}		

		tempContactForm = {
			...tempContactForm,
			value: tempContactForm.categories.reduce((acc, category) => acc + category.total , 0)
		}

		setContactForm(tempContactForm);

		let tempData = {...data};

		tempData.details[step] = tempContactForm;

		tempData.value = tempData.details.reduce((acc, detail) => acc + detail.value , 0);

		setData(tempData);		

	}

	const handleReloadOldValue = () => {	
		let tempData = data;
		
		let newDetails = tempData.details.map(detail =>
			{				
				let newCategory = detail.categories.map(category => {
					let findCategoryInHistory = history.details.find(history => history.contact_id === detail.id && history.category_id === category.id);
					
					return {
						...category,
						value: category.has_hour ? category.value : findCategoryInHistory.value,
						total: category.has_hour ?  0 : findCategoryInHistory.value,
						qty: category.has_hour ?  0 : 1
					}				
				});

				return {
					...detail,
					categories : newCategory,
					value: newCategory.reduce((acc, category) => acc + category.total, 0),
				}
			}
		)

		tempData = {
			...tempData,
			value : newDetails.reduce((acc, detail) => acc + detail.value, 0),
			details: newDetails
		}

		setData(tempData);

		setContactForm({
			id: tempData.details[step].id, 
			name: tempData.details[step].name, 
			position: tempData.details[step].position, 
			no_ref:tempData.details[step].no_ref,
			categories:tempData.details[step].categories,
			value: tempData.details[step].categories.reduce((acc, category) => acc + (category.has_hour ? 0 : category.value), 0)
		});
	}

	const handleSelectedCashAccount = (selected) => {
		setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
		setData('cash_account_id', selected.id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		post(route('cashflow.staff-salary-payment.store', { organization: organization.id }),{
			onSuccess: ({ props }) => {
				const { flash } = props;

				toast.success(flash.success, {
					position: toast.POSITION.TOP_CENTER,
				});
			},
			onError: errors => {
				const { error } = errors;

				toast.error(error, {
					position: toast.POSITION.TOP_CENTER,
				});
				
			}
		})
	}
  
  return (
    <>
			<Head title='Pembayaran Gaji Staf' />
      <ToastContainer />

			<div className='w-full sm:mt-2'>
				<div className='sm:mx-auto px-3 sm:px-5 bg-white py-2 sm:pt-0 space-y-5 md:space-y-0'>
					<div className='sm:pt-0 pb-16 pt-12'>
						<div className='bg-white py-2 px-2 sm:pt-0'>
							<div className='w-full md:flex gap-2 md:py-5 '>
								<div className='sm:w-1/2 text-center md:text-start w-full text-slate-900 space-y-2'>
									<PrimaryButton onClick={() => setShowModal(true)}>
										Buat Pembayaran
									</PrimaryButton>
								</div>
								<div className='sm:w-1/2 w-full text-center md:text-end text-sm text-slate-900 space-y-2 my-auto md:text-2xl font-bold'>
									Total: IDR. { formatNumber(data.value) }
								</div>							
							</div>
							<div className='mt-5 md:mt-0'>
								{/* navigasi */}
								<section>
									<div className="flex justify-center gap-3">
										<div className='my-auto'>
											<button 
												onClick={() => handlePrevData(step)} 
												className={`my-auto p-2`} 
												disabled={step < 1 ? 'disabled' : false}
												type='button'
											>
												<IoPlayBack size={20} color={step < 1 ? 'gray' : ''}/>
											</button>
										</div>
										<div className="my-auto relative md:w-1/3 w-3/4">
											<div>
												<StaffSelectInput
													resources={contactResource(contacts)}
													selected={selectedContact}
													setSelected={(selected) => handleSelectedContact(selected)}
													maxHeight='max-h-40'
													placeholder='Cari Kontak'
													isError={false}
													id='contact'
													notFound={<span>Tidak Ada Data.</span>}
												/>
											</div>
										</div>
										<div className='my-auto'>
											<button 
												onClick={() => handleNextData(step)} 
												className='my-auto p-2'
												disabled={contacts.length > step + 1 ? false : 'disabled'}
												type='button'
											>
												<IoPlayForward size={20} color={contacts.length > step + 1 ? '' : 'gray'}/>
											</button>
										</div>
									</div>
									<div className='text-center text-xs'>
										{ step + 1 } / { contacts.length }										
									</div>
								</section>

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
												value={contactForm.name || ''}
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
												value={contactForm.position || ''}
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
												value={contactForm.no_ref || ''}
												disabled
											/>
										</div>
									</div>
									{
										history && <div className='w-full text-end mt-2 text-blue-500'>
										<button className='border text-xs rounded-md p-1 font-medium hover:bg-slate-100 flex space-x-1' onClick={handleReloadOldValue}>
											<div className='my-auto'><IoReload /></div>
											<div className='my-auto'>Ambil Dari Data Sebelumnya</div>											 
										</button>
									</div>	
									}																	
									<div className='mt-5 overflow-x-auto'>
										<div className='w-[750px] md:w-full'>
											<div className='flex font-bold gap-3 border-b py-3'>
												<div className='w-4/12'>Kategori</div>
												<div className='w-2/12 text-end'>Jam/Hari</div>
												<div className='w-3/12 text-end'>Nilai</div>
												<div className='w-3/12 text-end'>Total</div>
											</div>
											{
												contactForm.categories?.map((category, index) => 
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
												<div className='w-7/12 text-end'>IDR. {formatNumber(contactForm.value)}</div>
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<form onSubmit={handleSubmit} className='p-6' id='filter' name='filter'>
					<h2 className='text-lg font-medium text-gray-900'>Buat Pembayaran Gaji</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'No. Ref'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<TextInput
									id='no_ref'
									name='no_ref'
									className={`w-full`}
									placeholder='No Ref'
									value={data.no_ref || ''}
									disabled
								/>
								{errors?.no_ref && <span className='text-red-500 text-xs'>{errors.no_ref}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Tanggal'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<Datepicker
										value={dateValue}
										onChange={handleDateValueChange}
										inputClassName={errors?.date && 'border-red-500 rounded-lg'}
										useRange={false}
										asSingle={true}
										placeholder='Tanggal'
										id='date'
										displayFormat='MMMM DD, YYYY'
								/>
								{errors?.date && <span className='text-red-500 text-xs'>{errors.date}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Tahun Ajaran'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<select 
									className="select select-bordered w-full" 
									value={data.study_year} 
									onChange={e => setData('study_year', e.target.value)} 
									id='study_year'
								>
									<option>{dayjs(date).format('YYYY').toString()}</option>
									<option>{(dayjs(date).format('YYYY') - 1).toString()}</option>
								</select>
								{errors?.study_year && <span className='text-red-500 text-xs'>{errors.study_year}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Bulan'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<select 
									className="select select-bordered w-full" 
									value={data.month} 
									onChange={e => setData('month', e.target.value)} 
									id='month'
								>
									{
										monthList().map((month, index) => 
											<option 
												key={index} 
											>{month}</option>
										)
									}
								</select>
								{errors?.month && <span className='text-red-500 text-xs'>{errors.month}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Total'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<NumericFormat
										value={data.value}
										customInput={TextInput}
										thousandSeparator={true}
										className={`text-end w-full`}
										prefix={'IDR. '}
										disabled='disabled'
								/>
								{errors?.value && <span className='text-red-500 text-xs'>{errors.value}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Akun Kas'}
									htmlFor='id'
									className=' mx-auto my-auto'
								/>
							</div>

							<div className='w-full sm:w-2/3'>
								<ClientSelectInput
										resources={cashAccounts}
										selected={selectedCashAccount}
										setSelected={(selected) => handleSelectedCashAccount(selected)}
										maxHeight='max-h-40'
										placeholder='Cari Akun'
										isError={errors.cash_account_id ? true : false}
										id='cash_account'
										notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-ledger.account', {organization:organization.id})}>Buat Baru ?</Link></span>}
								/>
							</div>
						</div>
					</div>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={() => setShowModal(false)}>Batal</SecondaryButton>

						<PrimaryButton className='ms-3'>Simpan</PrimaryButton>
					</div>
				</form>
			</Modal>
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
