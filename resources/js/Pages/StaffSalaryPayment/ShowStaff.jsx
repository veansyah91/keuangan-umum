import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';

import { IoArrowBackOutline } from 'react-icons/io5';
import formatNumber from '@/Utils/formatNumber';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import dayjs from 'dayjs';

const details = (categories, details, type = 'plus') => {
	return categories.map(category => {
		let findDetail = details.find(detail => detail.category_id === category.id);
		
		return {
			id: category.id,
			name: category.name,
			value: findDetail.value/findDetail.qty,
			unit: category.unit,
			is_cut: category.is_cut ? true : false,
			has_hour: category.has_hour ? true : false,
			qty: findDetail.qty,
			total: findDetail.value
		}
	});
}

export default function ShowStaff({
  organization, role, categories, payment, contact, user
}) {	
  const [waLink] = useState('https://web.whatsapp.com/send');

  const [detailPlus] = useState(details(categories, payment.details).filter(detail => !detail.is_cut));
  const [detailMinus] = useState(details(categories, payment.details).filter(detail => detail.is_cut));  

	const handlePrint = () => {
		window.print();
	};	

	const handleSendWA = () => {
		// cek format contact phone
		let phone = contact.phone;		

		if (phone[0] !== '6' && phone[1] !== '2') {
			phone = '62' + phone;
		}

		let detail = '';

		detailPlus.forEach((d, index) => {
			let unit = d.unit ? `${ d.qty } ${ d.unit } x IDR. ${ formatNumber(d.total/d.qty) } = ` : '';
			detail += `%0A${index+1}. ${d.name} : IDR. ${ unit } ${formatNumber(d.total)}`;
		});

		if (detailMinus.length > 0) {
			detail += '%0A*Potongan*';
			detailMinus.forEach((d, index) => {
				let unit = d.unit ? `${ d.qty } ${ d.unit } x IDR. ${ formatNumber(d.total/d.qty) } = ` : '';
				detail += `%0A${index+1}. ${d.name} : IDR. ${ unit } ${formatNumber(d.total)}`;
			});
		}

		detail += `%0A*Total: ${ formatNumber(payment.details.reduce((acc, detail) => acc + detail.value, 0)) }*`
		
		let message = `*PEMBAYARAN GAJI BULANAN*%0A-------------------------------------------------------%0A*Nama*: ${contact.name}%0A*No. Siswa*: ${contact.staff.no_ref ?? '-'}%0A*Tahun Masuk*: ${contact.staff.entry_year}%0A-------------------------------------------------------%0ATanggal*: ${dayjs(payment.date).locale('id').format('DD MMMM YYYY')}%0A*Bulan*: ${payment.month} (${payment.study_year})%0A*Total*: IDR. ${formatNumber(payment.details.reduce((acc, detail) => acc + detail.value, 0))}%0A%0A*DETAIL:*${detail}%0A%0A%0ATtd,%0A%0A%0A*${organization.name}*`;

		let whatsapp = `${waLink}?phone=${phone}&text=${message}`

		window.open(whatsapp, '_blank');
	}

  return (
    <>
      <Head
				title={`Rincian Gaji Bulanan Staf ${contact.name} (${contact.staff.no_ref ?? '-'})`}
			/>

			<div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-2 sm:pt-0 px-5'>
          {/* Nav Title */}
					<div className='flex sm:flex-row justify-between gap-2 print:hidden'>
						<div className='px-3 my-auto flex gap-3'>
						</div>
						<div className='text-end px-3 hidden sm:block space-x-5'>
							<SecondaryButton onClick={handleSendWA} disabled={!contact.phone}>
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
						<div className='w-1/2 text-2xl my-auto'>Gaji Bulanan</div>
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
									<div className='w-3/4'>: {contact.name}</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>No. Id</div>
									<div className='w-3/4'>: {contact.staff.no_ref ?? '-'}</div>
								</div>
								<div className='flex'>
									<div className='w-1/4'>Jabatan</div>
									<div className='w-3/4'>: {contact.staff.position}</div>
								</div>
                <div className='flex'>
									<div className='w-1/4'>Tahun Masuk</div>
									<div className='w-3/4'>: {contact.staff.entry_year}</div>
								</div>
							</div>

              <div className='w-full space-y-2 mt-2 pt-3 border-t border-slate-900'>
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
							<table className='mt-5 w-full table text-sm'>
								<thead className='text-base text-gray-900'>
									<tr>
										<th className='text-start'>Kategori</th>
										<th className='text-end'>Jam/Hari</th>
										<th className='text-end'>Nilai</th>
										<th className='text-end'>Jumlah</th>
									</tr>
								</thead>
                <tbody>
                  {
                    detailPlus.map(d => <tr key={d.id}>
                      <td className='text-start'>
                        {d.name}
                      </td>
                      <td className='text-end'>
                        {
                          d.unit ? `${d.qty} ${d.unit}` : ''
                        }
                      </td>
                      <td className='text-end'>
                        {
                          `IDR. ${d.qty > 0 ? formatNumber(d.total / d.qty) : 0}`
                        }
                      </td>
                      <td className='text-end'>
                        {
                          `IDR. ${formatNumber(d.total)}`
                        }
                      </td>
                    </tr>)
                  }
									{
										detailMinus.length > 0 && <tr>
											<th className='text-start text-red-500' colSpan={4}>Potongan:</th>
										</tr>
									}
									{
										detailMinus.map(d => <tr key={d.id}>
                      <td className='text-start'>
                        {d.name}
                      </td>
                      <td className='text-end'>
                        {
                          d.unit ? `${d.qty} ${d.unit}` : ''
                        }
                      </td>
                      <td className='text-end'>
                        {
                          `IDR. ${d.qty > 0 ? formatNumber(d.total / d.qty) : 0}`
                        }
                      </td>
                      <td className='text-end'>
                        {
                          `IDR. ${formatNumber(d.total)}`
                        }
                      </td>
                    </tr>)
									}
                </tbody>
                <tfoot className='text-base text-gray-900'>
									<tr>
										<th className='text-start' colSpan={3}>Total</th>
										<th className='text-end'>IDR. { formatNumber(payment.details.reduce((acc, detail) => acc + detail.value, 0)) }</th>
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

ShowStaff.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Rincian Gaji Bulanan Staf</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Rincian Gaji Bulanan Staf'
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
					<li>Rincian Gaji Bulanan Staf</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);
