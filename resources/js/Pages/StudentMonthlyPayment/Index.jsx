import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';
import StudentMonthlyPaymentMobile from './Components/StudentMonthlyPaymentMobile';
import StudentMonthlyPaymentDesktop from './Components/StudentMonthlyPaymentDesktop';
import Datepicker from 'react-tailwindcss-datepicker';

export default function Index({ role, organization, payments, searchFilter, type, startDate,
	endDate }) {   
	// State
	const { errors } = usePage().props;

	const [showSearch, setShowSearch] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showModalFilter, setShowModalFilter] = useState(false);

	const [search, setSearch] = useState(searchFilter || '');
	const [titleDeleteModal, setTitleDeleteModal] = useState('');
	const {
		data,
		setData,
		delete: destroy,
		processing,
		reset,
	} = useForm({
		id: 0,
	});

	const [dataFilter, setDataFilter] = useState({
		entryYear: null,
		month: null,
		type: type || 'now'
	});

	const prevSearch = usePrevious(search);
	const [debounceValue] = useDebounce(search, 500);

	const [dateValue, setDateValue] = useState({
		startDate: startDate || '',
		endDate: endDate || '',
	});
	const [debounceDateValue] = useDebounce(dateValue, 500);

	// useState
	useEffect(() => {
		if (prevSearch !== undefined) {
			handleReloadPage();
		}
	}, [debounceValue, debounceDateValue]);

	useEffect(() => {		
		errors && errors.message &&
		toast.error(<>{errors.message} <Link href={route('data-master.contact-category', {organization: organization.id})} className='text-blue-600 font-bold'>Tambahkan</Link></>, {
			position: toast.POSITION.TOP_CENTER,
		});
	},[]);

	//function
	const handleReloadPage = () => {
		router.reload({
			only: ['payments'],
			data: {
				search,
				start_date: dateValue.startDate,
				end_date: dateValue.endDate,
				type: dataFilter.type
			},
			preserveState: true,
		});
	};

	const handleFilter = (e) => {
		e.preventDefault();
		
		handleReloadPage();
		setShowModalFilter(false);
	};

	const handleDelete = (payment) => {
		setTitleDeleteModal(`Hapus Pembayaran No Ref ${payment.no_ref}`);
		setShowDeleteConfirmation(true);
		setData('id', payment.id);
	};

	const handleSubmitDelete = (e) => {
		e.preventDefault();

		destroy(route('cashflow.student-monthly-payment.delete', { organization: organization.id, payment: data.id }), {
			onSuccess: () => {
				setShowDeleteConfirmation(false);
				toast.success(`Pembayaran Berhasil Dihapus`, {
					position: toast.POSITION.TOP_CENTER,
				});
				reset();
			},
			onError: (error) => {
				setShowDeleteConfirmation(false);
				toast.error(error.message, {
					position: toast.POSITION.TOP_CENTER,
				});
			},
		});
	};

	const handleDateValueChange = (newValue) => {
		setDateValue(newValue);
	};

	return (
		<>
			{/* Mobile */}
			<Head title='Pembayaran Iuran Siswa' />
			<ToastContainer />

			{role !== 'viewer' && (
				<Link href={route('cashflow.student-monthly-payment.create', organization.id)}>
					<AddButtonMobile label={'Tambah'} />
				</Link>
			)}
			
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
								start_date: dateValue.startDate,
								end_date: dateValue.endDate,
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
								start_date: dateValue.startDate,
								end_date: dateValue.endDate,
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
				hasFilter={true}
				showFilter={() => setShowModalFilter(true)}
				hasDate={true}
				dateValue={dateValue}
				onChangeDate={handleDateValueChange}
			/>
			<ContentMobile>
				{payments.data.map((payment) => (
					<StudentMonthlyPaymentMobile
						payment={payment}
						key={payment.id}
						handleDelete={() => handleDelete(payment)}
						role={role}
					/>
				))}
			</ContentMobile>
			{/* Mobile */}

			{/* Desktop */}
			<ContainerDesktop>
				<TitleDesktop>
					<div className='my-auto w-5/12'>
						{role !== 'viewer' && (
							<div className='space-x-2'>
								<Link href={route('cashflow.student-monthly-payment.create', organization.id)}>
									<PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
								</Link>
							</div>
						)}
					</div>	
					<div className='my-auto w-4/12 flex gap-5 justify-end'>
						<button className='py-3 px-3 border rounded-lg h-full' onClick={() => setShowModalFilter(true)}>
							<IoFilter />
						</button>
						<Datepicker
							value={dateValue}
							onChange={handleDateValueChange}
							showShortcuts={true}
							configs={{
								shortcuts: {
									today: 'Hari Ini',
									yesterday: 'Kemarin',
									past: (period) => `${period} Hari Terakhir`,
									currentMonth: 'Bulan Ini',
									pastMonth: 'Bulan Lalu',
									currentYear: 'Tahun Ini',
								},
							}}
							separator={'s.d'}
						/>
					</div>
					<div className='w-3/12 border flex rounded-lg'>
						<label htmlFor='search-input' className='my-auto ml-2'>
							<IoSearchSharp />
						</label>
						<input
							id='search-input'
							name='search-input'
							type='search'
							placeholder='Cari Siswa'
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
										start_date: dateValue.startDate,
										end_date: dateValue.endDate,
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
										start_date: dateValue.startDate,
										end_date: dateValue.endDate,
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
										<th className='bg-gray-200'>Nama</th>
										<th className='bg-gray-200'>Bulan</th>
										<th className='bg-gray-200'>Tahun Ajaran</th>
										<th className='bg-gray-200 text-end'>Jumlah Bayar</th>
										<th className='bg-gray-200'>Tipe</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{payments.data.map((payment, index) => (
										<StudentMonthlyPaymentDesktop
											key={index}
											payment={payment}
											className={`${index % 2 == 0 && 'bg-gray-100'} text-sm`}
											handleDelete={() => handleDelete(payment)}
											role={role}
										/>
									))}
								</tbody>
							</table>
						</ContentDesktop>
					</div>
				</div>
			</ContainerDesktop>
			{/* Desktop */}

			{/* Modal */}
			{/* Filter  */}
			<Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
				<form onSubmit={handleFilter} className='p-6' id='filter' name='filter'>
					<h2 className='text-lg font-medium text-gray-900'>Filter Pembayaran Iuran Bulanan</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
								<div className='sm:w-1/4 w-full my-auto font-bold'>Tipe</div>
								<div className='sm:w-3/4 w-full flex'>
									<select 
                    className="select select-bordered w-full" 
                    value={dataFilter.type} 
                    onChange={e => setDataFilter({...dataFilter, type: e.target.value})} 
                    id='study_year'
                  >
                    <option value={'all'}>Semua</option>
                    <option value={'now'}>Lunas</option>
                    <option value={'receivable'}>Belum Bayar</option>
                    <option value={'prepaid'}>Bayar Dimuka</option>
                  </select>
								</div>
						</div>
					</div>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

						<PrimaryButton className='ms-3'>Filter</PrimaryButton>
					</div>
				</form>
			</Modal>
			<Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
				<form onSubmit={handleSubmitDelete} className='p-6'>
					<h2 className='text-lg font-medium text-gray-900 text-center'>{titleDeleteModal}</h2>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

						<DangerButton className='ms-3' disabled={processing}>
							Hapus
						</DangerButton>
					</div>
				</form>
			</Modal>
			{/* Modal */}
		</>
	);
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Pembayaran Iuran Bulanan Siswa</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Pembayaran Iuran Bulanan Siswa'
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
					<li>Pembayaran Iuran Bulanan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
