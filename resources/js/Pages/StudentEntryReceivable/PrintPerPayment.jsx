import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import SecondaryButton from '@/Components/SecondaryButton';
import formatNumber from '@/Utils/formatNumber';
import { toast, ToastContainer } from 'react-toastify';

export default function PrintPerPayment({ organization, payment, ledgers, contact, user }) {	
  console.log(payment);
	
	const [waLink] = useState('https://web.whatsapp.com/send');

	const handlePrint = () => {
		window.print();
	};	

	const handleSendWA = () => {
		// cek format contact phone
		let phone = contact.phone;		

		if (!phone) {
			toast.error(`No Handphone ${contact.name} tidak ditemukan`, {
				position: toast.POSITION.TOP_CENTER,
			});
			return
		}

		if (phone[0] !== '6' && phone[1] !== '2') {
			phone = "62" + phone.slice(1);
		}

		let detail = '';

		ledgers.forEach(r => {
			detail += `%0ANo Ref: ${r.no_ref}%0ATahun Ajaran: ${r.study_year}%0AJumlah: IDR ${formatNumber(r.receivable_value)}%0A`;
		});

		detail += `%0A*Total: ${ formatNumber(contact.student_entry_receivable.value) }*`
		
		let message = `*TAGIHAN IURAN Tahunan*%0A-------------------------------------------------------%0A*Nama*: ${contact.name}%0A*No. Siswa*: ${contact.student.no_ref ?? '-'}%0A*Tahun Masuk*: ${contact.student.entry_year}%0A*Kelas Sekarang*: ${contact.last_level.level}%0A${detail}%0A%0A%0ATtd,%0A%0A%0A*${organization.name}*`;

		let whatsapp = `${waLink}?phone=${phone}&text=${message}`

		window.open(whatsapp, '_blank');
	}
	
  return (
    <>
			<Head
				title={`Tagihan Iuran Tahunan ${contact.name} (${contact.student.no_ref})`}
			/>

			<ToastContainer />

			<div className='sm:pt-0 pb-16 pt-12'>
				<div className='bg-white py-2 sm:pt-0 px-5'>
					{/* Nav Title */}
					<div className='flex sm:flex-row justify-between gap-2 print:hidden'>
						<div className='px-3 my-auto flex gap-3'>
						</div>
						<div className='text-end px-3 hidden sm:block space-x-5'>
							<SecondaryButton onClick={handleSendWA}>
								<div className='flex gap-2'>
									<div className='my-auto'>
										<FaWhatsapp/>
									</div>
									<div className='my-auto'>Kirim WA</div>
								</div>
							</SecondaryButton>
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
								onClick={handleSendWA}
								className='bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14'>
								<div className='flex gap-2'>
									<div className='my-auto mx-auto'>
										<FaWhatsapp/>
									</div>
								</div>
							</button>
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
					<div className='uppercase pt-9 pb-3 border-b hidden print:flex print:justify-between'>
						<div className='w-1/2 text-2xl my-auto'>Tagihan Iuran Tahunan</div>
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
					<div className="my-2 space-y-3 mx-3 print:font-['Open_Sans'] overflow-auto">
						<div className='sm:w-3/4 w-[550px] print:w-full'>
							<div className='flex justify-between'>
								{/* Identity */}
								<div className='w-full space-y-2'>
									<div className='flex'>
										<div className='w-1/4'>Nama</div>
										<div className='w-3/4'>: {contact.name}</div>
									</div>
									<div className='flex'>
										<div className='w-1/4'>No. Siswa</div>
										<div className='w-3/4'>: {contact.student.no_ref ?? '-'}</div>
									</div>
									<div className='flex'>
										<div className='w-1/4'>Kelas Sekarang</div>
										<div className='w-3/4'>: {contact.last_level.level}</div>
									</div>
								</div>

								{/* Identity */}
								<div className='w-full space-y-2'>
									<div className='flex'>
										<div className='w-1/4'>Nama</div>
										<div className='w-3/4'>: {contact.name}</div>
									</div>
									<div className='flex'>
										<div className='w-1/4'>No. Siswa</div>
										<div className='w-3/4'>: {contact.student.no_ref ?? '-'}</div>
									</div>
									<div className='flex'>
										<div className='w-1/4'>Kelas Sekarang</div>
										<div className='w-3/4'>: {contact.last_level.level}</div>
									</div>
								</div>
							</div>

							{/* Data */}
							<table className='mt-10 w-full table text-base'>
								<thead className='text-base text-gray-900'>
									<tr>
										<th className='text-start'>Tanggal</th>
										<th className='text-start'>No Ref</th>
										<th className='text-end'>Jumlah</th>
									</tr>
								</thead>
								<tbody>
									{
										ledgers.map(receivable => 
											<tr key={receivable.id}>
												<td>{dayjs(receivable.date).locale('id').format('MMMM DD, YYYY')}</td>
												<td>{receivable.no_ref}</td>
												<td className='text-end'>IDR. { formatNumber(receivable.credit) }</td>
											</tr>
										)
									}
								</tbody>
								<tfoot className='text-base text-gray-900'>
									<tr>
										<th className='text-start' colSpan={2}>Total</th>
										<th className='text-end'>IDR. { formatNumber(ledgers.reduce((accumulator, currentObject) => {
																							return accumulator + currentObject.credit;
																						}, 0)) }
										</th>
									</tr>
								</tfoot>
							</table>

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

PrintPerPayment.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Print Piutang {page.props.contact.name}</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title={`Print Piutang`}
		backLink={
			<Link href={route('cashflow.student-entry-receivable.show', {organization: page.props.organization.id, studentEntryReceivable: page.props.contact.student_entry_receivable.id})}>
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
						<Link href={route('cashflow.student-monthly-receivable', page.props.organization.id)}>Piutang Iuran Tahunan Siswa</Link>
					</li>
          <li className='font-bold'>
						<Link href={route('cashflow.student-entry-receivable.show', {organization: page.props.organization.id, studentEntryReceivable: page.props.contact.student_entry_receivable.id})}>Detail Piutang Iuran Tahunan Siswa</Link>
					</li>
          
					<li>Print Piutang Iuran Tahunan Siswa</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
