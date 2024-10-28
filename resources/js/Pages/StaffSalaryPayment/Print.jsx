import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import InputLabel from '@/Components/InputLabel';
import formatNumber from '@/Utils/formatNumber';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import FormInput from '@/Components/FormInput';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import dayjs from 'dayjs';

const Category = ({category, index}) => {
	return(
		<div className={`flex space-x-3 text-sm ${ category.category.is_cut ? 'text-red-600' : '' } ${index % 2 === 0 ? 'bg-slate-100' : ''}`} key={category.id}>
			<div className='w-1/12'></div>
			<div className='w-4/12'>{ category.category.name }</div>
			<div className='w-3/12 text-end'>
			{ 
				category.category.has_hour 
				? `IDR. ${ category.qty === 0 ? 0 : formatNumber(category.value / category.qty)} x ${category.qty} ${category.category.unit}`
				: '' 
			}
			</div>
			<div className='w-4/12 text-end'>IDR. { formatNumber(category.value) }</div>
	</div>
	)
}

export default function Print({
	organization, payment, details, user, payments
}) {
	const handlePrint = () => {
		window.print();
	};
	
  return (
    <>
			<Head
				title={`Cetak Pembayaran Gaji Bulan: ${payment.month}, Tahun: ${payment.study_year})`}
			/>

			<div className='sm:pt-0 pb-16 pt-12'>
				<div className='bg-white py-2 sm:pt-0 px-5'>
          {/* Nav Title */}
					<div className='flex sm:flex-row justify-between gap-2 print:hidden'>
						<div className='px-3 my-auto flex gap-3'>
						</div>
						<div className='text-end px-3 hidden sm:block space-x-5'>
							<SecondaryButton onClick={handlePrint}>
								<div className='flex gap-2'>
									<div className='my-auto'>
										<FaPrint />
									</div>
									<div className='my-auto'>Print</div>
								</div>
							</SecondaryButton>
						</div>
						<div className='fixed sm:hidden bottom-2 right-2 space-x-1'>
							<button
								onClick={handlePrint}
								className='bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14'>
								<div className='flex gap-2'>
									<div className='my-auto mx-auto'>
										<FaPrint />
									</div>
								</div>
							</button>
						</div>
					</div>

					{/* Title Print*/}
					<div className='uppercase pt-9 pb-3 hidden print:flex print:justify-between'>
						<div className='w-1/2 text-2xl my-auto'>Rincian Gaji Bulanan</div>
						<div className='w-1/2 text-end mt-auto'>
							<div>{organization.name}</div>
							<div className='text-xs'>{organization.address}</div>
							<div className='text-xs'>
								{organization.village}, {organization.district}, {organization.regency},{' '}
								{organization.province}
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="my-2 space-y-3 mx-3 print:font-['Open_Sans']">
						<div className='sm:w-3/4 print:w-full'>
              <div className='w-full space-y-2 mt-2 pt-3 border-slate-900'>
								<div className='flex'>
									<div className='w-1/4'>Tanggal</div>
									<div className='w-3/4'>: { dayjs(payment.date).locale('id').format('DD MMMM YYYY') }</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>Bulan (Tahun)</div>
									<div className='w-3/4'>: {payment.month} ({ payment.study_year })</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>Total</div>
									<div className='w-3/4'>: IDR. { formatNumber(payment.value) }</div>
								</div>
							</div>

              {/* Data */}
							<div className='mt-5 overflow-x-auto'>
								<div className='md:w-full space-y-5'>
								{
									payments.map((payment, index) => 
										<div key={index}>
											<div className='flex font-bold w-full'>
												<div className='w-1/12'>{ index+1 }</div>
												<div className='w-4/12'>{ payment.name }</div>
												<div className='w-7/12 text-end'>IDR. { formatNumber(payment.value) }</div>
											</div>
											{
												payment.categories.map((category, index) =>
													<Category 
														category={category}
														key={category.id}
														index={index}
													/>
												)
											}
										</div>
									)
								}
								</div>
							</div>

              {/* Footer */}
							<div className='mt-20 w-full hidden justify-end print:flex'>
								<div className=''>
									<div>{ organization.address }, { dayjs().locale('id').format('DD MMMM YYYY') } </div>
									<div className='uppercase font-bold mt-20'>{ user.name }</div>
								</div>
							</div>
            </div>
          </div>
				</div>
			</div>
		</>
  )
}

Print.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Cetak Pembayaran Gaji Bulanan</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Cetak Pembayaran Gaji Bulanan'
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
						<Link href={route('cashflow.staff-salary-payment', page.props.organization.id)}>Gaji Bulanan</Link>
					</li>
					<li className='font-bold'>
						<Link href={route('cashflow.staff-salary-payment.show', { organization: page.props.organization.id, id: page.props.payment.id })}>Rincian Pembayaran Gaji Bulanan</Link>
					</li>
					<li>Cetak Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);

