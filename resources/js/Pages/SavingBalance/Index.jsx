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

export default function Index({ organization, role, members, querySearch }) {
  // state
  const { data, setData, post, patch, errors, processing, reset, delete:destroy } = useForm({
    id: null,
    'no_ref': '',
    'contact_id': null,
    'category_id': null
  });

  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Data Simpanan',
    submit: 'Tambah'
  });

  const [search, setSearch] = useState(querySearch || "");


  // function
  const createData = () => {    
    setShowModalInput(true);
    setIsUpdate(false);
    reset();
    setModalInputLabel({
      title: 'Tambah Data Simpanan',
      submit: 'Tambah'
    });
  }

  return (
    <>
      {/* Mobile */}
      <Head title='Data Simpanan' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          members.links[0].url ? (
            <Link
              href={route('cashflow.saving.balance', {
                organization: organization.id,
                page: members.current_page - 1,
                search: search,
              })}
              preserveState
              only={['members']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          members.links[members.links.length - 1].url ? (
            <Link
              href={route('cashflow.saving.balance', {
                organization: organization.id,
                page: members.current_page + 1,
                search: search,
              })}
              only={['members']}
              preserveState>
              <IoPlayForward />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayForward />
            </div>
          )
        }
        page={
          <>
            {members.current_page}/{members.last_page}
          </>
        }
        data={members}
      />

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {role !== 'viewer' && (
              <div className='space-x-2'>
                <PrimaryButton className='py-3' onClick={createData}>Tambah Data</PrimaryButton>
              </div>
            )}
          </div>
          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Data Tabungan'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={members} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {members.links[0].url ? (
                <Link
                  href={route('cashflow.saving.balance', {
                    organization: organization.id,
                    page: members.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['members']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {members.current_page}/{members.last_page}
            </div>
            <div className='my-auto'>
              {members.links[members.links.length - 1].url ? (
                <Link
                  href={route('cashflow.saving.balance', {
                    organization: organization.id,
                    page: members.current_page + 1,
                    search: search,
                  })}
                  only={['members']}
                  preserveState>
                  <IoPlayForward />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayForward />
                </div>
              )}
            </div>
          </div>
        </TitleDesktop>        
      </ContainerDesktop>
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Data Simpanan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Data Simpanan'
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
            <Link href={route('cashflow.saving', page.props.organization.id)}>Simpanan</Link>
          </li>
          <li>Data Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
