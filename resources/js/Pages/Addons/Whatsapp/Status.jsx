import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    IoArrowBackOutline,
} from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { NumericFormat } from 'react-number-format';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { FaPowerOff } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa/index.esm';

function NoData ({
	setShowAddData
}) {
	return(
		<div className='mx-auto text-center py-5 space-y-3'>
			<div>
				Belum tertaut dengan WhatsApp
			</div>
			<button className='my-auto mx-auto bg-green-700 text-xl py-3 px-2 rounded-lg text-white font-bold' onClick={setShowAddData}>
				Tautkan WhatsApp
			</button>
		</div>
	)
}

function WithData({
	data, handleShowAddDataModal
}) {
	// const [data, processing] = useForm({
	// 	id: null
	// })
	return (
		<div className='w-full flex pt-5 gap-2'>
			<div className='md:w-5/12 w-full space-y-3'>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 font-bold'>No. Handphone <span className='md:hidden'>:</span> </div>
					<div className='md:block hidden w-1/12 text-end'>:</div>
					<div className='w-7/12 flex gap-2'>
						<div>{data.phone}</div>
						<div>
							<button
								className='text-gray-500 text-sm'
								onClick={handleShowAddDataModal}
							>
								<FaRegEdit />
							</button>
						</div>						
					</div>
				</div>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 w-full font-bold'>Tanggal Kadaluarsa <span className='md:hidden'>:</span></div>
					<div className='md:block hidden w-1/12 text-end'>:</div>
					<div className='w-7/12'>{data.expired_date ?? "-"}</div>
				</div>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 font-bold'>Status <span className='md:hidden'>:</span></div>
					<div className='hidden md:block w-1/12 text-end'>:</div>
					<div className={`w-7/12 font-bold space-x-5`}><span className={data.is_active ? 'text-green-500' : 'text-red-500'}>{data.is_active ? 'Aktif' : 'Tidak Aktif' }</span> <button className='border py-1 px-2 rounded-md'>Cek Koneksi</button></div>
				</div>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 font-bold'>Koneksi <span className='md:hidden'>:</span></div>
					<div className='hidden md:block w-1/12 text-end'>:</div>
					<div className='w-7/12 my-auto'>
					{
						data.connection 
						? <div className='my-auto text-green-500 flex gap-2'><div className='my-auto'><FaPowerOff /></div> <div>connected</div></div>  
						: <div className='my-auto text-red-500 flex gap-2'><div className='my-auto'><FaPowerOff /></div> <div>disconnected</div></div> 
					}
					</div>
				</div>
			</div>
		</div>
	)
}

