import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';

export default function Show({project, organization, user}) {
  
  return (
    <>
      <Head title='Detail Proyek' />

      <div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-5 px-2 sm:pt-0'>
          <div className='w-full sm:mt-2 sm:py-5'>
            <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Nama Proyek</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Kode Proyek</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.code}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Deskripsi</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.description ?? '-'}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Perkiaraan Biaya Proyek</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  IDR {formatNumber(project.estimated_value)}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Tanggal Mulai</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.start_date ? dayjs(project.start_date).format('MMM DD, YYYY') : '-'}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Tanggal Berakhir</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.end_date ? dayjs(project.end_date).format('MMM DD, YYYY') : '-'}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Status</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {project.status == 'not started' && 'Belum Dimulai'}
                  {project.status == 'finished' && 'Selesai'}
                  {project.status == 'pending' && 'Ditunda'}
                  {project.status == 'in progress' && 'Dalam Pengerjaan'}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Dibuat Oleh</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {user.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>
                  <Link href={route('data-master.project', organization.id)}>
                    <SecondaryButton className='w-full sm:w-1/3'>
                      <div className='w-full'>
                        Kembali
                      </div>
                    </SecondaryButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
    </>
  )
}

Show.layout = page => <AuthenticatedLayout
  header={<Header>Detail Proyek</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Detail Proyek"
  backLink={<Link href={route('data-master.project',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
    <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Data Master</Link></li> 
    <li className='font-bold'><Link href={route('data-master.project',page.props.organization.id)}>Proyek</Link></li> 
    <li>Detail Proyek</li>
    </ul>
  </div>}
  role={page.props.role}
/>
