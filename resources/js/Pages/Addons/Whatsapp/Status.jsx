import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';
import {
	IoAddCircleOutline,
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
	status, handleShowAddDataModal, processing, handleCheckConnection
}) {
	
	return (
		<div className='w-full flex pt-5 gap-2'>
			<div className='md:w-5/12 w-full space-y-3'>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 font-bold'>No. Handphone <span className='md:hidden'>:</span> </div>
					<div className='md:block hidden w-1/12 text-end'>:</div>
					<div className='w-7/12 flex gap-2'>
						<div>{status.phone}</div>
						<div>
							
						</div>						
					</div>
				</div>
				<div className='md:flex gap-2'>
					<div className='md:w-4/12 font-bold'>Token <span className='md:hidden'>:</span> </div>
					<div className='md:block hidden w-1/12 text-end'>:</div>
					<div className='w-7/12 flex gap-2'>
						<div>{status.appKey}</div>
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
					<div className='w-7/12'>{status.expired_date ?? "-"}</div>
				</div>
				<div className='md:flex gap-2 my-auto'>
					<div className='md:w-4/12 font-bold my-auto'>Status <span className='md:hidden'>:</span></div>
					<div className='hidden md:block w-1/12 text-end my-auto'>:</div>
					<div className={`w-7/12 font-bold space-x-5 my-auto flex`}>
						<span className={status.is_active ? 'text-green-500 my-auto' : 'text-red-500 my-auto'}>
							{status.is_active ? 'Aktif' : 'Tidak Aktif' }
						</span>
						{
							status.is_active 
							? "" 
							:<Link href={route('add-ons.whatsapp-invoice.create', {organization: status.organization_id})}>
								<button className='my-auto'>
									<IoAddCircleOutline size={20} /> 
								</button>
							</Link>	
						}			
								
					</div>
				</div>
				{
					status.is_active ? 
					<>
						<div className='md:flex gap-2'>
							<div className='md:w-4/12 w-full font-bold'>Koneksi Terakhir <span className='md:hidden'>:</span></div>
							<div className='md:block hidden w-1/12 text-end'>:</div>
							<div className='w-7/12'>{status.last_connection ?? "-"}</div>
						</div>
						<div className='md:flex gap-2'>
							<div className='md:w-4/12 w-full font-bold'>Koneksi <span className='md:hidden'>:</span></div>
							<div className='hidden md:block md:w-1/12 text-end'>:</div>
							<div className='md:w-7/12 w-full my-auto flex gap-5'>
							{
								status.connection 
								? <div className='my-auto text-green-500 flex gap-2'><div className='my-auto'><FaPowerOff /></div> <div>connected</div></div>  
								: <div className='my-auto text-red-500 flex gap-2'><div className='my-auto'><FaPowerOff /></div> <div>disconnected</div></div> 
							}
							<div className='w-full'>
								<button className='border py-1 px-2 rounded-md' onClick={handleCheckConnection} disabled={processing}>
									{
										processing 
										?<span className="loading loading-dots loading-xs"></span>
										:<span>Cek Koneksi</span>
									}							
									</button>
							</div>
							</div>
						</div>
					</> : ""
				}
			</div>
		</div>
	)
}

export default function Setting({
	status, organization
}) {
	const { data, setData, patch, processing, errors } = useForm({
		'appKey' : status ? status.appKey : '',
		'phone' : status ? status.phone : '',
	});	

	const [showAddData, setShowAddData] = useState(false);

	const handleSetShowAddData = () => {
		setShowAddData(true);
	}

	const handleChangeValue = (values) => {
		setData('phone', values.value);
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

	const handleCheckConnection = () => {
		patch(route('add-ons.whatsapp.status.check-connection', {organization: organization.id}), {
			onSuccess: ({ props }) => {
				const { flash } = props;

        flash?.success && toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
			},
			onError: errors => {
				errors?.error && toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
			}
		})
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
							
							{/* jika sudah ada status */}
							{
								status
								&& <WithData
									status={status}
									handleShowAddDataModal={() => setShowAddData(true)}
									processing={processing}
									handleCheckConnection={handleCheckConnection}
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
											<td>Whatsapp Broadcasting Plugin dari keuanganumum.com menggunakan <a href="https://fonnte.com/" className='text-blue-600 font-bold hover:underline' target="_blank" rel="noopener noreferrer">Fonnte</a> sebagai Whatsapp API Gateway, silakan registrasi dan berlangganan sesuai dengan kebutuhan Anda</td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Whatsapp Broadcasting Plugin dari keuanganumum.com mengirimkan pesan secara <span className='italic'>asynchronous</span> untuk menghindari blokir dari WhatsApp</td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Daftarkan nomor handphone yang sudah dipakai lama, hindari penggunakan nomor handphone yang baru diregistrasi</td>
										</tr>
										<tr>
											<td className='w-[25px]'>•</td>
											<td>Kami menyarankan menautkan nomor handphone yang telah diregistrasikan pada WhatsApp Business</td>
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
							status ? 'Ubah Token' : 'Tautkan WhatsApp'
						}
					</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel value={'No. Handphone'} htmlFor='phone' />
							</div>
							<div className='w-full sm:w-2/3'>
								<NumericFormat
									value={data.phone || ''}
									customInput={TextInput}
									onValueChange={(values) => handleChangeValue(values)}
									thousandSeparator={false}
									className={`w-full ${errors?.appKey && 'border-red-500'}`}
									prefix={''}
									placeholder='628xxxx'
								/>
							</div>
						</div>
					</div>
					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
							<div className='w-full sm:w-1/3 my-auto'>
								<InputLabel value={'Token'} htmlFor='token' />
							</div>
							<div className='w-full sm:w-2/3'>
								<TextInput
									id='token'
									name='Token'
									className={`w-full ${errors?.appKey && 'border-red-500'}`}
									placeholder='Token'
									value={data.appKey || ''}
									onChange={(e) => setData('appKey', e.target.value)}
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