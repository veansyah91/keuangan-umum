import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm, } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import SecondaryButton from '@/Components/SecondaryButton';
import formatNumber from '@/Utils/formatNumber';
import { toast, ToastContainer } from 'react-toastify';

export default function Show({ organization, ledger, user, whatsappPlugin, balance }) {
	console.log(balance);
				
  const { data, post, processing } = useForm({
		contact_id:balance.contact_id,
		contact_phone:balance.contact.phone,
		contact_name:balance.contact.name,
		contact_ref:balance.no_ref,
    date:ledger.date,
    no_ref:ledger.no_ref,
    value:ledger.debit > 0 ? ledger.debit : ledger.credit,
    send_wa:whatsappPlugin,
	});

	const [waLink] = useState('https://web.whatsapp.com/send');

	const handlePrint = () => {
		window.print();
	};	

	const handleSendWA = () => {
		// if (whatsappPlugin) {			
		// 	post(route('cashflow.student-entry-ledger.send-whatsapp', {organization: organization.id, ledger: ledger.id}), {
		// 		onSuccess: ({ props }) => {
		// 			const { flash } = props;
	
		// 			toast.success(flash.success, {
		// 				position: toast.POSITION.TOP_CENTER,
		// 			});	
		// 		},
		// 	})
		// 	return;
		// }

		console.log(data);

		// return;

		// cek format contact phone
		let phone = balance.contact.phone;		    

		if (!phone) {
			toast.error(`No Handphone ${balance.contact.name} tidak ditemukan`, {
				position: toast.POSITION.TOP_CENTER,
			});
			return
		}

		if (phone[0] !== '6' && phone[1] !== '2') {
			phone = "62" + phone.slice(1);
		}
		
		let message = `*BUKTI ${ ledger.debit > 0 ? "PENARIKAN" : "SETORAN" } TABUNGAN*%0A-------------------------------------------------------%0A*Nama*: ${data.contact_name}%0A*ID Simpanan*: ${data.contact_ref}%0A-------------------------------------------------------%0A*No Ref Transaksi*: ${ledger.no_ref}%0A*Tanggal*: ${dayjs(ledger.date).locale('id').format('DD MMMM YYYY')}%0A*Jumlah*: IDR. ${ledger.debit > 0 ? formatNumber(ledger.debit) : formatNumber(ledger.credit)}%0A%0A%0ATtd,%0A%0A%0A*${organization.name}*`;
		
		let whatsapp = `${waLink}?phone=${phone}&text=${message}`

		window.open(whatsapp, '_blank');
	}
  return (
    <>
			<Head
				title={`${(ledger.debit > 0 ? "PENARIKAN" : "SETORAN")} UANG TABUNGAN ${data.contact_name} (${balance.no_ref})`}
			/>

			<ToastContainer />			

			<div className='sm:pt-0 pb-16 pt-12'>
				<div className='bg-white py-2 sm:pt-0 px-5'>
					{/* Nav Title */}
					<div className='flex sm:flex-row justify-between gap-2 print:hidden'>
						<div className='px-3 my-auto flex gap-3'>
						</div>
						<div className='text-end px-3 hidden sm:block space-x-5'>
							{
								balance.contact.phone &&
									<SecondaryButton onClick={handleSendWA} disabled={processing}>
										<div className='flex gap-2'>
											<div className='my-auto'>
												<FaWhatsapp/>
											</div>
											<div className='my-auto'>Kirim WA</div>
										</div>
									</SecondaryButton>
							}
							
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
						<div className='w-1/2 text-xl my-auto'>{`${(ledger.debit > 0 ? "PENARIKAN" : "SETORAN")} UANG TABUNGAN`}</div>
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
							{/* Identity */}
							<div className='w-full space-y-2'>
								<div className='flex'>
									<div className='w-1/4'>Nama</div>
									<div className='w-3/4'>: {balance.contact.name} ({balance.contact.contact_categories[0].name})</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>ID Simpanan</div>
									<div className='w-3/4'>: {balance.no_ref ?? '-'}</div>
								</div>
							</div>

							<div className='w-full space-y-2 mt-2 pt-3 border-t border-slate-900'>
								<div className='flex'>
									<div className='w-1/4'>No Ref Transaksi</div>
									<div className='w-3/4'>: {ledger.no_ref}</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>Tanggal</div>
									<div className='w-3/4'>: { dayjs(ledger.date).locale('id').format('DD MMMM YYYY') }</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>Total</div>
									<div 
										className={`w-3/4 font-bold ${ledger.debit > 0 ? "text-red-600" : "text-green-600"}`}
									>: IDR. { formatNumber((ledger.debit > 0 ? ledger.debit : ledger.credit)) } ({ (ledger.debit > 0 ? "D" : "C") })</div>
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

			<ToastContainer />
		</>
  )
}

Show.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Detail {page.props.ledger.debit > 0 ? "Penarikan" : "Setoran"} Simpanan</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title={`Detail Simpanan`}
		backLink={
			<Link href={route('cashflow.saving.ledger', {organization: page.props.organization.id})}>
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
						<Link href={route('cashflow.saving', page.props.organization.id)}>Simpanan</Link>
					</li>
					<li className='font-bold'>
						<Link href={route('cashflow.saving.ledger', page.props.organization.id)}>Tambah/Tarik Simpanan</Link>
					</li>
					<li>Detail/Print Simpanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);

