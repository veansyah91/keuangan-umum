import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';


export default function Index(
  { whatsappPlugins, searchFilter }
) {
  console.log(whatsappPlugins);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [search, setSearch] = useState(searchFilter || '');

  
  return (
    <>
      <Head title='Data Whatsapp Plugins' />
      <ToastContainer />

      {/* Mobile */}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          whatsappPlugins.links[0].url ? (
            <Link
              href={route('admin.add-ons.whatsapp.data', {
                page: whatsappPlugins.current_page - 1,
                search: search,
              })}
              preserveState
              only={['whatsappPlugins']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
          pageAfter={
            whatsappPlugins.links[whatsappPlugins.links.length - 1].url ? (
              <Link
                href={route('admin.add-ons.whatsapp.data', {
                  page: whatsappPlugins.current_page + 1,
                  search: search,
                })} 
                only={['whatsappPlugins']}
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
              {whatsappPlugins.current_page}/{whatsappPlugins.last_page}
            </>
          }
          data={whatsappPlugins}
          hasFilter={true}
          showFilter={() => setShowModalFilter(true)}
          hasDate={false}
      />
      {/* Mobile */}

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-5/12'>
            
          </div>
          <div className='my-auto w-4/12 flex gap-5 justify-end'>
            <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
              <IoFilter />
            </button>
          </div>
          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Kas Keluar'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={whatsappPlugins} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {whatsappPlugins.links[0].url ? (
                <Link
                  href={route('cashflow.cash-out', {
                    page: whatsappPlugins.current_page - 1,
                    search: search,
                  })} 
                  preserveState
                  only={['whatsappPlugins']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {whatsappPlugins.current_page}/{whatsappPlugins.last_page}
            </div>
            <div className='my-auto'>
              {whatsappPlugins.links[whatsappPlugins.links.length - 1].url ? (
                <Link
                  href={route('cashflow.cash-out', {
                    page: whatsappPlugins.current_page + 1,
                    search: search,
                  })} 
                  only={['whatsappPlugins']}
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

        <div className='sm:flex hidden gap-5'>
          <div className='w-full'>
            <ContentDesktop>
              <table className='table table-sm table-pin-rows table-pin-cols text-base'>
                <thead className='text-base text-gray-900'>
                  <tr className=''>
                    <th className='bg-gray-200'>Organisasi</th>
                    <th className='bg-gray-200'>Handphone</th>
                    <th className='bg-gray-200'>Tanggal Expired</th>
                    <th className='bg-gray-200'>App Key/Auth Key</th>
                    <th className='bg-gray-200'>Koneksi</th>
                    <th className='bg-gray-200'>Koneksi Terakhir</th>
                    <th className='bg-gray-200 text-center'>Status</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
              </table>

            </ContentDesktop>
          </div>
        </div>
      </ContainerDesktop>
      {/* Desktop */}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Data</Header>}
      breadcrumbs={
        <div className='text-sm breadcrumbs'>
            <ul>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons')}>Addons</Link>
                </li>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons.whatsapp')}>Whatsapp Broadcasting Addons</Link>
                </li>
                <li>Data</li>
            </ul>
        </div>
      }
      backLink={
        <Link href={route('admin.add-ons.whatsapp')}>
            <IoArrowBackOutline />
        </Link>
      }
      children={page}
      user={page.props.auth.user}
      title='Data'
  />
);
