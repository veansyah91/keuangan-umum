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
import StudentEntryReceivablePaymentMobile from './Components/StudentEntryReceivablePaymentMobile';
import StudentEntryReceivablePaymentDesktop from './Components/StudentEntryReceivablePaymentDesktop';
import Datepicker from 'react-tailwindcss-datepicker';

export default function Index({ organization, role, receivablePayments, searchFilter, studyYears, studyYear, startDate,
	endDate }) {	 
		
	const [search, setSearch] = useState(searchFilter || '');
	const [titleDeleteModal, setTitleDeleteModal] = useState('');
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showModalFilter, setShowModalFilter] = useState(false);
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
		studyYear: studyYear || '',
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

	const handleDelete = (payment) => {
		setTitleDeleteModal(`Hapus Pembayaran Piutang No Ref ${payment.no_ref}`);
		setShowDeleteConfirmation(true);
		setData('id', payment.id);
	};

	const handleFilter = (e) => {
		e.preventDefault();
		
		handleReloadPage();
		setShowModalFilter(false);
	};

	const handleDateValueChange = (newValue) => {
		setDateValue(newValue);
	};

	//function
	const handleReloadPage = () => {
		router.reload({
			only: ['receivablePayments'],
			data: {
				search,
				start_date: dateValue.startDate,
				end_date: dateValue.endDate,
				studyYear: dataFilter.studyYear
			},
			preserveState: true,
		});
	};

	const handleSubmitDelete = (e) => {
		e.preventDefault();

		destroy(route('cashflow.student-entry-receivable-payment.delete', { organization: organization.id, receivablePayment: data.id }), {
			onSuccess: () => {
				setShowDeleteConfirmation(false);
				toast.success(`Pembayaran Piutang Berhasil Dihapus`, {
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

  return (
    <>
			{/* Mobile */}
			<Head title='Pembayaran Piutang Iuran Siswa' />
			<ToastContainer />

			{role !== 'viewer' && (
				<Link href={route('cashflow.student-entry-receivable-payment.create', organization.id)}>
					<AddButtonMobile label={'Tambah'} />
				</Link>
			)}
			<TitleMobile
				zIndex={'z-50'}
				search={search}
				setSearch={(e) => setSearch(e.target.value)}
				pageBefore={
					receivablePayments.links[0].url ? (
						<Link
							href={route('cashflow.student-entry-receivable-payment', {
								organization: organization.id,
								page: receivablePayments.current_page - 1,
								search: search,
								start_date: dateValue.startDate,
								end_date: dateValue.endDate,
							})}
							preserveState
							only={['receivablePayments']}>
							<IoPlayBack />
						</Link>
					) : (
						<div className='text-gray-300'>
							<IoPlayBack />
						</div>
					)
				}
				pageAfter={
					receivablePayments.links[receivablePayments.links.length - 1].url ? (
						<Link
							href={route('cashflow.student-entry-receivable-payment', {
								organization: organization.id,
								page: receivablePayments.current_page + 1,
								start_date: dateValue.startDate,
								end_date: dateValue.endDate,
								search: search,
							})}
							only={['receivablePayments']}
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
						{receivablePayments.current_page}/{receivablePayments.last_page}
					</>
				}
				data={receivablePayments}
				hasFilter={true}
				showFilter={() => setShowModalFilter(true)}
				hasDate={true}
				dateValue={dateValue}
				onChangeDate={handleDateValueChange}
			/>
			<ContentMobile>
				{receivablePayments.data.map((payment) => (
					<StudentEntryReceivablePaymentMobile
						payment={payment}
						key={payment.id}
						handleDelete={() => handleDelete(payment)}
						role={role}
					/>
				))}
			</ContentMobile>

			{/* Desktop */}
			<ContainerDesktop>
				<TitleDesktop>
					<div className='my-auto w-5/12'>
						{role !== 'viewer' && (
							<div className='space-x-2'>
								<Link href={route('cashflow.student-entry-receivable-payment.create', organization.id)}>
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
							placeholder='Cari Pembayaran'
							className='w-full border-none focus:outline-none focus:ring-0'
							value={search || ''}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className='italic text-xs my-auto w-1/12 text-center'>
						<PageNumber data={receivablePayments} />
					</div>
					<div className='my-auto flex space-x-2 w-1/12'>
						<div className='my-auto'>
							{receivablePayments.links[0].url ? (
								<Link
									href={route('cashflow.student-entry-receivable-payment', {
										organization: organization.id,
										page: receivablePayments.current_page - 1,
										start_date: dateValue.startDate,
										end_date: dateValue.endDate,
										search: search,
									})}
									preserveState
									only={['receivablePayments']}>
									<IoPlayBack />
								</Link>
							) : (
								<div className='text-gray-300'>
									<IoPlayBack />
								</div>
							)}
						</div>
						<div className='my-auto'>
							{receivablePayments.current_page}/{receivablePayments.last_page}
						</div>
						<div className='my-auto'>
							{receivablePayments.links[receivablePayments.links.length - 1].url ? (
								<Link
									href={route('cashflow.student-entry-receivable-payment', {
										organization: organization.id,
										page: receivablePayments.current_page + 1,
										start_date: dateValue.startDate,
										end_date: dateValue.endDate,
										search: search,
									})}
									only={['receivablePayments']}
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
										<th className='bg-gray-200'>Tahun Ajaran</th>
										<th className='bg-gray-200 text-end'>Jumlah Bayar</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{receivablePayments.data.map((payment, index) => (
										<StudentEntryReceivablePaymentDesktop
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
					<h2 className='text-lg font-medium text-gray-900'>Filter Pembayaran Piutang Iuran Bulanan</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
								<div className='sm:w-1/4 w-full my-auto font-bold'>Tahun Ajaran</div>
								<div className='sm:w-3/4 w-full flex'>
									<select 
                    className="select select-bordered w-full" 
                    value={dataFilter.studyYear} 
                    onChange={e => setDataFilter({...dataFilter, studyYear: e.target.value})} 
                    id='study_year'
                  >
                    <option value={''}>Semua</option>
										{
											studyYears.map((studyYear, index) => 
												<option value={studyYear.year} key={index}>{studyYear.year}</option>
											)
										}
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
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Pembayaran Piutang Iuran Tahunan Siswa</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Pembayaran Piutang Iuran Tahunan Siswa'
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
					<li>Pembayaran Piutang Iuran Tahunan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
