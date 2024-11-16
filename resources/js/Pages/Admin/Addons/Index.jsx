import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import { IoReaderOutline } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import CardMenu from '@/Components/CardMenu';
import { FaWhatsapp } from 'react-icons/fa';

export default function Index() {
  return (
    <>
      <Head title='Addons' />

      {/* Desktop */}
      <ContainerDesktop>
        <div className='flex justify-center pt-5 pb-10 gap-2'>
          <Link href={route('admin.organization.index')}>
            <CardMenu bgColor={'bg-green-500'} icon={<FaWhatsapp />} title={'WhatsApp Broadcast'} />
          </Link>
        </div>
      </ContainerDesktop>
      {/* Desktop */}

      {/* Mobile */}
      <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
        <Link href={route('admin.organization.index')}>
          <CardMenu bgColor={'bg-green-500'} icon={<FaWhatsapp />} title={'WhatsApp Broadcast'} />
        </Link>
      </div>
      {/* Mobile */}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Addons</Header>}
      children={page}
      user={page.props.auth.user}
      title='Addons'
  />
);
