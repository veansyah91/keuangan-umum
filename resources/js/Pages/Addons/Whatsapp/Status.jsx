import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import {
    IoArrowBackOutline,
    IoFilter,
    IoPlayBack,
    IoPlayForward,
    IoSearchSharp,
    IoTrashOutline,
} from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { data } from 'autoprefixer';
import { NumericFormat } from 'react-number-format';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

function NoData () {
	return(
		<>

		</>
	)
}

export default function Setting({
	status, organization
}) {

	const { data, setData, patch, processing } = useForm({
		'phone' : ''
	})

	const [showAddData, setShowAddData] = useState(false);

	const handleChangeValue = (values) => {

	}
	
	const handleSubmit = (e) => {
		e.preventDefault();

		patch(route('add-ons.whatsapp.status.update', {organization: organization.id}), {
			onSuccess: (props) => {
				
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
							<div className='mx-auto text-center py-5 space-y-3'>
								<div>
									Belum tertaut dengan WhatsApp
								</div>
								<button className='my-auto mx-auto bg-green-700 text-xl py-3 px-2 rounded-lg text-white font-bold' onClick={() => setShowAddData(true)}>
									Tautkan WhatsApp
								</button>
							</div>
							
						</div>
					</div>
				</div>
			</div>

			{/* Update Phone */}
			<Modal show={showAddData} onClose={() => setShowAddData(false)}>
				<form onSubmit={handleSubmit} className='p-6' id='deleteForm' name='deleteForm'>
					<h2 className='text-lg font-medium text-gray-900 text-center'>Tautkan WhatsApp</h2>

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
								Tautkan
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