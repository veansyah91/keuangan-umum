import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import FormInput from '@/Components/FormInput';
import Datepicker from 'react-tailwindcss-datepicker';
import dayjs from 'dayjs';

export default function Create({ date, newRef }) {  
  // state
  const { data, setData, errors, post } = useForm({
    date: date,
    no_ref: newRef,
    description: 'Tambah Tabungan',
    value: 0,
    accountCash: null,
    accountCredit: null,
  });

  const [dateValue, setDateValue] = useState({
    startDate: date,
    endDate: date,
  });

  const [debounceDateValue] = useDebounce(dateValue, 500);
  
  const prevDate = usePrevious(dateValue);

  // function
  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
    setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <Head title='Buat Tambah Simpanan' />
      <ToastContainer />

      <FormInput onSubmit={handleSubmit}>
        <div className='w-full sm:mt-2 sm:py-5'>
          <div className='sm:mx-auto px-3 sm:px-5'>
            <div className='flex flex-col sm:flex-row justify-between gap-3'>
              <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                <div>
                  <InputLabel value={'Tanggal'} />
                </div>
                <div>
                  <Datepicker
                    value={dateValue}
                    onChange={handleDateValueChange}
                    inputClassName={errors?.date && 'border-red-500 rounded-lg'}
                    useRange={false}
                    asSingle={true}
                    placeholder='Tanggal'
                    id='date'
                    displayFormat='MMMM DD, YYYY'
                  />
                </div>
              </div>
              <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                <div>
                  <InputLabel value={'No. Ref'} htmlFor='no_ref' />
                </div>
                <div>
                  <TextInput
                    id='no_ref'
                    className={`w-full ${errors.no_ref && 'border-red-500'}`}
                    value={data.no_ref}
                    onChange={(e) => setData('no_ref', e.target.value)}
                  />
                </div>
              </div>
              <div className='sm:w-1/2 w-full text-slate-900 space-y-2'>
                <div>
                <InputLabel value={'Deskripsi'} htmlFor='description' />
              </div>
              <div>
                  <TextInput
                    id='description'
                    className='w-full'
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-3'>
              
            </div>
          </div>
        </div>
      </FormInput>
      
    </>
  )
}

Create.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Buat Tambah Simpanan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Buat Tambah Simpanan'
    backLink={
      <Link href={route('cashflow.saving.credit', page.props.organization.id)}>
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
            <Link href={route('cashflow.saving', page.props.organization.id)}>Tabungan</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('cashflow.saving.credit', page.props.organization.id)}>Tambah Tabungan</Link>
          </li>
          <li>Buat Tambah Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
