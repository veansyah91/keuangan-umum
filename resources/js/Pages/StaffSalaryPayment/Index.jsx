import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import PrimaryButton from '@/Components/PrimaryButton';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import StaffSalaryPaymentMobile from './Components/StaffSalaryPaymentMobile';
import StaffSalaryPaymentDesktop from './Components/StaffSalaryPaymentDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Datepicker from 'react-tailwindcss-datepicker';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';

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

const yearList = () => {
	const now = dayjs().format('YYYY');

	let arrayYear = [];

	for (let index = 0; index < 15; index++) {
		arrayYear = [...arrayYear, (now - index).toString()];		
	}

	return arrayYear;
}

export default function Index({
  role, organization, payments, searchFilter, flash, cashAccounts
}) {	
	const [search, setSearch] = useState(searchFilter || '');	
	const [showEdit, setShowEdit] = useState(false);
	// const [showFilterModal, setShowFilterModal] = useState(false);

	const { data, setData, reset, processing, errors, patch, setError } = useForm({
		id: null,
		date: '',
		no_ref: '',
		bulan: '',
		tahun: '',
		value: 0,
		cash_account_id:''
	});

	const [dataFilter, setDataFilter] = useState({
		month: '',
		study_year: ''
	});

	const [selectedEditData, setSeletedEditData] = useState({
		id: null,
		date: '',
		no_ref: '',
		bulan: '',
		tahun: '',
		value: 0
	});

	const [dateValue, setDateValue] = useState({
		startDate: '',
		endDate: '',
	});	

	const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

	const [debounceDateValue] = useDebounce(dateValue, 500);

	const prevDate = usePrevious(dateValue);

	useEffect(() => {
		flash?.success && toast.success(flash.success, {
			position: toast.POSITION.TOP_CENTER,
		});
	},[]);

	useEffect(() => {
		if (prevDate !== undefined) {
			if (dayjs(dateValue.startDate).format('MM') !== dayjs(selectedEditData.date).format('MM')) {
				reloadNewRef();				
			} else {
				setData('no_ref', selectedEditData.no_ref);
			}
			
		}
	}, [debounceDateValue]);

	const reloadNewRef = () => {
		router.reload({
			only: ['newRef'],
			data: {
				date: dayjs(dateValue.startDate).format('YYYY-MM-DD'),
			},
			onSuccess: (page) => {
				setData('no_ref', page.props.newRef);
			},
		});
	};

	const handelEdit = (dataEdit) => {
		setDateValue({
			startDate: dataEdit.date,
			endDate: dataEdit.date,
		});
		setData({
			id: dataEdit.id,
			date: dataEdit.date,
			no_ref: dataEdit.no_ref,
			month: dataEdit.month,
			study_year: dataEdit.study_year.toString(),
			value: dataEdit.value,
			cash_account_id: dataEdit.journal.ledger.account.id
		});
		setSeletedEditData({
			id: dataEdit.id,
			date: dataEdit.date,
			no_ref: dataEdit.no_ref,
			month: dataEdit.month,
			study_year: dataEdit.study_year.toString(),
			value: dataEdit.value,
			cash_account_id: dataEdit.journal.ledger.account.id
		});
		setShowEdit(true);
		setSelectedCashAccount({ id: dataEdit.journal.ledger.account.id, name: dataEdit.journal.ledger.account.name, code: dataEdit.journal.ledger.account.code, is_cash: true });
	}

	const handleDateValueChange = (newValue) => {
		setDateValue(newValue);		
		setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
	};

	const closeShowEdit = () => {
		setShowEdit(false);
		setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
		reset();
		setError('cash_account_id', '');
	}

	const handleSelectedCashAccount = (selected) => {
		setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
		setData('cash_account_id', selected.id);
	};

	const submitEdit = (e) => {
		e.preventDefault();

		patch(route('cashflow.staff-salary-payment.update', {organization: organization.id, payment: data.id}),{
			onSuccess: ({props}) => {
				const { flash } = props;

				toast.success(flash.success, {
					position: toast.POSITION.TOP_CENTER,
				});

				const url = new URL(window.location);

				// Hapus parameter query tertentu, misalnya 'date'
				url.searchParams.delete('date');

				// Update URL tanpa reload halaman
				window.history.replaceState(null, '', url);
				
				setShowEdit(false);
				reset();
			},
			onError: errors => {
				console.log(errors);				
			}
		})		
	}

	const handleSubmitFilter = (e) => {
		e.preventDefault();


	}

  return (
    <>
      {/* Mobile */}
			<Head title='Pembayaran Gaji Bulanan' />
			<ToastContainer />

			{role !== 'viewer' && (
				<Link href={route('cashflow.staff-salary-payment.create', organization.id)}>
					<AddButtonMobile label={'Tambah'} />
				</Link>
			)}
			
			{/* Mobile */}
			<TitleMobile
				zIndex={'z-50'}
				search={search}
				setSearch={(e) => setSearch(e.target.value)}
				pageBefore={
					payments.links[0].url ? (
						<Link
							href={route('cashflow.student-monthly-payment', {
								organization: organization.id,
								page: payments.current_page - 1,
								search: search,
							})}
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
							href={route('cashflow.student-monthly-payment', {
								organization: organization.id,
								page: payments.current_page + 1,
								search: search,
							})}
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
				hasFilter={false}
				showFilter={() => setShowModalFilter(true)}
			/>
			<ContentMobile>
				{payments.data.map((payment) => (
					<StaffSalaryPaymentMobile
						payment={payment}
						key={payment.id}
						role={role}
					/>
				))}
			</ContentMobile>

			{/* Desktop */}
			<ContainerDesktop>
				<TitleDesktop>
          <div className='my-auto w-7/12'>
						{role !== 'viewer' && (
							<div className='space-x-2'>
								<Link href={route('cashflow.staff-salary-payment.create', organization.id)}>
									<PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
								</Link>
							</div>
						)}
					</div>
          <div className='my-auto w-4/12 flex gap-5 justify-end'>
						{/* <button className='py-3 px-3 border rounded-lg h-full' onClick={() => setShowModalFilter(true)}>
								<IoFilter />
						</button>	 */}
					</div>
					<div className='w-3/12 border flex rounded-lg'>
						<label htmlFor='search-input' className='my-auto ml-2'>
							<IoSearchSharp />
						</label>
						<input
							id='search-input'
							name='search-input'
							type='search'
							placeholder='Cari No Ref'
							className='w-full border-none focus:outline-none focus:ring-0'
							value={search || ''}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className='italic text-xs my-auto w-1/12 text-center'>
						<PageNumber data={payments} />
					</div>
					<div className='my-auto flex space-x-2 w-1/12'>
						<div className='my-auto'>
							{payments.links[0].url ? (
								<Link
									href={route('cashflow.student-monthly-payment', {
										organization: organization.id,
										page: payments.current_page - 1,
										search: search,
									})}
									preserveState
									only={['payments']}>
									<IoPlayBack />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayBack />
								</div>
							)}
						</div>
						<div className='my-auto'>
							{payments.current_page}/{payments.last_page}
						</div>
						<div className='my-auto'>
							{payments.links[payments.links.length - 1].url ? (
								<Link
									href={route('cashflow.student-monthly-payment', {
										organization: organization.id,
										page: payments.current_page + 1,
										search: search,
									})}
									only={['payments']}
									preserveState>
									<IoPlayForward />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayForward />
								</div>
							)}
						</div>
					</div>
        </TitleDesktop>

				<div className='sm:flex hidden gap-5'>
					<div className='w-full'>
						<ContentDesktop>
							<table className='table table-pin-rows table-pin-cols text-base'>
								<thead className='text-base text-gray-900'>
									<tr className=''>
										<th className='bg-gray-200'>Tanggal</th>
										<th className='bg-gray-200'>No Ref</th>
										<th className='bg-gray-200'>Bulan</th>
										<th className='bg-gray-200'>Tahun</th>
										<th className='bg-gray-200 text-end'>Nilai</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{payments.data.map((payment, index) => (
										<StaffSalaryPaymentDesktop
											key={index}
											payment={payment}
											className={`${index % 2 == 0 && 'bg-gray-100'} text-sm`}
											role={role}
											handelEdit={handelEdit}
										/>
									))}
								</tbody>
							</table>
						</ContentDesktop>
					</div>
				</div>
      </ContainerDesktop>

			{/* Modal */}
			<Modal show={showEdit} onClose={closeShowEdit}>
				<form onSubmit={submitEdit} className='p-6' id='filter' name='filter'>
					<h2 className='text-lg font-medium text-gray-900'>Ubah Pembayaran</h2>
					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'No. Ref'}
									htmlFor='no_ref'
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
									htmlFor='date'
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
									htmlFor='study_year'
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
									{
										yearList().map(year =>
											<option key={year}>{year}</option>
										)
									}
								</select>
								{errors?.study_year && <span className='text-red-500 text-xs'>{errors.study_year}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Bulan'}
									htmlFor='month'
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
									htmlFor='total'
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
										id='total'
								/>
								{errors?.value && <span className='text-red-500 text-xs'>{errors.value}</span>}
							</div>
						</div>
						<div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel
									value={'Akun Kas'}
									htmlFor='cash_account'
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
						<SecondaryButton onClick={closeShowEdit}>Batal</SecondaryButton>

						<PrimaryButton className='ms-3' disabled={processing}>Ubah</PrimaryButton>
					</div>
				</form>
			</Modal>

			{/* <Modal show={showFilterModal} onClose={() => setShowFilterModal(false)}>
				<form onSubmit={handleSubmitFilter}>
					
				</form>
			</Modal> */}
    </>
  )
}

Index.layout = (page) => (
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
						<Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
					</li>
					<li>Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
