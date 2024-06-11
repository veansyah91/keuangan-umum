import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import { IoAddCircleOutline, IoArrowBackOutline, IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5';
import TextInput from '@/Components/TextInput';
import rupiah from '@/Utils/rupiah';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import PrimaryButton from '@/Components/PrimaryButton';
import Container from '@/Components/Container';
import Header from '@/Components/Header';

export default function Affiliation({  }) {

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
          <div className='bg-white w-1/2 border-2'>
            <div>a</div>
          </div>
        {/* Dekstop */}

      </>
    )
}
