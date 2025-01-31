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
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import SavingLedgerMobile from './Components/SavingLedgerMobile';
import SavingLedgerDesktop from './Components/SavingLedgerDesktop';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import DangerButton from '@/Components/DangerButton';
import ContactSelectInput from '@/Components/SelectInput/ContactSelectInput';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

export default function Index({ ledgers, organization, role, newRefCredit, newRefDebit, querySearch }) {
  console.log(newRefCredit);
  
  // state
  const { data, setData, post, patch, errors, processing, reset, delete:destroy } = useForm({
    'id': null,
    'value': '',
    'contact_id': null,
    'saving_category_id': null
  });
  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Data Simpanan',
    submit: 'Tambah'
  });
  const [showModalInput, setShowModalInput] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [search, setSearch] = useState(querySearch || "");
  

  // function
  const setDefault = () => {

  }

  const createCreditData = () => {    
    setShowModalInput(true);
    setIsUpdate(false);
    setDefault();
    setModalInputLabel({
      title: 'Tambah Data Simpanan',
      submit: 'Tambah'
    });
  }

  const createDebitData = () => {    
    setShowModalInput(true);
    setIsUpdate(false);
    setDefault();
    setModalInputLabel({
      title: 'Tambah Data Simpanan',
      submit: 'Tambah'
    });
  }

  
  return (
    <>
      <Head title='Tambah/Ambil Simpanan' />
      <ToastContainer />
      {
        role !== 'viewer' && (
          <div className='md:hidden fixed bottom-2 w-full z-40 flex'>
            <div className='px-2'>
              <button type='button' className={'btn bg-green-800 text-white w-full'} onClick={createCreditData}>
                <div className='text-xl font-bold rotate-90'>
                  <FiLogIn />
                </div>
              </button>
            </div>
            <div className='px-2'>
              <button type='button' className={'btn bg-orange-800 text-white w-full'} onClick={createDebitData}>
                <div className='text-xl font-bold -rotate-90'>
                  <FiLogOut />
                </div>
              </button>
            </div>
          </div>
        )
      }
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          ledgers.links[0].url ? (
            <Link
              href={route('cashflow.saving.ledger', {
                organization: organization.id,
                page: ledgers.current_page - 1,
                search: search,
              })}
              preserveState
              only={['ledgers']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          ledgers.links[ledgers.links.length - 1].url ? (
            <Link
              href={route('cashflow.saving.ledger', {
                organization: organization.id,
                page: ledgers.current_page + 1,
                search: search,
              })}
              only={['ledgers']}
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
            {ledgers.current_page}/{ledgers.last_page}
          </>
        }
        data={ledgers}
      />
      <ContentMobile>
        {ledgers.data.map((ledger) => (
          <SavingLedgerMobile
            ledger={ledger}
            key={ledger.id}
            handleDelete={() => handleDelete(ledger)}
            handleEdit={() => handleEdit(ledger)}
            role={role}
          />
        ))}
      </ContentMobile>

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {role !== 'viewer' && (
              <div className='space-x-2'>
                <button onClick={createCreditData} className='bg-green-800 px-4 py-2 text-white border border-transparent rounded-md font-semibold'>
                  <div className='text-xl font-bold rotate-90'>
                    <FiLogIn />
                  </div>
                </button>
                <button onClick={createDebitData} className='bg-orange-800 px-4 py-2 text-white border border-transparent rounded-md font-semibold'>
                  <div className='text-xl font-bold -rotate-90'>
                    <FiLogOut />
                  </div>
                </button>
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
              placeholder='Cari'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={ledgers} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {ledgers.links[0].url ? (
                <Link
                  href={route('cashflow.saving.ledger', {
                    organization: organization.id,
                    page: ledgers.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['ledgers']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {ledgers.current_page}/{ledgers.last_page}
            </div>
            <div className='my-auto'>
              {ledgers.links[ledgers.links.length - 1].url ? (
                <Link
                  href={route('cashflow.saving.ledger', {
                    organization: organization.id,
                    page: ledgers.current_page + 1,
                    search: search,
                  })}
                  only={['ledgers']}
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
          <li>Tambah/Ambil Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);