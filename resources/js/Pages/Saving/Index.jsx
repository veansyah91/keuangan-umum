import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoIdCardOutline, IoPeopleOutline, IoArrowBackOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { CgListTree } from 'react-icons/cg';
import { TbBuildingCommunity } from 'react-icons/tb';
import { BsBuildings } from 'react-icons/bs';
import { IoMdPeople } from 'react-icons/io';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BiCategory, BiDetail } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import { RiFileListLine } from 'react-icons/ri';
import { CiLogin, CiLogout, CiViewList } from 'react-icons/ci';
import { FaBook } from 'react-icons/fa';

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
                <CardMenu bgColor={'bg-slate-600'} icon={<FaBook />} title={'Saldo Simpanan'} />
              </Link>
              <Link href={route('cashflow.saving.credit', organization.id)}>
                <CardMenu 
                  bgColor={'bg-green-500'} 
                  icon={
                    <div className='rotate-90'>
                      <CiLogin />
                    </div>
                  }
                  title={'Tambah Simpanan'} 
                />
              </Link>
              <Link href={route('cashflow.saving.credit', organization.id)}>
                <CardMenu 
                  bgColor={'bg-red-500'} 
                  icon={
                    <div className='rotate-90'>
                      <CiLogout />
                    </div>
                  }
                  title={'Ambil Simpanan'} 
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