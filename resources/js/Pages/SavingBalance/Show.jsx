import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import dayjs from 'dayjs';
import Datepicker from 'react-tailwindcss-datepicker';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPrint } from 'react-icons/fa/index.esm';
import SecondaryButton from '@/Components/SecondaryButton';
import formatNumber from '@/Utils/formatNumber';

export default function Show({
  startDateFilter,
  endDateFilter,
  ledgers,
  organization,
  startedValue,
  balance,
  balanceCategory,
  contact
}) {  
  console.log(startedValue);
  
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

  // useEffect
  useEffect(() => {
    if (startDateFilter && endDateFilter && startedValue) {
      handleModifyLedgers(ledgers, startedValue);
    }
  }, []);

  const handleModifyLedgers = (ledgers, startedValue) => {
    let tempTotal = startedValue;
    let newLedgers = [];
    ledgers.map((ledger, index) => {
      tempTotal += ledger.debit - ledger.credit;

      newLedgers[index] = {
        ...ledger,
        total: tempTotal,
      };
    });

    setDataLedgers(newLedgers);
    setTotal({
        startValue: startedValue,
        endValue: tempTotal,
    });
  };

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
      only: ['ledgers', 'startedValue'],
      data: {
        startDate,
        endDate,
      },
      onBefore: (visit) => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
      onSuccess: ({ props }) => {        
        handleModifyLedgers(props.ledgers, props.startedValue);
      },
      onFinish: () => {
        setIsLoading(false);
      }
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
            <div className='text-end px-3 hidden md:block print:flex print:justify-between'>
              <SecondaryButton onClick={handlePrint}>
                <div className='flex gap-2'>
                  <div className='my-auto'>
                    <FaPrint />
                  </div>
                  <div className='my-auto'>Print</div>
                </div>
              </SecondaryButton>
            </div>
            <div className='fixed md:hidden bottom-2 right-2'>
              <button
                onClick={handlePrint}
                className='bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14'>
                <div className='flex gap-2'>
                  <div className='my-auto mx-auto'>
                    <FaPrint />
                  </div>
                </div>
              </button>
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
          <div className='w-full mt-3 hidden print:flex print:justify-between'>
            <div className='text-xs'>
              <div>
                <div>{balance.no_ref ?? '-'}</div>
                <div>an. {contact.name}</div>
              </div>
              <div className='font-bold'>
                {balanceCategory.name}
              </div>
            </div>
            <div className='text-end italic text-xs'>
              Periode : {dayjs(startDateValue.startDate).locale('id').format('MMMM DD, YYYY')} -{' '}
              {dayjs(endDateValue.startDate).locale('id').  format('MMMM DD, YYYY')}
            </div>
          </div>  

          {/* Content */}
          <div className="my-2 -mx-5 space-y-3 print:font-['Open_Sans'] overflow-auto">
            <div className='md:w-full w-[550px] print:w-full'>
              <table className='table uppercase table-zebra table-xs'>
                <thead>
                  <tr className='text-slate-900 font-bold border-b-2 border-slate-900'>
                    <th className='w-1/12'>tanggal</th>
                    <th>ref</th>
                    <th>Dekripsi</th>
                    <th className='text-end'>debit</th>
                    <th className='text-end'>kredit</th>
                    <th className='text-end'>total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='font-bold'>
                    <td colSpan={5}>Nilai Awal</td>
                    <td className='text-end'>IDR. {formatNumber(Math.abs(total.startValue))} { Math.abs(total.startValue) !== 0 && (total.startValue > 0 ? "(D)" : "(C)") }</td>
                  </tr>
                  {dataLedgers.map((ledger, index) => (
                    <tr key={index}>
                      <td>{ledger.date}</td>
                      <td>{ledger.no_ref}</td>
                      <td>{ledger.description ?? ledger.journal?.description}</td>
                      <td className='text-end'>IDR. {formatNumber(ledger.debit)}</td>
                      <td className='text-end'>IDR. {formatNumber(ledger.credit)}</td>
                      <td className='text-end'>IDR. {formatNumber(Math.abs(ledger.total))} ({ ledger.total > 0 ? "D" : "C" })</td>
                    </tr>
                  ))}
                  <tr className='font-bold'>
                    <td colSpan={5}>Nilai Akhir</td>
                    <td className='text-end'>IDR. {formatNumber(Math.abs(total.endValue))} ({ total.endValue > 0 ? "D" : "C" })</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>              
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