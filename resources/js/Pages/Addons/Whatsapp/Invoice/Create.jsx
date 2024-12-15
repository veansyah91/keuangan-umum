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
import BadgeGray from '@/Components/Badges/BadgeGray';
import SuccessButton from '@/Components/SuccessButton';
import dayjs from 'dayjs';

export default function Create({
  organization, expiredDate
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    product: 'Tahunan',
  });

  console.log(expiredDate);


  const handleSelectProduct = (value) => {
    setData('product', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('add-ons.whatsapp-invoice.store', organization.id), {
      onSuccess: ({ props }) => {
        console.log(props); 
      }
    })
  }

  return (
    <>
      <Head title='Buat Invoice WhatsApp' />
      <ToastContainer />

			<div className='w-full sm:mt-2'>
				<div className='sm:mx-auto px-3 sm:px-5 py-2 sm:pt-0 space-y-5 md:space-y-0'>
					<div className='sm:pt-0 pb-16 pt-12'>
						<div className='py-2 px-2 sm:pt-0'>
              <Container>
                <form onSubmit={handleSubmit}>
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
                      <div className='text-2xl line-through mb-5'>
                       <div>Rp. 250.000 </div>
                       <div><BadgeGray>Disc 54%</BadgeGray></div> 
                      </div>
                      <div className='text-4xl'>Rp. 115.000</div>
                      <div className='italic text-sm'>Rp. 3.833 / hari</div>

                      {/* Description */}
                      <div className='mt-3 text-gray-500'>Berakhir Pada { dayjs(expiredDate.bulanan).locale('id').format('DD MMMM YYYY') }</div>
                    </Card.CardContent>
                    <div className='mt-5'>
                      <PrimaryButton onClick={(e) => handleSelectProduct('Bulanan')} type='button'>Pilih</PrimaryButton>
                    </div>
                  </Card>

                  <Card className={`mt-2 sm:mt-0 ${data.product == 'Tahunan' && 'border-[#57987f] border-2'}`}>
                    <Card.CardHeader>
                      Tahunan <BadgeSuccess>Rekomendasi</BadgeSuccess>
                    </Card.CardHeader>
                    <Card.CardContent>
                      {/* price */}
                      <div className='text-2xl line-through mb-5'>
                       <div>Rp. 2.500.000 </div>
                       <div><BadgeGray>Disc 60%</BadgeGray></div> 
                      </div>
                      <div className='text-4xl'>Rp. 1.000.000</div>
                      <div className='italic text-sm'>Rp. 2.778 / hari</div>

                      {/* Description */}
                      <div className='mt-3 text-gray-500'>
                        <div>Berakhir Pada { dayjs(expiredDate.tahunan).locale('id').format('DD MMMM YYYY') }</div>
                      </div>
                    </Card.CardContent>
                    <div className='mt-5'>
                      <PrimaryButton onClick={() => handleSelectProduct('Tahunan')} type='button'>
                        Pilih
                      </PrimaryButton>
                    </div>
                  </Card>
                </div>

                <div className='bg-white rounded-b-lg p-4 flex'>
                    <div className='w-1/2'>
                    </div>
                    <div className='w-1/2 text-end'>
                        <SuccessButton type={"submit"} disabled={processing}>Buat Pesanan</SuccessButton>
                    </div>
                </div>
                </form>
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
            <Link href={route('add-ons.whatsapp-invoice', page.props.organization.id)}>Data Invoice</Link>
          </li>
          <li>Buat</li>
        </ul>
			</div>
		}
	/>
);
