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
import MenuMobile from './Components/MenuMobile';
import MenuDesktop from './Components/MenuDesktop';

export default function Index({ menus }) {
  return (
    <>
      <Head title='Daftar Menu' />
      <ToastContainer />

      {/* Mobile */}
      <TitleMobile
        zIndex={'z-50'}
        pageBefore={
          menus.links[0].url ? (
            <Link
              href={`/admin/data-master/menus?page=${menus.current_page - 1}`}
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
          menus.links[menus.links.length - 1].url ? (
            <Link
              href={`/admin/data-master/menus?page=${menus.current_page + 1}`}
              only={['menus']}
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
            {menus.current_page}/{menus.last_page}
          </>
        }
        data={menus}
        hasFilter={false}
        hasDate={false}
      />

      <ContentMobile>
        {menus.data.map((menu) => (
          <MenuMobile
            menu={menu}
            key={menu.id}
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
            <PageNumber data={menus} />
          </div>

          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {menus.links[0].url ? (
                <Link
                  href={`/admin/data-master/menus?page=${menus.current_page - 1}`}
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
              {menus.current_page}/{menus.last_page}
            </div>
            <div className='my-auto'>
              {menus.links[menus.links.length - 1].url ? (
                <Link
                  href={`/admin/data-master/menus?page=${menus.current_page + 1}`}
                  only={['menus']}
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
                <th className='bg-gray-200'>Menu</th>
              </tr>
            </thead>
            <tbody>
              {menus.data.map((menu, index) => (
                <MenuDesktop
                  key={index}
                  menu={menu}
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
    header={<Header>Daftar Menu</Header>}
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('admin.data-master')}>Data Master</Link>
          </li>
          <li>Daftar Menu</li>
        </ul>
      </div>
    }
    children={page}
    user={page.props.auth.user}
    title='Daftar Menu'
    backLink={
      <Link href={route('admin.data-master')}>
        <IoArrowBackOutline />
      </Link>
    }
  />
);
