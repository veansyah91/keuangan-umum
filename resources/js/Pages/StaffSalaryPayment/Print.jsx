import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import InputLabel from '@/Components/InputLabel';
import formatNumber from '@/Utils/formatNumber';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import FormInput from '@/Components/FormInput';
import { FaPrint, FaWhatsapp } from 'react-icons/fa';
import dayjs from 'dayjs';
export default function Print() {
  return (
    <div>Print</div>
  )
}

Print.layout = (page) => (
	<AuthenticatedLayout
		header={<Header>Cetak Pembayaran Gaji Bulanan</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Cetak Pembayaran Gaji Bulanan'
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
					<li>Cetak Pembayaran Gaji Bulanan</li>
				</ul>
			</div>
		}
		role={page.props.role}
	/>
);

