import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import studyYear from '@/Utils/studyYear';
import FormInput from '@/Components/FormInput';
import InputLabel from '@/Components/InputLabel';
import Datepicker from 'react-tailwindcss-datepicker';
import { useDebounce } from 'use-debounce';
import { usePrevious, useSetState } from 'react-use';
import formatNumber from '@/Utils/formatNumber';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import StaffSelectInput from '@/Components/SelectInput/StaffSelectInput';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';

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
					has_hour: category.has_hour ? true : false,
					qty: 0,
					total: category.has_hour ? 0 : category.value
				}
			})
		}
	})
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
		details:dataDetails(contacts, categories)
  })
	
	const [dateValue, setDateValue] = useState({
		startDate: date,
		endDate: date,
	});

	const [selectedContact, setSelectedContact] = useState({ id: null, name: '', position: '', no_ref:'' });
	const [contactForm, setContactForm] = useState({});
	const [contactResources, setContactResources] = useState([]);

	const [debounceDateValue] = useDebounce(dateValue, 500);

	const prevDate = usePrevious(dateValue);

	const [step, setStep] = useState(0);	

	// useUffect
	useEffect(() => {
		handleSetDetails();
	},[]);

	// function
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

	const handleChangeHour = (values, index) => {
		let tempDataDetail = data.details;
		let tempContactForm = contactForm;

		let tempValue = tempContactForm.categories[index].value;
		// tempValue += 
		tempDataDetail[step].total += values.floatValue;

		console.log(tempContactForm.categories[index]);
		
		// console.log('change hour');
		// console.log(values);
		// console.log(index);


		
	}

	const handleChangeValue = (values, index) => {

	}

	const handleChangeTotal = (values, index) => {

	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(data.details);
		
		return
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
				<div className='w-full sm:mt-2'>
					<div className='sm:mx-auto px-3 sm:px-5 bg-white py-2 sm:pt-0 space-y-5 md:space-y-0'>
						<div className='w-full md:flex gap-2 md:py-5 '>
							<div className='sm:w-1/2 text-center md:text-start w-full text-slate-900 space-y-2'>
								<PrimaryButton>
									Buat Pembayaran
								</PrimaryButton>
								{/* <div>
									<InputLabel value={'Bulan'} />
								</div>
								<div>
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
								</div> */}
							</div>
							<div className='sm:w-1/2 w-full text-center text-sm text-slate-900 space-y-2 my-auto md:text-xl font-bold'>
								Total: IDR. { formatNumber(data.value) }
								{/* <div>
									<InputLabel value={'Tanggal Pembayaran'} />
								</div>
								<div>
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
								</div> */}
							</div>							
						</div>
						<div>
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

							<section className='w-full md:w-3/4 mx-auto mt-5'>
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
											value={'No.Id'}
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
								<div className='mt-5 overflow-x-auto'>
									<div className='w-[700px] md:w-full'>
										<div className='flex font-bold gap-3 border-b py-3'>
											<div className='w-5/12'>Kategori</div>
											<div className='w-1/12 text-end'>Jam/Hari</div>
											<div className='w-3/12 text-end'>Nilai</div>
											<div className='w-3/12 text-end'>Total</div>
										</div>
										{
											contactForm?.categories?.map((category, index) => 
												<div className='flex gap-3 border-b py-3' key={index}>
													<div className='w-5/12 my-auto'>{ category.name }</div>
													<div className='w-1/12 text-end'>
														{
															category.has_hour && <div className='md:flex gap-1'>
																<NumericFormat
																	value={category.qty}
																	customInput={TextInput}
																	onValueChange={(values) => handleChangeHour(values, index)}
																	thousandSeparator={true}
																	className='text-end w-full'
																	prefix={''}
																/>
																<div className='my-auto hidden md:block'>{category.unit}</div>
															</div>
														}
													</div>
													<div className='w-3/12 text-end'>
														{	
															category.has_hour && 
																<NumericFormat
																	value={category.value}
																	customInput={TextInput}
																	onValueChange={(values) => handleChangeValue(values, index)}
																	thousandSeparator={true}
																	className='text-end w-full'
																	prefix={'IDR. '}
																/>
														}
													</div>
													<div className='w-3/12 text-end'>
														<NumericFormat
															value={category.total}
															customInput={TextInput}
															onValueChange={(values) => handleChangeTotal(values, index)}
															thousandSeparator={true}
															className='text-end w-full'
															prefix={'IDR. '}
															disabled={category.has_hour ? 'disabled' : false}
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
