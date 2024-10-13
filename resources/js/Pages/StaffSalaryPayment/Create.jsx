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
			no_ref:contact.no_ref
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
		details:[]
  })
	
	const [dateValue, setDateValue] = useState({
		startDate: date,
		endDate: date,
	});

	const [selectedContact, setSelectedContact] = useState({ id: null, name: '', position: '', no_ref:'' });
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
		// loop untuk kontak
		contacts.map((contact, index) => {	
			if (index < 1) {
				setSelectedContact({
					id: contact.contact_id, 
					name: contact.contact.name, 
					position: contact.position, 
					no_ref:contact.no_ref
				})
			}

			let temp = data.details;
			
			temp = [
				...temp, 
				{
					'contact_id' : contact.id,
					'contact_name' : contact.name
				}
			]

			setData('details', temp);
		})
	}

	const handleDateValueChange = (newValue) => {
		setDateValue(newValue);
		setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
	};

	const handlePrevData = (tempStep) => {
		let tempData = tempStep - 1;

		setSelectedContact(contactResource(contacts)[tempData]);
		
		setStep(tempData);
	}

	const handleNextData = (tempStep) => {
		let tempData = tempStep + 1;

		setSelectedContact(contactResource(contacts)[tempData]);

		setStep(tempData);
	}

	const handleSelectedContact = (selected) => {
		setSelectedContact({
			id: selected.id, 
			name: selected.name, 
			position: selected.position, 
			no_ref:selected.no_ref
		});

		let index = contactResource(contacts).findIndex(user => user.id === selected.id);
		setStep(index);		
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(data);
		
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
					<div className='sm:mx-auto px-3 sm:px-5 bg-white py-2 sm:pt-0'>
						<div className='w-full flex gap-2 md:py-5'>
							<div className='sm:w-1/2 w-full text-slate-900 space-y-2 my-auto text-xl font-bold'>
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
							<div className='sm:w-1/2 text-end w-full text-slate-900 space-y-2'>
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
						</div>
						<div>
							{/* navigasi */}
							<section>
								<div className="flex justify-center gap-3">
									<div className='my-auto'>
										<button 
											onClick={() => handlePrevData(step)} 
											className={`my-auto p-2`} 
											disabled={step + 1 < 1 ? 'disabled' : false}
											type='button'
										>
												<IoPlayBack size={20} color={step < 1 ? 'gray' : ''}/>
										</button>
									</div>
									<div className="my-auto relative w-1/3">
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
