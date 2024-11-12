import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import Container from './Components/Container';
import Card from './Components/Card';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';

export default function Create({
  organization
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product: 'Tahunan',
  });

  const handleSubmit = (value) => {
    setData('product', value);
  };


  return (
    <>
      <Head title='Buat Invoice WhatsApp' />
      <ToastContainer />

			<div className='w-full sm:mt-2'>
				<div className='sm:mx-auto px-3 sm:px-5 py-2 sm:pt-0 space-y-5 md:space-y-0'>
					<div className='sm:pt-0 pb-16 pt-12'>
						<div className='py-2 px-2 sm:pt-0'>
              <Container>

                <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                  <div className='sm:p-6 px-6 py-6 text-gray-800 text-center'>
                    <Header>Pilih Paket Berlangganan</Header>
                  </div>
                </div>

                <div className='bg-white overflow-hidden shadow-sm sm:flex pb-4 px-2 max-w-4xl'>
                  <Card className={`mt-2 sm:mt-0 ${data.product == 'Bulanan' && 'border-[#57987f] border-2'}`}>
                    <Card.CardHeader>Bulanan</Card.CardHeader>
                    <Card.CardContent>
                      {/* price */}
                      <div className='text-4xl'>Rp. 100.000</div>
                      <div className='italic text-sm'>Rp. 3.333 / hari</div>

                      {/* Description */}
                      <div className='mt-3 text-gray-500'>Berakhir Pada </div>
                    </Card.CardContent>
                    <div className='mt-5'>
                      <PrimaryButton onClick={(e) => handleSubmit('Bulanan')}>Pilih</PrimaryButton>
                    </div>
                  </Card>

                  <Card className={`mt-2 sm:mt-0 ${data.product == 'Tahunan' && 'border-[#57987f] border-2'}`}>
                    <Card.CardHeader>
                      Tahunan <BadgeSuccess>Rekomendasi</BadgeSuccess>
                    </Card.CardHeader>
                    <Card.CardContent>
                      {/* price */}
                      <div className='text-4xl'>Rp. 1.000.000</div>
                      <div className='italic text-sm'>Rp. 2.778 / hari</div>

                      {/* Description */}
                      <div className='mt-3 text-gray-500'>
                        <div>Berakhir Pada {organization.expiredAdd12Month}</div>
                      </div>
                    </Card.CardContent>
                    <div className='mt-5'>
                      <PrimaryButton onClick={() => handleSubmit('Tahunan')} type='button'>
                        Pilih
                      </PrimaryButton>
                    </div>
                  </Card>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Create.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Buat Invoice WhatsApp</Header>}
		children={page}
		user={page.props.auth.user}
		role={page.props.role}
		organization={page.props.organization}
		title='WhatsApp'
		backLink={
			<Link href={route('add-ons.whatsapp-invoice', page.props.organization.id)}>
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
          <li className='font-bold'>
            <Link href={route('add-ons.whatsapp-invoice', page.props.organization.id)}>Berlangganan</Link>
          </li>
          <li>Buat</li>
        </ul>
			</div>
		}
	/>
);
