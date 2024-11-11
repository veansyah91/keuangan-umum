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

export default function Index({
  invoices,
  role,
  organization,
}) {
  const [search, setSearch] = useState('');

  const [dateValue, setDateValue] = useState({
    startDate: '',
    endDate: '',
  });

const [debounceDateValue] = useDebounce(dateValue, 500);

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
  }
  console.log(invoices);
  

  return (
    <>
      {/* Mobile */}
      <Head title='Invoice WhatsApp Broadcasting' />
      <ToastContainer />

      {role !== 'viewer' && (
        <Link href={route('add-ons.whatsapp-invoice.create', organization.id)}>
          <AddButtonMobile label={'Tambah'} />
        </Link>
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          invoices.links[0].url ? (
            <Link
              href={route('add-ons.whatsapp-invoice', {
                organization: organization.id,
                page: invoices.current_page - 1,
                search: search,
              })}
              preserveState
              only={['invoices']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          invoices.links[invoices.links.length - 1].url ? (
            <Link
              href={route('add-ons.whatsapp-invoice', {
                organization: organization.id,
                page: invoices.current_page + 1,
                search: search,
              })} 
              only={['invoices']}
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
            {invoices.current_page}/{invoices.last_page}
          </>
        }
        data={invoices}
        hasFilter={false}
        hasDate={true}
        dateValue={dateValue}
        onChangeDate={handleDateValueChange}
      />

      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-5/12'>
            {role !== 'viewer' && (
              <Link href={route('add-ons.whatsapp-invoice.create', organization.id)}>
                <PrimaryButton className='py-3'>Tambah Data</PrimaryButton>
              </Link>
            )}
          </div>

          <div className='my-auto w-4/12 flex gap-5'>
            <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
              <IoFilter />
            </button>
            <Datepicker
              value={dateValue}
              onChange={handleDateValueChange}
              showShortcuts={true}
              configs={{
                shortcuts: {
                  today: 'Hari Ini',
                  yesterday: 'Kemarin',
                  past: (period) => `${period} Hari Terakhir`,
                  currentMonth: 'Bulan Ini',
                  pastMonth: 'Bulan Lalu',
                  currentYear: 'Tahun Ini',
                },
              }}
              separator={'s.d'}
            />
          </div>

          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Invoice'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={invoices} />
          </div>

          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {invoices.links[0].url ? (
                <Link
                  href={route('add-ons.whatsapp-invoice', {
                    organization: organization.id,
                    page: invoices.current_page - 1,
                    search: search,
                  })} 
                  preserveState
                  only={['invoices']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {invoices.current_page}/{invoices.last_page}
            </div>
            <div className='my-auto'>
              {invoices.links[invoices.links.length - 1].url ? (
                <Link
                  href={route('add-ons.whatsapp-invoice', {
                    organization: organization.id,
                    page: invoices.current_page + 1,
                    search: search,
                  })} 
                  only={['invoices']}
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
		header={<Header>Data Invoice</Header>}
		children={page}
		user={page.props.auth.user}
		role={page.props.role}
		organization={page.props.organization}
		title='WhatsApp'
		backLink={
			<Link href={route('add-ons', page.props.organization.id)}>
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
          <li>Berlangganan</li>
        </ul>
			</div>
		}
	/>
);
