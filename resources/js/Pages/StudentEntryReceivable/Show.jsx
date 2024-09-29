import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { FiPrinter } from "react-icons/fi";
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
import StudentEntryReceivableDetailMobile from './Components/StudentEntryReceivableDetailMobile';
import StudentEntryReceivableDetailDesktop from './Components/StudentEntryReceivableDetailDesktop';
import formatNumber from '@/Utils/formatNumber';

export default function Show({ role, organization, receivables, searchFilter, receivable }) {	
	// State
	const { errors } = usePage().props;

	const [showSearch, setShowSearch] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const [search, setSearch] = useState(searchFilter || '');
	const [titleDeleteModal, setTitleDeleteModal] = useState('');
	const {
		data,
		setData,
		delete: destroy,
		processing,
		reset,
	} = useForm({
		id: null,
		receivable_id: null
	});

	const prevSearch = usePrevious(search);
	const [debounceValue] = useDebounce(search, 500);

	// useState
	useEffect(() => {
		if (prevSearch !== undefined) {
			handleReloadPage();
		}
	}, [debounceValue]);

	useEffect(() => {
		errors && 
		toast.error(errors.message, {
			position: toast.POSITION.TOP_CENTER,
		});
	},[]);

	//function
	const handleReloadPage = () => {
		router.reload({
			only: ['receivables'],
			data: {
				search,
			},
		});
	};
	const handleDelete = (receivable) => {        
		setTitleDeleteModal(`Hapus Piutang ${receivable.no_ref}`);
		setShowDeleteConfirmation(true);
		setData({
			id: receivable.id,
			receivable: receivable.receivable_id
		});
	};

    return (
        <>
					{/* Mobile */}
					<Head title='Piutang Iuran Siswa' />
					<ToastContainer />
            
            <TitleMobile
							zIndex={'z-50'}
							search={search}
							setSearch={(e) => setSearch(e.target.value)}
							pageBefore={
								receivables.links[0].url ? (
									<Link
										href={route('cashflow.student-entry-receivable.show', {
											organization: organization.id,
											receivable: receivable.id,
											page: receivables.current_page - 1,
											search: search
										})}
										preserveState
										only={['receivables']}>
										<IoPlayBack />
									</Link>
								) : (
									<div className='text-gray-300'>
										<IoPlayBack />
									</div>
								)
							}
							pageAfter={
								receivables.links[receivables.links.length - 1].url ? (
									<Link
										href={route('cashflow.student-entry-receivable.show', {
											organization: organization.id,
											receivable: receivable.id,
											page: receivables.current_page + 1,
											search: search
										})}
										only={['receivables']}
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
									{receivables.current_page}/{receivables.last_page}
								</>
							}
							data={receivables}
            />
            <ContentMobile>
							{receivables.data.map((receivable, index) => (
								<StudentEntryReceivableDetailMobile
									key={index}
									receivable={receivable}
									handleDelete={() => handleDelete(receivable)}
									role={role}
								/>
							))}
            </ContentMobile>
            {/* Mobile */}

            {/* Desktop */}
            <ContainerDesktop>
							<TitleDesktop>
								<div className='my-auto w-7/12 text-2xl'>
									Total: <span className='font-bold'>IDR. { formatNumber(receivable.value) }</span> 
								</div>
								<div className='my-auto w-4/12 flex gap-5 justify-end'>
									<Link className='py-3 px-3 border rounded-lg h-full' href={route('cashflow.student-entry-receivable.print', {organization: organization.id, studentEntryReceivable: receivable.id})}>
											<FiPrinter />
									</Link>
										
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
									<PageNumber data={receivables} />
								</div>
								<div className='my-auto flex space-x-2 w-1/12'>
									<div className='my-auto'>
										{receivables.links[0].url ? (
											<Link
												href={route('cashflow.student-entry-receivable.show', {
													organization: organization.id,
													receivable: receivable.id,
													page: receivables.current_page - 1,
													search: search
												})}
												preserveState
												only={['receivables']}>
												<IoPlayBack />
											</Link>
										) : (
											<div className='text-gray-300'>
												<IoPlayBack />
											</div>
										)}
									</div>
									<div className='my-auto'>
										{receivables.current_page}/{receivables.last_page}
									</div>
									<div className='my-auto'>
										{receivables.links[receivables.links.length - 1].url ? (
											<Link
												href={route('cashflow.student-entry-receivable.show', {
													organization: organization.id,
													receivable: receivable.id,
													page: receivables.current_page + 1,
													search: search
												})}
												only={['receivables']}
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
													<th className='bg-gray-200'>Tanggal Transaksi</th>
													<th className='bg-gray-200'>No Ref</th>
													<th className='bg-gray-200'>Tahun Ajaran</th>
													<th className='bg-gray-200 text-end'>Jumlah</th>
													<th className='bg-gray-200'>Status</th>
													<th className='bg-gray-200'></th>
												</tr>
											</thead>
											<tbody>
												{receivables.data.map((receivable, index) => (
													<StudentEntryReceivableDetailDesktop
														key={index}
														receivable={receivable}
														className={`${index % 2 == 0 && 'bg-gray-100'}`}
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
        </>
    );
}

Show.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Piutang Iuran Tahunan Siswa {page.props.contact.name}</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title={`Piutang Iuran Tahunan`}
		backLink={
			<Link href={route('cashflow.student-entry-receivable', page.props.organization.id)}>
				<IoArrowBackOutline />
			</Link>
		}
		breadcrumbs={
			<div className='text-sm breadcrumbs'>
				<ul>
					<li className='font-bold'>
						<Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
					</li>
                    <li className='font-bold'>
						<Link href={route('cashflow.student-entry-receivable', page.props.organization.id)}>Piutang Iuran Tahunan Siswa</Link>
					</li>
					<li>Detail Piutang Iuran Tahunan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
