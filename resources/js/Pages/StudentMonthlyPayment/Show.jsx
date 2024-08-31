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

export default function Show() {
  return (
    <div>Show</div>
  )
}

Show.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Detail Pembayaran {page.props.contact.name}</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title={`Detail Pembayaran`}
		backLink={
			<Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>
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
						<Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>Pembayaran Iuran Bulanan Siswa</Link>
					</li>
					<li>Detail Pembayaran Iuran Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);