export default function Setting({
	status, organization
}) {

	const admin = "6287839542505";
  const waLink = 'https://web.whatsapp.com/send';

	const { data, setData, patch, processing } = useForm({
		'phone' : status ? status.phone : ''
	})

	const [showAddData, setShowAddData] = useState(false);

	const handleChangeValue = (values) => {
		setData('phone', values.value)
	}

	const handleSetShowAddData = () => {
		setShowAddData(true);
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();

		patch(route('add-ons.whatsapp.status.update', {organization: organization.id}), {
			onSuccess: ({ props }) => {
				const { flash } = props;

				toast.success(flash.success, {
					position: toast.POSITION.TOP_CENTER,
				});
				
				setShowAddData(false);
			},
			onError: errors => {
				toast.error(errors.phone, {
					position: toast.POSITION.TOP_CENTER,
				});
			}
		})
	}

	const handleChangeNumber = () => {
		let message = `
			*KONFIRMASI PERUBAHAN NOMOR HANDPHONE*
			 %0A-------------------------------------------------------%0A
			 _*Detail Organisasi*_
			 %0AID : ${organization.id}
			 %0ANama : ${organization.name}
			 %0ANo. HP : ${data.phone}
		`;

		let whatsapp = `${waLink}?phone=${admin}&text=${message}`;

		window.open(whatsapp, '_blank');		
	}

	const handleConnectionProblem = () => {
		let message = `
			*KONEKSI TERPUTUS*
			 %0A-------------------------------------------------------%0A
			 _*Detail Organisasi*_
			 %0AID : ${organization.id}
			 %0ANama : ${organization.name}
			 %0ANo. HP : ${data.phone}
		`;

		let whatsapp = `${waLink}?phone=${admin}&text=${message}`;

		window.open(whatsapp, '_blank');		
	}

  return (
    <>
			<Head title='Status WhatsApp Broadcast' />
			<ToastContainer />

			<div className='w-full sm:mt-2'>
				<div className='sm:mx-auto px-3 sm:px-5 bg-white py-2 sm:pt-0 space-y-5 md:space-y-0'>
					<div className='sm:pt-0 pb-16 pt-12'>
						<div className='bg-white py-2 px-2 sm:pt-0'>
							{/* cek apakah data sudah ada */}
							{/* jika tidak ada status */}
							{
								!status 
								&& <NoData 
									setShowAddData={handleSetShowAddData}
								/>
							}
							
							{/* jika sudaj ada status */}
							{
								status
								&& <WithData
									data={status}
									handleShowAddDataModal={() => setShowAddData(true)}
								/>
							}								
						</div>
						<div className='bg-white py-2 px-2 sm:pt-0 mt-10'>
							<h2 className='font-bold underline'>Disclaimer</h2>				
							<div>
								<table>
									<tbody>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Whatsapp Broadcasting Plugin dari keuanganumum.com adalah unofficial atau tidak terafiliasi dengan WhatsApp</td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Whatsapp Broadcasting Plugin dari keuanganumum.com mengirimkan pesan secara <span className='italic'>asynchronous</span> untuk menghindari blokir dari WhatsApp</td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Apabila terjadi perubahan nomor handphone, hubungi <button onClick={handleChangeNumber} className='text-green-600 font-bold'>Admin 0878396542505</button></td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Apabila koneksi terputus, hubungi <button onClick={handleConnectionProblem} className='text-green-600 font-bold'>Admin 0878396542505</button></td>
										</tr>
									</tbody>
								</table>
							</div>			
						</div>
					</div>
				</div>
			</div>

			{/* Update Phone */}
			<Modal show={showAddData} onClose={() => setShowAddData(false)}>
				<form onSubmit={handleSubmit} className='p-6' id='deleteForm' name='deleteForm'>
					<h2 className='text-lg font-medium text-gray-900 text-center'>
						{
							status ? 'Ubah No HP Tautan WhatsApp' : 'Tautkan WhatsApp'
						}
					</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel value={'No. Handphone'} htmlFor='phone' />
							</div>
							<div className='w-full sm:w-2/3'>
								<NumericFormat
									value={data.phone}
									customInput={TextInput}
									onValueChange={(values) => handleChangeValue(values)}
									thousandSeparator={false}
									className='text-start w-full border'
									placeholder='628xxx'
									prefix={''}
								/>
							</div>
						</div>
					</div>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={() => setShowAddData(false)}>Batal</SecondaryButton>

						<PrimaryButton className='ms-3' disabled={processing}>
							{ status ? 'Ubah' : 'Tautkan' }
						</PrimaryButton>
					</div>
				</form>
			</Modal>
    </>
  )
}

Setting.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Status</Header>}
      children={page}
      user={page.props.auth.user}
      organization={page.props.organization}
      title='Status'
      backLink={
          <Link href={route('add-ons.whatsapp', page.props.organization.id)}>
              <IoArrowBackOutline />
          </Link>
      }
      breadcrumbs={
          <div className='text-sm breadcrumbs'>
              <ul>
                  <li className='font-bold'>
                      <Link href={route('add-ons', page.props.organization.id)}>Add-ons</Link>
                  </li>
                  <li className='font-bold'>
                      <Link href={route('add-ons.whatsapp', page.props.organization.id)}>WhatsApp Broadcast</Link>
                  </li>
                  <li>Status</li>
              </ul>
          </div>
      }
      role={page.props.role}
  />
);