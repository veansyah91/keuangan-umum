import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import { IoAddCircleOutline, IoArrowBackOutline, IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5';
import TextInput from '@/Components/TextInput';
import rupiah from '@/Utils/rupiah';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import { GiTakeMyMoney } from "react-icons/gi";
import formatNumber from '@/Utils/formatNumber';

export default function Affiliation({ auth, affiliation }) {

  console.log(affiliation);
  const handleSearch = _ => {
    router.reload({ 
        only: ['organizationInvoices'],
        data: {
            
        }
      });
  }

  return (
    <>
      <Head title='Afiliasi' />

      {/* Dekstop */}
        <div className='bg-gray-100 min-h-screen'>
          <div className='bg-white max-w-7xl mx-auto sm:px-6 lg:px-8'>
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs">
              <ul>
                <li className='font-bold'><Link href={route('organization')}>Daftar Organisasi</Link></li> 
                <li>Afiliasi</li>
              </ul>
            </div>

            {/* Title */}
            <Header>
              <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                  <div className='sm:p-6 px-6 py-3 text-gray-800 flex-none sm:flex'>
                      <div className='sm:hidden text-gray-800 flex flex-col-reverse gap-5'>
                          <div className="my-auto">
                              Afiliasi
                          </div>
                          <div className="flex flex-row-reverse text-end">
                              <div>
                                  <div className='text-gray-400 text-sm'>
                                      {auth.user.name}
                                  </div>                                    
                                  <div className=' text-xs text-green-400'>
                                      {auth.user.email}
                                  </div>
                              </div>
                          </div>                                    
                      </div>
                      <div className='sm:flex-1 my-auto sm:block hidden'>
                          Afiliasi
                      </div>
                      <div className='sm:flex-1 sm:block hidden text-end text-gray-800'>
                          <div className="flex flex-row-reverse">
                              <div>
                                  <div className='text-gray-400'>
                                      {auth.user.name}
                                  </div>
                                  
                                  <div className=' text-sm text-green-400'>
                                      {auth.user.email}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </Header>

          <div className='py-3 px-6 text-gray-900 flex-none sm:flex sm:flex-row-reserve sm:gap-2'>
            <div className='flex gap-2'>
              <div className='my-auto'><GiTakeMyMoney /> </div>
              <div className='my-auto'>Saldo Anda: <span className='font-bold text-lg text-green-500'>Rp. { formatNumber(affiliation.balance) }</span></div>
              
            </div>
            
          </div>
          </div>
        </div>
      {/* Dekstop */}

    </>
  )
}
