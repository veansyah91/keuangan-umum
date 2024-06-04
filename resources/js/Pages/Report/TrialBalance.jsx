import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
import { IoArrowBackOutline} from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaPrint } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import dayjs from 'dayjs';
import TrialBalanceContent from './Component/TrialBalanceContent';
import { Disclosure, Transition } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { IoChevronUpCircleOutline, IoTrashOutline } from 'react-icons/io5/index.esm';

export default function TrialBalance({ organization, balances, lostProfits, total, startDateFilter, endDateFilter, departments, projects, programs, department, project, program}) {
  const [dataBalances, setDataBalances] = useState(balances || []);
  const [dataLostProfits, setDataLostProfits] = useState(lostProfits || []);
  const [dataTotal, setDataTotal] = useState(total || []);
  const [startDate, setStartDate] = useState(startDateFilter || '');
  const [endDate, setEndDate] = useState(endDateFilter || '');

  const [startDateValue, setStartDateValue] = useState({
    startDate: startDateFilter || '', 
    endDate: startDateFilter || ''
  });

  const [endDateValue, setEndDateValue] = useState({
    startDate: endDateFilter || '', 
    endDate: endDateFilter || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const [selectedProject, setSelectedProject] = useState({
    id: project ? project.id : null, name: project? project.name : '', code: project? project.code : ''
  });
  const [projectError, setProjectedError] = useState('');

  const [selectedProgram, setSelectedProgram] = useState({
    id: program ? program.id : null, name: program? program.name : '', code: program? program.code : ''
  });
  const [programError, setProgramedError] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState({
    id: department ? department.id : null, name: department? department.name : '', code: department? department.code : ''
  });
  const [departmentError, setDepartmentedError] = useState('');

  // useEffect
  
  // function 
  const handleSelectedProgram = (selected) => {
    setSelectedProgram(selected);
  }

  const handleDeleteSelectedProgram = () => {
    setSelectedProgram({id: null, name: '', code: ''});
  }

  const handleSelectedProject = (selected) => {
    setSelectedProject(selected);
  }

  const handleDeleteSelectedProject = () => {
    setSelectedProject({id: null, name: '', code: ''});
  }

  const handleSelectedDepartment = (selected) => {
    setSelectedDepartment(selected);
  }

  const handleDeleteSelectedDepartment = () => {
    setSelectedDepartment({id: null, name: '', code: ''});
  }
  const handleStartDateValueChange = (newValue) => {
    setStartDateValue(newValue);
    setStartDate(newValue.startDate);
  }

  const handleEndDateValueChange = (newValue) => {
    setEndDateValue(newValue);
    setEndDate(newValue.endDate);
  }

  const handleReload = () => {
    router.reload({
      only: ['balances', 'lostProfits', 'total'],
      data: {
        startDate, endDate,
        'program' : selectedProgram.id,
        'project' : selectedProject.id,
        'department' : selectedDepartment.id,
      },
      onBefore: visit => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
      onSuccess: page => {
        setDataBalances(page.props.balances);
        setDataLostProfits(page.props.lostProfits);
        setDataTotal(page.props.total);
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
      <Head title={`Laporan Neraca Lajur : ${dayjs(startDate).format('MMMM DD, YYYY')} - ${dayjs(endDate).format('MMMM DD, YYYY')}`} />

      <div className='sm:pt-0 pb-16 pt-12'>
        <div className='bg-white py-2 sm:pt-0 px-5'>
          {/* Nav Title */}
          <div className='flex sm:flex-row justify-between gap-2 print:hidden'>
            <div className='px-3 my-auto flex gap-3'>
              <div className='my-auto'>
                <Datepicker
                  value={startDateValue} 
                  onChange={handleStartDateValueChange}  
                  useRange={false} 
                  asSingle={true} 
                  placeholder='Tanggal Awal'
                  id="date"
                  displayFormat='MMMM DD, YYYY'
                />
              </div>
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
                <PrimaryButton disabled={(!startDate || !endDate || startDate > endDate || isLoading)} onClick={handleReload}>Filter</PrimaryButton>
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

          {/* Title Print*/}
          <div className='uppercase pt-9 pb-3 border-b hidden print:flex print:justify-between'>
            <div className='w-1/2 text-2xl my-auto'>
              Laporan Neraca Lajur
            </div>
            <div className='w-1/2 text-end mt-auto'>
                <div>{organization.name}</div>
                <div className='text-xs'>{organization.address}</div>
                <div className='text-xs'>{organization.village}, {organization.district}, {organization.regency}, {organization.province}</div>
            </div>
          </div>
          <div className='w-full mt-3 hidden print:flex print:justify-between'>
            <div className='uppercase'>
              
            </div>
            <div className='text-end italic'>
              Periode : {dayjs(startDate).format('MMMM DD, YYYY')} - {dayjs(endDate).format('MMMM DD, YYYY')}
            </div>
          </div>

          {/* Content */}
          <div className="my-2 -mx-5 space-y-3 print:font-['Open_Sans'] overflow-auto">
            <div className='sm:w-full w-[550px] print:w-full'>
            <table className='table uppercase table-zebra table-xs'>
                <thead>
                  <tr className='text-slate-900 font-bold'>
                    <th rowSpan={2}>Kode Akun</th>
                    <th rowSpan={2}>Nama Akun</th>
                    <th className='text-end' colSpan={2}>saldo awal</th>
                    <th className='text-end' colSpan={2}>mutasi</th>
                    <th className='text-end' colSpan={2}>saldo akhir</th>
                  </tr>
                  <tr className='text-slate-900 font-bold border-b-2 border-slate-900'>
                    <th className='text-end'>debit</th>
                    <th className='text-end'>kredit</th>
                    <th className='text-end'>debit</th>
                    <th className='text-end'>kredit</th>
                    <th className='text-end'>debit</th>
                    <th className='text-end'>kredit</th>
                  </tr>
                </thead>
                <tbody>
                  {/* balance */}
                  {
                    dataBalances.sort((a,b) => a.code - b.code).map((balance, index) => 
                      <TrialBalanceContent 
                        key={index}
                        ledger={balance}
                      />
                    )
                  }

                  {/* lost profit */}
                  {
                    dataLostProfits.map((lostProfit, index) => 
                      <TrialBalanceContent 
                        key={index}
                        ledger={lostProfit}
                        
                      />
                    )
                  }
                </tbody>
                <tfoot>
                  <TrialBalanceContent 
                    ledger={total}
                    isTotal={true}
                  />
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

TrialBalance.layout = page => <AuthenticatedLayout
  header={<Header>Laporan Neraca Lajur</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Laporan Neraca Lajur"
  backLink={<Link href={route('report',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
        <li className='font-bold'><Link href={route('report',page.props.organization.id)}>Laporan</Link></li> 
        <li>Laporan Neraca Lajur</li>
    </ul>
  </div>}
  role={page.props.role}
/>
