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
import CashflowContent from './Component/CashflowContent';
import dayjs from 'dayjs';
import { Disclosure, Transition } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { IoTrashOutline } from 'react-icons/io5/index.esm';

export default function Cashflow({organization, cashflows, startDateFilter, endDateFilter, startCashflow, projects, programs, departments, project, program, department}) {

  const [dataCashflows, setDataCashflows] = useState(cashflows || []);
  const [startDate, setStartDate] = useState(startDateFilter || '');
  const [endDate, setEndDate] = useState(endDateFilter || '');

  const [filterData, setFilterData] = useState({
    accountCode: false
  })

  const [operatingAmount, setOperatingAmount] = useState({
    add: 0, 
    reduce: 0
  });

  const [financingAmount, setFinancingAmount] = useState({
    add: 0, 
    reduce: 0
  });

  const [investingAmount, setInvestingAmount] = useState({
    add: 0, 
    reduce: 0
  });

  const [summaryCash, setSummaryCash] = useState({
    before: startCashflow.total || 0,
    increase: 0,
    after: 0,
  });

  const [startDateValue, setStartDateValue] = useState({
    startDate: startDateFilter || '', 
    endDate: startDateFilter || ''
  });

  const [endDateValue, setEndDateValue] = useState({
    startDate: endDateFilter || '', 
    endDate: endDateFilter || ''
  });

  const [cashflowCategory, setCashflowCategory] = useState({
    financing : false,
    operating : false,
    investing : false
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
  useEffect(() => {
    functionSetData(cashflows, startCashflow);    
  }, [])

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

  const functionSetData = (cashflows, startCashflow) => {
    let operating = {
      add : 0,
      reduce : 0
    };

    let financing = {
      add : 0,
      reduce : 0
    };

    let investing = {
      add : 0,
      reduce : 0
    };

    let tempValue = 0;

    cashflows.map(cashflow => {
      tempValue += parseInt(cashflow.total);
      if (cashflow.category == 'operating') {
        setCashflowCategory({...cashflowCategory ,operating : true})
        if (parseInt(cashflow.total) > 0) {
          operating.add += parseInt(cashflow.total);
        }
        if (parseInt(cashflow.total) < 0) {
          operating.reduce += parseInt(cashflow.total);
        }
      }
      if (cashflow.category == 'financing') {
        setCashflowCategory({...cashflowCategory ,financing : true})
        if (parseInt(cashflow.total) > 0) {
          financing.add += parseInt(cashflow.total);
        }
        if (parseInt(cashflow.total) < 0) {
          financing.reduce += parseInt(cashflow.total);
        }
      }
      if (cashflow.category == 'investing') {
        setCashflowCategory({...cashflowCategory ,investing : true})
        if (parseInt(cashflow.total) > 0) {
          investing.add += parseInt(cashflow.total);
        }
        if (parseInt(cashflow.total) < 0) {
          investing.reduce += parseInt(cashflow.total);
        }
      }
    });

    setOperatingAmount({ 
      add: operating.add,
      reduce: operating.reduce,
    });

    setInvestingAmount({ 
      add: investing.add,
      reduce: investing.reduce,
    });

    setFinancingAmount({ 
      add: financing.add,
      reduce: financing.reduce,
    });

    setSummaryCash({
      before: parseInt(startCashflow.total ?? 0),
      increase: tempValue,
      after: parseInt(startCashflow.total ?? 0) + tempValue
    })

  };

  const handlePrint = () => {
    window.print();
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
      only: ['cashflows', 'startCashflow'],
      data: {
        startDate, 
        endDate,
        'program' : selectedProgram.id,
        'project' : selectedProject.id,
        'department' : selectedDepartment.id,
      },
      onBefore: visit => {
        visit.completed ? setIsLoading(false) : setIsLoading(true);
      },
      onSuccess: page => {
        setDataCashflows(page.props.cashflows);
        setSummaryCash({...summaryCash, before: page.props.startCashflow.total})
        functionSetData(page.props.cashflows, page.props.startCashflow);
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
  return (
    <>
      <Head title={`Laporan Arus Kas Periode : ${dayjs(startDate).format('MMMM DD, YYYY')} - ${dayjs(endDate).format('MMMM DD, YYYY')}`} />

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
                  {
                    (programs.length > 0 || projects.length > 0 || departments.length) ?
                    <div className='flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3'>                    
                      {
                        programs.length > 0 &&
                        <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                          <div>
                            <InputLabel value={'Program Kegiatan'} htmlFor='program'/>
                          </div>
                          <div className='flex w-full relative'>
                            <div className='w-5/6'>
                              <ClientSelectInput
                                resources={programs}
                                selected={selectedProgram}
                                setSelected={(selected) => handleSelectedProgram(selected)}
                                maxHeight='max-h-40'
                                placeholder='Cari Program Kegiatan'
                                isError={programError ? true : false}
                                id='program'
                              />
                              {
                                selectedProgram.id && 
                                <span className='text-xs absolute'>Kode: {selectedProgram.code}</span>
                              }
                              
                            </div>
                            {
                              selectedProgram.id && 
                              <div className='w-1/6 my-auto'>
                                <button 
                                type='button' className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                  onClick={handleDeleteSelectedProgram}
                                >
                                  <IoTrashOutline />
                                </button>
                              </div> 
                            }                    
                          </div>
                        </div>
                      }
                      {
                        projects.length > 0 &&
                        <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                          <div>
                            <InputLabel value={'Proyek'} htmlFor='project'/>
                          </div>
                          <div className='flex w-full relative'>
                            <div className='w-5/6'>
                              <ClientSelectInput
                                resources={projects}
                                selected={selectedProject}
                                setSelected={(selected) => handleSelectedProject(selected)}
                                maxHeight='max-h-40'
                                placeholder='Cari Proyek'
                                isError={projectError ? true : false}
                                id='project'
                              />
                              {
                                selectedProject.id && 
                                <span className='text-xs absolute'>Kode: {selectedProject.code}</span>
                              }
                            </div>
                            {
                              selectedProject.id && 
                              <div className='w-1/6 my-auto'>
                                <button 
                                type='button' className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                  onClick={handleDeleteSelectedProject}
                                >
                                  <IoTrashOutline />
                                </button>
                              </div> 
                            }  
                          </div>
                        </div>
                      }
                      {
                        departments.length > 0 &&
                        <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                          <div>
                            <InputLabel value={'Departemen'} htmlFor='department'/>
                          </div>
                          <div className='flex w-full relative'>
                            <div className='w-5/6'>
                              <ClientSelectInput
                                resources={departments}
                                selected={selectedDepartment}
                                setSelected={(selected) => handleSelectedDepartment(selected)}
                                maxHeight='max-h-40'
                                placeholder='Cari Departemen'
                                isError={departmentError ? true : false}
                                id='department'
                              />
                              {
                                selectedDepartment.id && 
                                <span className='text-xs absolute'>Kode: {selectedDepartment.code}</span>
                              }
                            </div>
                            {
                              selectedDepartment.id && 
                              <div className='w-1/6 my-auto'>
                                <button 
                                type='button' className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                  onClick={handleDeleteSelectedDepartment}
                                >
                                  <IoTrashOutline />
                                </button>
                              </div> 
                            }  
                          </div>
                        </div>
                      }
                    </div> : ''
                  }
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
              Laporan arus kas
            </div>
            <div className='w-1/2 text-end mt-auto'>
                <div>{organization.name}</div>
                <div className='text-xs'>{organization.address}</div>
                <div className='text-xs'>{organization.village}, {organization.district}, {organization.regency}, {organization.province}</div>
            </div>
          </div>
          <div className='w-full mt-3 hidden print:flex print:justify-between'>
            
            <div className='text-end italic '>
              Periode : {dayjs(startDate).format('MMMM DD, YYYY')} - {dayjs(endDate).format('MMMM DD, YYYY')}
            </div>
            <div className='text-xs my-auto'>
              {
                (programs.length > 0 || projects.length > 0 || departments.length) ?
                <div>
                  {
                    selectedProgram.name &&
                    <div>
                      Program Kegiatan: {selectedProgram.code}-{selectedProgram.name.toUpperCase()}
                    </div>
                  }
                  {
                    selectedProject &&
                    <div>
                      Proyek : {selectedProject.code}-{selectedProject.name.toUpperCase()}
                    </div>
                  }
                  {
                    selectedDepartment.name  &&
                    <div>
                      Departemen : {selectedDepartment.code}-{selectedDepartment.name.toUpperCase()}
                    </div>
                  }
                </div> : ''
              }
            </div>
            
          </div>

          {/* Content */}          
          <div className="my-2 space-y-3 mx-3 print:font-['Open_Sans'] overflow-auto">
            <div className='sm:w-3/4 w-[550px] print:w-full'>
              {
                (operatingAmount.add + operatingAmount.reduce !== 0) && 
                <CashflowContent 
                  title="Aktifitas Operasional"
                  cashflows={dataCashflows}
                  amount={operatingAmount}
                  type="operating"
                  showCode={filterData.accountCode}
                />
              }

              {
                (investingAmount.add + investingAmount.reduce !== 0) && 
                <CashflowContent 
                  title="Aktifitas Investasi"
                  cashflows={dataCashflows}
                  amount={investingAmount}
                  type="investing"
                  showCode={filterData.accountCode}
                />
              }
              
              {
                (financingAmount.add + financingAmount.reduce !== 0) && 
                <CashflowContent 
                  title="Aktifitas Pendanaan"
                  cashflows={dataCashflows}
                  amount={financingAmount}
                  type="financing"
                  showCode={filterData.accountCode}
                />
              }

              {/* Footer */}
              {
                (cashflows.length > 0) && 
                <div className='mt-5'>
                  <div className='flex w-full justify-between py-2 font-bold'>
                    <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>
                      Kas Awal
                    </div>
                    <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                      <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                      <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(summaryCash.before)}</div>
                    </div>
                  </div> 
                  <div className='flex w-full justify-between py-2 font-bold'>
                    <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>
                      Kenaikan / Penurunan Kas
                    </div>
                    <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                      <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                      <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(summaryCash.increase)}</div>
                    </div>
                  </div> 
                  <div className='flex w-full justify-between py-2 font-bold'>
                    <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>
                      Kas Akhir
                    </div>
                    <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                      <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                      <div className='w-3/4 print:w-2/4 text-end'>{formatNumber(summaryCash.after)}</div>
                    </div>
                  </div> 
                </div>
              }
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Cashflow.layout = page => <AuthenticatedLayout
  header={<Header>Laporan Arus Kas</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Laporan Arus Kas"
  backLink={<Link href={route('report',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
        <li className='font-bold'><Link href={route('report',page.props.organization.id)}>Laporan</Link></li> 
        <li>Laporan Arus Kas</li>
    </ul>
  </div>}
  role={page.props.role}
/>
