import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
import { IoArrowBackOutline, IoChevronUpCircleOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaPrint } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import { Disclosure, Transition } from '@headlessui/react';
import BalanceContent from './Component/BalanceContent';

export default function Balance({organization, ledgers, endDateFilter, account}) {
  const [dataLedgers, setDataLedgers] = useState([]);
  const [endDate, setEndDate] = useState(endDateFilter || '');

  const [endDateValue, setEndDateValue] = useState({
    startDate: endDateFilter || '', 
    endDate: endDateFilter || ''
  });

  const [filterData, setFilterData] = useState({
    accountCode: false
  });

  const [asset, setAsset] = useState(0);
  const [liability, setLiability] = useState(0);
  const [equity, setEquity] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // useEffect
  useEffect(() => {
    functionSetData(ledgers, account);
  },[])

  // function 
  const functionSetData = (ledgers, account) => {
    let tempAsset = 0;
    let tempLiability = 0;
    let tempEquity = 0;

    let active = 0;
    let pasive = 0;

    let arrayEarningYear = null;
    ledgers.map((ledger, index) => {
      if (ledger.code >= '100000000' && ledger.code <= '199999999') {
        tempAsset += parseInt(ledger.total);
        active += parseInt(ledger.total);
      }
      if (ledger.code >= '200000000' && ledger.code <= '299999999') {
        tempLiability += parseInt(ledger.total);
        pasive += parseInt(ledger.total);
      }
      if (ledger.code >= '300000000' && ledger.code <= '399999999') {
        tempEquity += parseInt(ledger.total);
        pasive += parseInt(ledger.total);

        if (!ledger.can_be_deleted) {
          arrayEarningYear = index;
        }
      }
    });

    let tempLedgers = [...ledgers];

    if (arrayEarningYear) {
      let tempValue = active + pasive - parseInt(tempLedgers[arrayEarningYear].total);
      tempLedgers[arrayEarningYear] = {
        ...tempLedgers[arrayEarningYear], total: tempValue * -1
      } 
      tempEquity += tempValue * -1;
    } else {
      tempLedgers = [...tempLedgers, {
        code: account.code, name: account.name, account_id: account.id, can_be_deleted: account.can_be_deleted, total: (active + pasive) * -1
      }];

      tempLedgers.sort((a,b) => a.code - b.code);

      tempEquity += (active + pasive) * -1;
    }

    setDataLedgers(tempLedgers);

    setAsset(tempAsset);
    setLiability(tempLiability * -1);
    setEquity(tempEquity * -1);
  }

  const handleEndDateValueChange = (newValue) => {
    setEndDateValue(newValue);
    setEndDate(newValue.endDate);
  }

  const handleReload = () => {
    router.reload({
      only: ['ledgers', 'account'],
      data: {
        endDate
      },
      onBefore: visit => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
      onSuccess: page => {
        functionSetData(page.props.ledgers, page.props.account);
      },
      onError: err => {
        console.log(err);
      },
      onFinish: visit => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
      preserveState: true
    })
  }

  const handlePrint = () => {
    window.print();
  }
  return (
    <>
      <Head title={`Laporan Neraca Periode : ${dayjs(endDate).format('MMMM DD, YYYY')}`} />

      <div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-2 sm:pt-0 px-5'>
          {/* Nav Title */}
          <div className='flex sm:flex-row justify-between gap-2 print:hidden'>
            <div className='px-3 my-auto flex gap-3'>
              <div className='my-auto'>
                <Datepicker
                  value={endDateValue} 
                  onChange={handleEndDateValueChange}  
                  useRange={false} 
                  asSingle={true} 
                  placeholder='Tanggal Akhir'
                  id="date"
                  displayFormat='MMMM DD, YYYY'
                />
              </div>
              <div className='my-auto'>
                <PrimaryButton disabled={( !endDate || isLoading )} onClick={handleReload}>Filter</PrimaryButton>
              </div>
            </div>
            <div className='text-end px-3 hidden sm:block'>
              <SecondaryButton onClick={handlePrint}>
                <div className='flex gap-2'>
                  <div className='my-auto'><FaPrint /></div>
                  <div className='my-auto'>Print</div>
                </div>
              </SecondaryButton>
            </div>
            <div className='fixed sm:hidden bottom-2 right-2'>
              <button onClick={handlePrint} className='bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14'>
                <div className='flex gap-2'>
                  <div className='my-auto mx-auto'><FaPrint /></div>
                </div>
              </button>
            </div>
          </div>
          <Disclosure as="div" className='mt-3 print:hidden'>
            {({ open }) => (
              <>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel>
                  <div className='flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3'>
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2" htmlFor='checkbox'>
                        <input 
                          type="checkbox" 
                          className="checkbox" 
                          id='checkbox'
                          value={filterData.accountCode}
                          onChange={() => setFilterData({...filterData.accountCode, accountCode: !filterData.accountCode})}
                          checked={filterData.accountCode}
                        />
                        <span className="label-text">Tampilkan Kode Akun</span> 
                      </label>
                    </div>  
                  </div>
                  </Disclosure.Panel>
                </Transition>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75">
                  <div className='flex justify-center w-full gap-3'>
                    <span>Tampilkan Lebih Banyak</span>
                    <IoChevronUpCircleOutline
                      className={`${
                        open ? '' : 'rotate-180 transform'
                      } h-5 w-5 text-slate-500`}
                    />
                  </div>
                  
                </Disclosure.Button>
              </>
            )}
          </Disclosure>

          {/* Title Print*/}
          <div className='uppercase pt-9 pb-3 border-b hidden print:flex print:justify-between'>
            <div className='w-1/2 text-2xl my-auto'>
              Laporan Neraca
            </div>
            <div className='w-1/2 text-end mt-auto'>
                <div>{organization.name}</div>
                <div className='text-xs'>{organization.address}</div>
                <div className='text-xs'>{organization.village}, {organization.district}, {organization.regency}, {organization.province}</div>
            </div>
          </div>
          <div className='w-full text-end italic mt-3 hidden print:block'>
            Periode : {dayjs(endDate).format('MMMM DD, YYYY')}
          </div>

          {/* Content */}          
          <div className="my-2 space-y-3 mx-3 print:font-['Open_Sans'] overflow-auto">
            <div className='sm:w-3/4 w-[550px] print:w-full'>              
              {
                asset > 0 && 
                <BalanceContent 
                  ledgers={dataLedgers}
                  title={'Harta'}
                  showCode={filterData.accountCode}
                  type={"asset"}
                  amount={asset}
                />
              }

              {
                liability > 0 && 
                <BalanceContent 
                  ledgers={dataLedgers}
                  title={'Kewajiban'}
                  showCode={filterData.accountCode}
                  type={"liability"}
                  amount={liability}
                />
              }

              {
                equity > 0 && 
                <BalanceContent 
                  ledgers={dataLedgers}
                  title={'Modal'}
                  showCode={filterData.accountCode}
                  type={"equity"}
                  amount={equity}
                />
              }             
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Balance.layout = page => <AuthenticatedLayout
  header={<Header>Laporan Neraca</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Laporan Neraca"
  backLink={<Link href={route('report',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
        <li className='font-bold'><Link href={route('report',page.props.organization.id)}>Laporan</Link></li> 
        <li>Laporan Neraca</li>
    </ul>
  </div>}
  role={page.props.role}
/>
