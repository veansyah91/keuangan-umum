import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoArrowBackOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import { CiLogin, CiLogout, CiViewList } from 'react-icons/ci';
import { FaBook } from 'react-icons/fa';
import { FaMoneyBillTransfer } from 'react-icons/fa6';

export default function Index({
  organization
}) {
  return (
    <>
        <Head title='Tabungan' />
        <ToastContainer />
        <ContainerDesktop>
				  <section>
            <div className='flex flex-wrap justify-center pt-5 pb-10 gap-5'>
              <Link href={route('cashflow.saving-category', organization.id)}>
                <CardMenu bgColor={'bg-cyan-500'} icon={<CiViewList />} title={'Kategori Simpanan'} />
              </Link>
              <Link href={route('cashflow.saving.balance', organization.id)}>
                <CardMenu bgColor={'bg-slate-600'} icon={<FaBook />} title={'Data Simpanan'} />
              </Link>
              <Link href={route('cashflow.saving.ledger', organization.id)}>
                <CardMenu 
                  bgColor={'bg-green-500'} 
                  icon={<FaMoneyBillTransfer />}
                  title={'Tambah/Ambil Simpanan'} 
                />
              </Link>
            </div>
          </section>
        </ContainerDesktop>

        {/* Mobile */}
        <section>
          <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
            <Link href={route('cashflow.saving-category', organization.id)}>
              <CardMenu bgColor={'bg-cyan-500'} icon={<CiViewList />} title={'Kategori Simpanan'} />
            </Link>
            <Link href={route('cashflow.saving.balance', organization.id)}>
              <CardMenu bgColor={'bg-slate-600'} icon={<FaBook />} title={'Data Simpanan'} />
            </Link>
            <Link href={route('cashflow.saving.ledger', organization.id)}>
              <CardMenu 
                bgColor={'bg-green-500'} 
                icon={<FaMoneyBillTransfer />}
                title={'Tambah Simpanan'} 
              />
            </Link>
          </div>
        </section>
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header></Header>}
    children={page}
    user={page.props.auth.user}
    role={page.props.role}
    organization={page.props.organization}
    title='Tabungan'
    backLink={
      <Link href={route('cashflow', page.props.organization.id)}>
        <IoArrowBackOutline />
      </Link>
    }
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
          </li>
          <li>Tabungan</li>
        </ul>
      </div>
    }
  />
);