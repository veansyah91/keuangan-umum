import BadgeDanger from '@/Components/Badges/BadgeDanger'
import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import BadgeWarning from '@/Components/Badges/BadgeWarning'
import Container from '@/Components/Container'
import Header from '@/Components/Header'
import SecondaryButton from '@/Components/SecondaryButton'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Show({auth, organization}) {
  return (
    <>
      <Head title='Organization' />  

      <div className='min-h-screen bg-gray-100'>
        <div className='max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white rounded-lg'>
          <Header>
            <div className='pt-4 text-center'>
              Detail Organisasi
            </div>
            <div className='text-center'>
              {
                  organization.status == 'trial' && 
                  <BadgeWarning>Trial</BadgeWarning>
              }
              {
                  organization.status == 'active' && 
                  <BadgeSuccess>Aktif</BadgeSuccess>
              }
              {
                  organization.status == 'deactive' && 
                  <BadgeDanger>Tidak Aktif</BadgeDanger>
              }
            </div>

          </Header>
          <Container maxHeight='max-h-full'>
            <div className=' px-8 sm:px-4'>
              Nama Organisasi:
            </div>
            <div className='font-bold px-8 sm:px-4 mt-2'>
              {organization.name}
            </div>

            <div className='mt-9 px-8 sm:px-4'>
              Alamat Organisasi:
            </div>
            <div className='font-bold px-8 sm:px-4'>
              {organization.address ?? 'Belum Ada Data'}
              <div>{organization.village ?? ''}
                  {organization.district && `, ${organization.district}`}
                  {organization.regency && `, ${organization.regency}`}
                  {organization.province && `, ${organization.province}`}
              </div>              
            </div>

            <div className='mt-9 px-8 sm:px-4'>
              No Legalitas Organisasi:
            </div>
            <div className={`${organization.legality && 'font-bold'} px-8 sm:px-4 ${organization.legality ?? 'italic'}`}>
              {organization.legality ?? 'Belum Ada Data'}
            </div>

            <div className='mt-9 px-8 sm:px-4'>
              Tanggal Pendaftaran:
            </div>
            <div className='font-bold px-8 sm:px-4'>
              {organization.date}
            </div>

            <div className='mt-9 px-8 sm:px-4'>
              Tanggal Kadaluarsa:
            </div>
            <div className='font-bold px-8 sm:px-4'>
              {organization.expiredId} (sisa {organization.diffExpired})
            </div>

            <div className='mt-9 px-8 sm:px-4'>
              <Link href='/organizations'>
                <SecondaryButton>Kembali</SecondaryButton>
              </Link>
            </div>
            
          </Container>

        </div>
      </div>
    </>
  )
}
