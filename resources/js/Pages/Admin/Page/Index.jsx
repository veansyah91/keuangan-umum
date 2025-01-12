import React from 'react';
import {
    IoArrowBackOutline,
    IoPlayBack,
    IoPlayForward,
} from 'react-icons/io5';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, } from '@inertiajs/react';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import PageNumber from '@/Components/PageNumber';
import PageMobile from './Components/PageMobile';
import PageDesktop from './Components/PageDesktop';

export default function Index({ pages }) {
  return (
    <>
      <Head title='Daftar Halaman' />
      <ToastContainer />

      {/* Mobile */}
      <TitleMobile
        zIndex={'z-50'}
        pageBefore={
          pages.links[0].url ? (
            <Link
              href={`/admin/data-master/pages?page=${pages.current_page - 1}`}
              preserveState>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          pages.links[pages.links.length - 1].url ? (
            <Link
              href={`/admin/data-master/pages?page=${pages.current_page + 1}`}
              only={['pages']}
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
            {pages.current_page}/{pages.last_page}
          </>
        }
        data={pages}
        hasFilter={false}
        hasDate={false}
      />

      <ContentMobile>
        {pages.data.map((page) => (
          <PageMobile
            page={page}
            key={page.id}
          />
        ))}
      </ContentMobile>
      {/* Mobile */}

      {/* Desktop */}
      <ContainerDesktop>
        {/* Title, Pagination, Search */}
        <TitleDesktop>
          <div className='w-1/4 my-auto '>
          </div>

          <div className='w-1/4 flex rounded-lg'>
              
          </div>

          <div className='italic text-xs my-auto text-center w-1/12'>
            <PageNumber data={pages} />
          </div>

          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {pages.links[0].url ? (
                <Link
                  href={`/admin/data-master/pages?page=${pages.current_page - 1}`}
                  preserveState>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {pages.current_page}/{pages.last_page}
            </div>
            <div className='my-auto'>
              {pages.links[pages.links.length - 1].url ? (
                <Link
                  href={`/admin/data-master/pages?page=${pages.current_page + 1}`}
                  only={['pages']}
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

      {/* Data */}
        <ContentDesktop>
          <table className='table table-pin-rows table-pin-cols text-base'>
            <thead className='text-base text-gray-900'>
              <tr className=''>
                <th className='bg-gray-200'>Nama</th>
              </tr>
            </thead>
            <tbody>
              {pages.data.map((page, index) => (
                <PageDesktop
                  key={index}
                  page={page}
                  className={`${index % 2 == 0 && 'bg-gray-100'}`}
                />
              ))}
            </tbody>
          </table>
        </ContentDesktop>
      </ContainerDesktop>
      {/* Desktop */}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Daftar Halaman</Header>}
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('admin.data-master')}>Data Master</Link>
          </li>
          <li>Daftar Halaman</li>
        </ul>
      </div>
    }
    children={page}
    user={page.props.auth.user}
    title='Daftar Halaman'
    backLink={
      <Link href={route('admin.data-master')}>
        <IoArrowBackOutline />
      </Link>
    }
  />
);
