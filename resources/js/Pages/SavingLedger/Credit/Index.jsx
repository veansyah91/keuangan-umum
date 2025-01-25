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

export default function Index({
  organization, role, ledgers, searchQuery
}) {  
  const [search, setSearch] = useState(searchQuery || "");
  
  return (
    <>
      <Head title='Tambah Tabungan' />
      <ToastContainer />

      {/* Mobile */}
      {role !== 'viewer' && (
        <Link href={route('cashflow.saving.credit.create', {organization: organization.id})}>
          <AddButtonMobile label={'Tambah Data'} />
        </Link>
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          ledgers.links[0].url ? (
            <Link
              href={route('cashflow.saving.credit', {
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
              href={route('cashflow.saving.credit', {
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

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {role !== 'viewer' && (
              <div className='space-x-2'>
                <Link href={route('cashflow.saving.credit.create', {organization: organization.id})}>
                  <PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
                </Link>
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
              placeholder='Cari Simpanan'
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
                  href={route('cashflow.saving.credit', {
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
                  href={route('cashflow.saving.credit', {
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
    header={<Header>Tambah Simpanan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Tambah Simpanan'
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
          <li>Tambah Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);