import CardMenu from '@/Components/CardMenu';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { IoPeopleOutline } from 'react-icons/io5/index.esm';
import { GiTakeMyMoney } from "react-icons/gi";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';

export default function Index() {
  return (
    <>
      <Head title='Master Pengguna' />

      {/* Desktop */}
      <ContainerDesktop>
        <div className='flex flex-wrap justify-center pt-5 pb-10 gap-5'>
          <Link href={route('admin.user-master.users')}>
            <CardMenu 
              bgColor={'bg-orange-500'}
              icon={<IoPeopleOutline />}
              title={'Data Pengguna'}
            />
          </Link>     
          <Link href={route('admin.user-master.withdraws')}>
            <CardMenu 
              bgColor={'bg-green-500'}
              icon={<GiTakeMyMoney />}
              title={'Data Penarikan Saldo Afiliasi'}
            />
          </Link>  
        </div>
    </ContainerDesktop>
    {/* Desktop */}

    {/* Mobile */}
    <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
      <Link href={route('admin.user-master.users')}>
        <CardMenu 
          bgColor={'bg-orange-500'}
          icon={<IoPeopleOutline />}
          title={'Data Pengguna'}
        />
      </Link>    
      <Link href={route('admin.user-master.withdraws')}>
        <CardMenu 
          bgColor={'bg-green-500'}
          icon={<GiTakeMyMoney />}
          title={'Data Penarikan Saldo Afiliasi'}
        />
      </Link> 
    </div>
    {/* Mobile */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Master User</Header>}
    children={page}
    user={page.props.auth.user}
    title="Data Master User"
/>
