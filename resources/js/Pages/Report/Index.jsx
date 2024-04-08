import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoIdCardOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdChecklist } from "react-icons/md";
import { LiaClipboardListSolid } from "react-icons/lia";
import { CgListTree } from "react-icons/cg";

export default function Index({organization}) {
  return (
    <>
      <Head title='Laporan' />
      {/* Desktop */}
        <ContainerDesktop>
          <div className='flex justify-start pb-10 gap-2'>
            <div className='w-1/4'>
              <div className='text-lg font-bold'>Laporan Keuangan</div>
              <div className='space-y-2 mt-4'>
                <div>
                  <Link href={route('report.cashflow', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Arus Kas</Link>                  
                </div>
                <div>
                  <Link href={route('report.balance', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Neraca</Link>
                </div>
                <div>
                  <Link href={route('report.lost-profit', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Laba Rugi</Link>                  
                </div>         
                <div>
                  <Link href={route('report.trial-balance', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Neraca Lajur</Link>                  
                </div>       
              </div>
            </div>
            <div className='w-1/4'>
              <div className='text-lg font-bold'>Laporan Buku Besar</div>
              <div className='space-y-2 mt-4'>
                <div>
                  <Link href={route('report.journal', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Jurnal</Link>                  
                </div>
                <div>
                  <Link href={route('report.ledger', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Buku Besar Per Akun</Link>                                    
                </div>
                <div>
                  <Link href={route('report.ledgers', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Buku Besar</Link>    
                </div>
                                                            
              </div>
            </div>
          </div>
        </ContainerDesktop>
      {/* Desktop */}

      {/* Mobile */}
      <div className='sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center'>
        <div className='w-full'>
          <div className='text-lg font-bold'>Laporan Keuangan</div>
          <div className='mt-2'>
            <div className='border-b py-1'>
              <Link href={route('report.cashflow', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Arus Kas</Link>                  
            </div>
            <div className='border-b py-1'>
              <Link href={route('report.balance', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Neraca</Link>
            </div>
            <div className='border-b py-1'>
              <Link href={route('report.lost-profit', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Laba Rugi</Link>                  
            </div>    
            <div className='border-b py-1'>
              <Link href={route('report.trial-balance', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Neraca Lajur</Link>                  
            </div>                    
          </div>
        </div>
        <div className='w-full mt-4'>
          <div className='text-lg font-bold'>Laporan Buku Besar</div>
          <div className='mt-2'>
            <div className='border-b py-1'>
              <Link href={route('report.journal', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Jurnal</Link>                  
            </div>
            <div className='border-b py-1'>
              <Link href={route('report.ledger', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Buku Besar Per Akun</Link>
            </div>
            <div className='border-b py-1'>
              <Link href={route('report.ledgers', organization.id)} className='hover:bg-slate-100 p-2 rounded-lg hover:font-bold'>Laporan Buku Besar</Link>                      
            </div>              
          </div>
        </div>
      </div>
      {/* Mobile */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header></Header>}
    children={page}
    user={page.props.auth.user}
    role={page.props.role}
    organization={page.props.organization}
    title="Laporan"
/>