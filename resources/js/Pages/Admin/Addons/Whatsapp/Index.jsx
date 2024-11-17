import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { CiViewList } from "react-icons/ci";
import { LiaFileInvoiceSolid } from 'react-icons/lia';

export default function Index() {
  return (
    <>
      <Head title='Addons' />

      {/* Desktop */}
      <ContainerDesktop>
        <div className='flex justify-center pt-5 pb-10 gap-2'>
          <Link href={route('admin.add-ons.whatsapp')}>
            <CardMenu bgColor={'bg-orange-500'} icon={<CiViewList />} title={'Data'} />
          </Link>
          <Link href={route('admin.add-ons.whatsapp')}>
            <CardMenu bgColor={'bg-cyan-500'} icon={<LiaFileInvoiceSolid />} title={'Invoice'} />
          </Link>
        </div>
      </ContainerDesktop>
      {/* Desktop */}

      {/* Mobile */}
      <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
        <Link href={route('admin.add-ons.whatsapp')}>
          <CardMenu bgColor={'bg-orange-500'} icon={<CiViewList />} title={'Data'} />
        </Link>
        <Link href={route('admin.add-ons.whatsapp')}>
            <CardMenu bgColor={'bg-cyan-500'} icon={<LiaFileInvoiceSolid />} title={'Invoice'} />
          </Link>
      </div>
      {/* Mobile */}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Whatsapp Broadcasting Addons</Header>}
      breadcrumbs={
        <div className='text-sm breadcrumbs'>
            <ul>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons')}>Addons</Link>
                </li>
                <li>Whatsapp Broadcasting Addons</li>
            </ul>
        </div>
    }
      children={page}
      user={page.props.auth.user}
      title='Whatsapp Broadcasting Addons'
  />
);
