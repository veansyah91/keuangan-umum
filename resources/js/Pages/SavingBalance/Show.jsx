import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import Datepicker from 'react-tailwindcss-datepicker';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({
  startDateFilter,
  endDateFilter,
  ledgers,
  organization
}) {
  console.log(ledgers);
  
  const [dataLedgers, setDataLedgers] = useState([]);
  const [startDate, setStartDate] = useState(startDateFilter || '');
  const [endDate, setEndDate] = useState(endDateFilter || '');
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState({
    startValue: 0,
    endValue: 0,
  });

  const [startDateValue, setStartDateValue] = useState({
    startDate: startDateFilter || '',
    endDate: startDateFilter || '',
  });

  const [endDateValue, setEndDateValue] = useState({
    startDate: endDateFilter || '',
    endDate: endDateFilter || '',
  });

  const handleStartDateValueChange = (newValue) => {
    setStartDateValue(newValue);
    setStartDate(dayjs(newValue.endDate).format('YYYY-MM-DD'));
  };

  const handleEndDateValueChange = (newValue) => {
    setEndDateValue(newValue);
    setEndDate(dayjs(newValue.endDate).format('YYYY-MM-DD'));
  };

  const handleReload = () => {
    router.reload({
      only: ['ledgers'],
      data: {
        startDate,
        endDate,
      },
      onBefore: (visit) => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
    });
  }

  const handlePrint = () => {
    window.print();
  };  

  return (
    <>
      <Head
        title={`Buku Tabungan Periode : ${dayjs(startDate).format('MMMM DD, YYYY')} - ${dayjs(endDate).format('MMMM DD, YYYY')}`}
      />

      <div className='md:pt-0 pb-16 pt-12'>
        <div className='bg-white py-2 md:pt-0 px-5 space-y-2'>
          {/* Nav Title */}
          <div className='flex md:flex-row justify-between gap-2 print:hidden'>
            <div className='px-3 my-auto flex flex-col md:flex-row gap-3 w-full md:w-2/3'>
              <div className='my-auto w-full'>
                <Datepicker
                  value={startDateValue}
                  onChange={handleStartDateValueChange}
                  useRange={false}
                  asSingle={true}
                  placeholder='Tanggal Awal'
                  id='date'
                  displayFormat='MMMM DD, YYYY'
                />
              </div>
              <div className='my-auto w-full'>
                <Datepicker
                  value={endDateValue}
                  onChange={handleEndDateValueChange}
                  useRange={false}
                  asSingle={true}
                  placeholder='Tanggal Akhir'
                  id='date'
                  displayFormat='MMMM DD, YYYY'
                />
              </div>
              <div className='my-auto hidden md:block'>
                <PrimaryButton
                  disabled={
                    !startDate ||
                    !endDate ||
                    startDate > endDate ||
                    isLoading
                  }
                  onClick={handleReload}>
                  Filter
                </PrimaryButton>
              </div>
            </div>
          </div>
         
          {/* Title Print*/}
          <div className='uppercase pb-3 border-b hidden print:flex print:justify-between'>
            <div className='w-1/2 text-2xl my-auto'>Buku Tabungan</div>
            <div className='w-1/2 text-end mt-auto'>
              <div>{organization.name}</div>
              <div className='text-xs'>{organization.address}</div>
              <div className='text-xs'>
                {organization.village}, {organization.district}, {organization.regency},{' '}
                {organization.province}
              </div>
            </div>
          </div>          
        </div>
      </div>
    </>
  )
}

Show.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Buku Tabungan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Buku Tabungan'
    backLink={
      <Link href={route('cashflow.saving.balance', page.props.organization.id)}>
        <IoArrowBackOutline />
      </Link>
    }
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('cashflow', page.props.organization.id)}>Arus Kas</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('cashflow.saving', page.props.organization.id)}>Simpanan</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('cashflow.saving.balance', page.props.organization.id)}>Buku Tabungan</Link>
          </li>
          <li>Buku Tabungan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);