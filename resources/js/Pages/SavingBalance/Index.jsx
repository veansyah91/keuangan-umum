import React, { useState } from 'react';
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
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import SavingBalanceMobile from './Components/SavingBalanceMobile';
import SavingBalanceDesktop from './Components/SavingBalanceDesktop';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import DangerButton from '@/Components/DangerButton';

export default function Index({ organization, role, members }) {
  // state
  const { data, setData, post, patch, errors, processing, reset, delete:destroy } = useForm({
    id: null,
    'contact_id' : '',
    'category_id': null,
    'no_ref': true
  });

  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Data Tabungan',
    submit: 'Tambah'
  });

  // function
  const createData = () => {    
    setShowModalInput(true);
    setIsUpdate(false);
    reset();
    setModalInputLabel({
      title: 'Tambah Data Tabungan',
      submit: 'Tambah'
    });
  }

  return (
    <>
      {/* Mobile */}
      <Head title='Data Tabungan' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Data Tabungan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Data Tabungan'
    backLink={
      <Link href={route('cashflow.saving', page.props.organization.id)}>
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
          <li>Data Tabungan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
