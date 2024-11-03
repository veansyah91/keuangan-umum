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

export default function Setting() {
  return (
    <>
			<Head title='Status WhatsApp Broadcast' />
			<ToastContainer />

			<div className='w-full sm:mt-2'>
				<div className='sm:mx-auto px-3 sm:px-5 bg-white py-2 sm:pt-0 space-y-5 md:space-y-0'>
					<div className='sm:pt-0 pb-16 pt-12'>
						<div className='bg-white py-2 px-2 sm:pt-0'>

						</div>
					</div>
				</div>
			</div>
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