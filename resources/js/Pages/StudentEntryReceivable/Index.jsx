import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import StudentEntryReceivableMobile from './Components/StudentEntryReceivableMobile';
import StudentEntryReceivableDesktop from './Components/StudentEntryReceivableDesktop';

export default function Index({ organization, role, receivables, searchFilter, type }) {
	const [search, setSearch] = useState(searchFilter || '');
	const [showModalFilter, setShowModalFilter] = useState(false);

	const [dataFilter, setDataFilter] = useState({
		type: type, // all, paid, unpaid
	});

	const handleFilter = (e) => {
		e.preventDefault();
		
		handleReloadPage();
		setShowModalFilter(false);
	};

	const handleReloadPage = () => {		
		router.reload({
			only: ['receivables'],
			data: {
				type: dataFilter.type
			},
		})
	}

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
							href={route('cashflow.student-entry-receivable', {
								organization: organization.id,
								page: receivables.current_page - 1,
								search: search,
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
							href={route('cashflow.student-entry-receivable', {
								organization: organization.id,
								page: receivables.current_page + 1,
								search: search,
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
				hasFilter={true}
				showFilter={() => setShowModalFilter(true)}
			/>
			<ContentMobile>
				{receivables.data.map((receivable) => (
					<StudentEntryReceivableMobile
						receivable={receivable}
						key={receivable.id}
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
								
							</div>
						)}
					</div>	
					<div className='my-auto w-4/12 flex gap-5 justify-end'>
						<button className='py-3 px-3 border rounded-lg h-full' onClick={() => setShowModalFilter(true)}>
								<IoFilter />
						</button>
						
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
						<PageNumber data={receivables} />
					</div>
					<div className='my-auto flex space-x-2 w-1/12'>
						<div className='my-auto'>
							{receivables.links[0].url ? (
								<Link
									href={route('cashflow.student-entry-receivable', {
										organization: organization.id,
										page: receivables.current_page - 1,
										search: search,
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
									href={route('cashflow.student-entry-receivable', {
										organization: organization.id,
										page: receivables.current_page + 1,
										search: search,
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
										<th className='bg-gray-200'>Siswa</th>
										<th className='bg-gray-200'>Kelas</th>
										<th className='bg-gray-200 text-end'>Jumlah</th>
										<th className='bg-gray-200'></th>
									</tr>
								</thead>
								<tbody>
									{receivables.data.map((receivable, index) => (
										<StudentEntryReceivableDesktop
											key={index}
											receivable={receivable}
											className={`${index % 2 == 0 && 'bg-gray-100'} text-sm`}
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
					<h2 className='text-lg font-medium text-gray-900'>Filter Piutang Iuran Bulanan</h2>

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
                    <option value={'paid'}>Lunas</option>
                    <option value={'unpaid'}>Belum Lunas</option>
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
			{/* Modal */}
		</>
  )
}

Index.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Piutang Iuran Tahunan Siswa</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Piutang Iuran Tahunan Siswa'
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
					<li>Piutang Iuran Tahunan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
