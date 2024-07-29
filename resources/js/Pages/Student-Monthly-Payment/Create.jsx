import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import FormInput from '@/Components/FormInput';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import studyYear from '@/Utils/studyYear';
import StudentSelectInput from '@/Components/SelectInput/StudentSelectInput';

const yearList = () => {
  const now = dayjs().year();

  const start = now - 10;

  let arrayYear = [];

  for (let index = start; index < now + 1; index++) {
    arrayYear = [
      ...arrayYear, index
    ];
  }
  return arrayYear;
}

const levelArr = () => {
  let levelArr = [];

  for (let index = 1; index < 13; index++) {
    levelArr = [
      ...levelArr, index
    ];
  }

  return levelArr;
}

export default function Create({ organization, categories, contacts }) {
  // state
  const { data, setData, processing, post, errors, setError, reset } = useForm({
    contact_id: '',
    no_ref:'',
    value:0,
    type:'now', // set auto
    month: null,
    year: null,
    study_year:studyYear(),
    description:'',
    details: []
  });

  const [selectedContact, setSelectedContact] = useState({ id: null, name: '', phone: '' });

  // useEffect

  // function
  const handleSubmit = (e) => {
    e.preventDefault();
    
    post(route('cashflow.student-monthly-payment.post', organization.id), {
      onSuccess: () => {
        toast.success(`Siswa Berhasil Ditambahkan`, {
          position: toast.POSITION.TOP_CENTER,
        });
        reset();
      },
      onError: errors => {
        console.log(errors);
      },
      preserveScroll: true,
    });
  };

  const handleSelectedContact = (selected) => {
    console.log(selected);
    setSelectedContact({ id: selected.id, name: selected.name, phone: selected.phone });
    let temp = data;
    temp = {
      ...temp,
      contact_id: selected.id,
      description: `Kas Masuk dari ${selected.name.toUpperCase()}`,
    };
    setData(temp);
  };

  return (
    <>
      <Head title='Tambah Pembayaran' />
      <ToastContainer />

      <FormInput onSubmit={handleSubmit}>
        <div className='w-full sm:mt-2 sm:py-5'>
          <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0'>
            <div className='flex flex-col sm:flex-row justify-between gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel value={'Nama Siswa'} htmlFor='name' className=' mx-auto my-auto' />
              </div>

              <div className='w-full sm:w-2/3'>
                <StudentSelectInput
                    resources={contacts}
                    selected={selectedContact}
                    setSelected={(selected) => handleSelectedContact(selected)}
                    maxHeight='max-h-40'
                    placeholder='Cari Kontak'
                    isError={errors.contact_id ? true : false}
                    id='contact'
                  />
                {errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'No. Siswa'}
                  htmlFor='no_ref'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='no_ref'
                  name='no_ref'
                  className={`w-full ${errors?.no_ref && 'border-red-500'}`}
                  placeholder='No. Siswa'
                  value={data.no_ref}
                  onChange={(e) => setData('no_ref', e.target.value.toUpperCase())}
                  disabled
                />
                {errors?.no_ref && <span className='text-red-500 text-xs'>{errors.no_ref}</span>}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Kelas'}
                  htmlFor='phone'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='phone'
                  name='phone'
                  className={`w-full ${errors?.phone && 'border-red-500'}`}
                  placeholder='Kelas'
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value.toUpperCase())}
                  disabled
                />
                {errors?.phone && <span className='text-red-500 text-xs'>{errors.phone}</span>}
              </div>
            </div>

            <div className='text-center mt-5 font-bold'>Detail Siswa</div>

            <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
              <div className='w-full sm:w-1/6 my-auto text-center'>
                <Link href={route('cashflow.student-monthly-payment', organization.id)}>
                  <SecondaryButton className='w-full'>
                    <div className='text-center w-full'>Kembali</div>
                  </SecondaryButton>
                </Link>
              </div>

              <div className='w-full sm:w-1/6 text-center'>
                <PrimaryButton className='w-full' disabled={processing}>
                  <div className='text-center w-full'>Simpan</div>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </FormInput>
    </>
  );
}

Create.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Tambah Pembayaran</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Tambah Pembayaran'
    backLink={
      <Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>
        <IoArrowBackOutline />
      </Link>
    }
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('data-master', page.props.organization.id)}>Data Master</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>Pembayaran</Link>
          </li>
          <li>Tambah Pembayaran</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
