import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
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

export default function Create() {
  return (
    <div>Create</div>
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
            <Link href={route('add-ons.whatsapp-invoice.create', page.props.organization.id)}>Berlangganan</Link>
          </li>
          <li>Buat</li>
        </ul>
			</div>
		}
	/>
);
