import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';

export default function Show({organization, user, journal, fixedAsset, createdBy, assetAccount, depreciationAccumulationAccount, depreciationCostAccount}) {
  return (
    <>
      <Head title='Detail Harta Tetap' />

      <div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-5 px-2 sm:pt-0'>
          <div className='w-full sm:mt-2 sm:py-5'>
            <div className='sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Nama</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {fixedAsset.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 w-full font-bold'>Kode</div>
                <div className='sm:w-2/3 w-full flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {fixedAsset.code}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Tanggal Pengadaan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {dayjs(fixedAsset.date).format('MMM DD, YYYY')}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Nilai Perolehan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    IDR. {formatNumber(fixedAsset.value)}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Penyusutan Perbulan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    IDR. {formatNumber(fixedAsset.depreciation_value)}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Akumulasi Penyusutan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    IDR. {formatNumber(fixedAsset.depreciation_accumulated)}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Nilai Buku</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    IDR. {formatNumber(fixedAsset.value - fixedAsset.depreciation_accumulated)}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Dibuat Oleh</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    {createdBy.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1 uppercase pt-5 font-bold underline'>
                Buku Besar
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Tanggal Jurnal</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                    {dayjs(journal.date).format('MMM DD, YYYY')}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Akun Aset</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {assetAccount.code} - {assetAccount.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Akun Akumulasi Penyusutan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {depreciationAccumulationAccount?.code} - {depreciationAccumulationAccount?.name}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Akun Beban Penyusutan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span> 
                  {depreciationCostAccount?.code} - {depreciationCostAccount?.name}
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
  header={<Header>Detail Harta Tetap</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Detail Harta Tetap"
  backLink={<Link href={route('data-master.project',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
    <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Data Master</Link></li> 
    <li className='font-bold'><Link href={route('data-master.fixed-asset',page.props.organization.id)}>Harta Tetap</Link></li> 
    <li>Detail Harta Tetap</li>
    </ul>
  </div>}
  role={page.props.role}
/>
