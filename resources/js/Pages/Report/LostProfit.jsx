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
import LostProfitContent from './Component/LostProfitContent';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { IoTrashOutline } from 'react-icons/io5/index.esm';

export default function LostProfit({
    organization,
    ledgers,
    startDateFilter,
    endDateFilter,
    projects,
    programs,
    departments,
    project,
    program,
    department,
}) {
    const [dataLedgers, setDataLedgers] = useState(ledgers || []);
    const [startDate, setStartDate] = useState(startDateFilter || '');
    const [endDate, setEndDate] = useState(endDateFilter || '');
    const [type, setType] = useState(0);

    const [startDateValue, setStartDateValue] = useState({
        startDate: startDateFilter || '',
        endDate: startDateFilter || '',
    });

    const [endDateValue, setEndDateValue] = useState({
        startDate: endDateFilter || '',
        endDate: endDateFilter || '',
    });

    const [filterData, setFilterData] = useState({
        accountCode: false,
    });

    const [revenue, setRevenue] = useState(0);
    const [cost, setCost] = useState({
        variable: 0,
        fixed: 0,
        depreciated: 0,
        other: 0,
    });

    const [isLoading, setIsLoading] = useState(false);

    const [selectedProject, setSelectedProject] = useState({
        id: project ? project.id : null,
        name: project ? project.name : '',
        code: project ? project.code : '',
    });

    const [projectError, setProjectedError] = useState('');

    const [selectedProgram, setSelectedProgram] = useState({
        id: program ? program.id : null,
        name: program ? program.name : '',
        code: program ? program.code : '',
    });
    const [programError, setProgramedError] = useState('');

    const [selectedDepartment, setSelectedDepartment] = useState({
        id: department ? department.id : null,
        name: department ? department.name : '',
        code: department ? department.code : '',
    });
    const [departmentError, setDepartmentedError] = useState('');

    // useEffect
    useEffect(() => {
        functionSetData(ledgers);
    }, []);

    // function
    const handleSelectedProgram = (selected) => {
        setSelectedProgram(selected);
    };

    const handleDeleteSelectedProgram = () => {
        setSelectedProgram({ id: null, name: '', code: '' });
    };

    const handleSelectedProject = (selected) => {
        setSelectedProject(selected);
    };

    const handleDeleteSelectedProject = () => {
        setSelectedProject({ id: null, name: '', code: '' });
    };

    const handleSelectedDepartment = (selected) => {
        setSelectedDepartment(selected);
    };

    const handleDeleteSelectedDepartment = () => {
        setSelectedDepartment({ id: null, name: '', code: '' });
    };

    const functionSetData = (ledgers) => {
        let tempReveneu = 0;
        let tempVariableCost = 0;
        let tempFixedCost = 0;
        let tempDepreciatedCost = 0;
        let tempOtherCost = 0;

        ledgers.map((ledger) => {
            if (ledger.code >= '400000000' && ledger.code <= '499999999') {
                tempReveneu += parseInt(ledger.total);
            }
            if (ledger.code >= '500000000' && ledger.code <= '599999999') {
                tempVariableCost += parseInt(ledger.total);
            }
            if (ledger.code >= '600000000' && ledger.code <= '699999999') {
                tempFixedCost += parseInt(ledger.total);
            }
            if (ledger.code >= '700000000' && ledger.code <= '799999999') {
                tempDepreciatedCost += parseInt(ledger.total);
            }
            if (ledger.code >= '800000000' && ledger.code <= '899999999') {
                tempOtherCost += parseInt(ledger.total);
            }
        });
        setDataLedgers(ledgers);
        setRevenue(tempReveneu * -1);
        setCost({
            variable: tempVariableCost,
            fixed: tempFixedCost,
            depreciated: tempDepreciatedCost,
            other: tempOtherCost,
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
            only: ['ledgers'],
            data: {
                startDate,
                endDate,
                program: selectedProgram.id,
                project: selectedProject.id,
                department: selectedDepartment.id,
            },
            onBefore: (visit) => {
                visit.completed ? setIsLoading(false) : setIsLoading(true);
            },
            onSuccess: (page) => {
                functionSetData(page.props.ledgers);
            },
            onError: (err) => {
                console.log(err);
            },
            onFinish: (visit) => {
                visit.completed ? setIsLoading(false) : setIsLoading(true);
            },
            preserveState: true,
        });
    };

    const handlePrint = () => {
        window.print();
    };
    return (
        <>
            <Head
                title={`Laporan ${ type > 0 ? "Surplus Defisit" : "Laba Rugi" } Periode : ${dayjs(startDate).locale('id').format('MMMM DD, YYYY')} - ${dayjs(endDate).format('MMMM DD, YYYY')}`}
            />

            <div className='sm:pt-0 pb-16 pt-12'>
                <div className='bg-white py-2 sm:pt-0 px-5'>
                    {/* Nav Title */}
                    <div className='flex sm:flex-row justify-between gap-2 print:hidden'>
                        <div className='px-3 my-auto flex gap-3'>
                            <div className='my-auto'>
                            <   select
                                    className='w-full rounded-lg border-gray-300'
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}>
                                    <option value={0}>Laba Rugi</option>
                                    <option value={1}>Surplus Defisit</option>
                                </select>
                            </div>
                            <div className='my-auto'>
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
                            <div className='my-auto'>
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
                            <div className='my-auto'>
                                <PrimaryButton
                                    disabled={!startDate || !endDate || startDate > endDate || isLoading}
                                    onClick={handleReload}>
                                    Filter
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className='text-end px-3 hidden sm:block'>
                            <SecondaryButton onClick={handlePrint}>
                                <div className='flex gap-2'>
                                    <div className='my-auto'>
                                        <FaPrint />
                                    </div>
                                    <div className='my-auto'>Print</div>
                                </div>
                            </SecondaryButton>
                        </div>
                        <div className='fixed sm:hidden bottom-2 right-2'>
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
                    <Disclosure as='div' className='mt-3 print:hidden'>
                        {({ open }) => (
                            <>
                                <Transition
                                    enter='transition duration-100 ease-out'
                                    enterFrom='transform scale-95 opacity-0'
                                    enterTo='transform scale-100 opacity-100'
                                    leave='transition duration-75 ease-out'
                                    leaveFrom='transform scale-100 opacity-100'
                                    leaveTo='transform scale-95 opacity-0'>
                                    <Disclosure.Panel>
                                        {programs.length > 0 || projects.length > 0 || departments.length ? (
                                            <div className='flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3'>
                                                {programs.length > 0 && (
                                                    <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                                                        <div>
                                                            <InputLabel value={'Program Kegiatan'} htmlFor='program' />
                                                        </div>
                                                        <div className='flex w-full relative'>
                                                            <div className='w-5/6'>
                                                                <ClientSelectInput
                                                                    resources={programs}
                                                                    selected={selectedProgram}
                                                                    setSelected={(selected) =>
                                                                        handleSelectedProgram(selected)
                                                                    }
                                                                    maxHeight='max-h-40'
                                                                    placeholder='Cari Program Kegiatan'
                                                                    isError={programError ? true : false}
                                                                    id='program'
                                                                />
                                                                {selectedProgram.id && (
                                                                    <span className='text-xs absolute'>
                                                                        Kode: {selectedProgram.code}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {selectedProgram.id && (
                                                                <div className='w-1/6 my-auto'>
                                                                    <button
                                                                        type='button'
                                                                        className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                                        onClick={handleDeleteSelectedProgram}>
                                                                        <IoTrashOutline />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {projects.length > 0 && (
                                                    <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                                                        <div>
                                                            <InputLabel value={'Proyek'} htmlFor='project' />
                                                        </div>
                                                        <div className='flex w-full relative'>
                                                            <div className='w-5/6'>
                                                                <ClientSelectInput
                                                                    resources={projects}
                                                                    selected={selectedProject}
                                                                    setSelected={(selected) =>
                                                                        handleSelectedProject(selected)
                                                                    }
                                                                    maxHeight='max-h-40'
                                                                    placeholder='Cari Proyek'
                                                                    isError={projectError ? true : false}
                                                                    id='project'
                                                                />
                                                                {selectedProject.id && (
                                                                    <span className='text-xs absolute'>
                                                                        Kode: {selectedProject.code}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {selectedProject.id && (
                                                                <div className='w-1/6 my-auto'>
                                                                    <button
                                                                        type='button'
                                                                        className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                                        onClick={handleDeleteSelectedProject}>
                                                                        <IoTrashOutline />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {departments.length > 0 && (
                                                    <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                                                        <div>
                                                            <InputLabel value={'Departemen'} htmlFor='department' />
                                                        </div>
                                                        <div className='flex w-full relative'>
                                                            <div className='w-5/6'>
                                                                <ClientSelectInput
                                                                    resources={departments}
                                                                    selected={selectedDepartment}
                                                                    setSelected={(selected) =>
                                                                        handleSelectedDepartment(selected)
                                                                    }
                                                                    maxHeight='max-h-40'
                                                                    placeholder='Cari Departemen'
                                                                    isError={departmentError ? true : false}
                                                                    id='department'
                                                                />
                                                                {selectedDepartment.id && (
                                                                    <span className='text-xs absolute'>
                                                                        Kode: {selectedDepartment.code}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {selectedDepartment.id && (
                                                                <div className='w-1/6 my-auto'>
                                                                    <button
                                                                        type='button'
                                                                        className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                                        onClick={handleDeleteSelectedDepartment}>
                                                                        <IoTrashOutline />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div className='flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3'>
                                            <div className='form-control'>
                                                <label className='label cursor-pointer gap-2' htmlFor='checkbox'>
                                                    <input
                                                        type='checkbox'
                                                        className='checkbox'
                                                        id='checkbox'
                                                        value={filterData.accountCode}
                                                        onChange={() =>
                                                            setFilterData({
                                                                ...filterData.accountCode,
                                                                accountCode: !filterData.accountCode,
                                                            })
                                                        }
                                                        checked={filterData.accountCode}
                                                    />
                                                    <span className='label-text'>Tampilkan Kode Akun</span>
                                                </label>
                                            </div>
                                        </div>
                                    </Disclosure.Panel>
                                </Transition>
                                <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75'>
                                    <div className='flex justify-center w-full gap-3'>
                                        <span>Tampilkan Lebih Banyak</span>
                                        <IoChevronUpCircleOutline
                                            className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-slate-500`}
                                        />
                                    </div>
                                </Disclosure.Button>
                            </>
                        )}
                    </Disclosure>

                    {/* Title Print*/}
                    <div className='uppercase pt-9 pb-3 border-b hidden print:flex print:justify-between'>
                        <div className='w-1/2 text-2xl my-auto'>Laporan { type > 0 ? "Surplus Defisit" : "Laba Rugi"}</div>
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
                        <div className='text-end italic '>
                            Periode : {dayjs(startDate).locale('id').format('MMMM DD, YYYY')} -{' '}
                            {dayjs(endDate).locale('id').format('MMMM DD, YYYY')}
                        </div>
                        <div className='text-xs my-auto'>
                            {(programs.length > 0 || projects.length > 0 || departments.length > 0) ? (
                                <div>
                                    {selectedProgram.name && (
                                        <div>
                                            Program Kegiatan: {selectedProgram.code}-
                                            {selectedProgram.name.toUpperCase()}
                                        </div>
                                    )}
                                    {selectedProject.name && (
                                        <div>
                                            Proyek : {selectedProject.code}-{selectedProject.name.toUpperCase()}
                                        </div>
                                    )}
                                    {selectedDepartment.name && (
                                        <div>
                                            Departemen : {selectedDepartment.code}-
                                            {selectedDepartment.name.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="my-2 space-y-3 mx-3 print:font-['Open_Sans'] overflow-auto">
                        <div className='sm:w-3/4 w-[550px] print:w-full'>
                            {revenue > 0 && (
                                <LostProfitContent
                                    ledgers={dataLedgers}
                                    title={'Pendapatan'}
                                    showCode={filterData.accountCode}
                                    type={'revenue'}
                                    amount={revenue}
                                />
                            )}
                            {cost.variable > 0 && (
                                <LostProfitContent
                                    ledgers={dataLedgers}
                                    title={'Biaya Variabel'}
                                    showCode={filterData.accountCode}
                                    type={'variable-cost'}
                                    amount={cost.variable}
                                />
                            )}
                            {cost.fixed > 0 && (
                                <LostProfitContent
                                    ledgers={dataLedgers}
                                    title={'Biaya Operasional'}
                                    showCode={filterData.accountCode}
                                    type={'fixed-cost'}
                                    amount={cost.fixed}
                                />
                            )}
                            {cost.depreciated > 0 && (
                                <LostProfitContent
                                    ledgers={dataLedgers}
                                    title={'Biaya Penyusutan'}
                                    showCode={filterData.accountCode}
                                    type={'depreciated-cost'}
                                    amount={cost.depreciated}
                                />
                            )}
                            {cost.other > 0 && (
                                <LostProfitContent
                                    ledgers={dataLedgers}
                                    title={'Biaya Lain'}
                                    showCode={filterData.accountCode}
                                    type={'other-cost'}
                                    amount={cost.other}
                                />
                            )}

                            {/* Summary */}
                            {dataLedgers.length > 0 && (
                                <div className='mt-5'>
                                    <div className='flex w-full justify-between py-2 font-bold'>
                                        <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>{ type > 0 ? "Surplus" : "Laba" } Kotor</div>
                                        <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                            <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                            <div className='w-3/4 print:w-2/4 text-end'>
                                                {formatNumber(revenue - cost.variable)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex w-full justify-between py-2 font-bold'>
                                        <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>{ type > 0 ? "Surplus" : "Laba" } Bersih</div>
                                        <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                            <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                            <div className='w-3/4 print:w-2/4 text-end'>
                                                {formatNumber(revenue - (cost.variable + cost.fixed))}
                                            </div>
                                        </div>
                                    </div>
                                    {(cost.depreciated > 0 || cost.other > 0) && (
                                        <div className='flex w-full justify-between py-2 font-bold'>
                                            <div className='w-5/12 print:w-8/12 uppercase flex gap-2'>
                                                { type > 0 ? "Surplus" : "Laba" } Bersih Setelah Biaya Lain
                                            </div>
                                            <div className='w-2/12 print:w-4/12 text-center flex justify-end gap-3'>
                                                <div className='w-1/4 print:w-2/4 text-end'>Rp. </div>
                                                <div className='w-3/4 print:w-2/4 text-end'>
                                                    {formatNumber(
                                                        revenue - (cost.variable + cost.fixed + cost.depreciated + cost.other)
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

LostProfit.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Laporan Laba Rugi</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Laporan Laba Rugi'
        backLink={
            <Link href={route('report', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('report', page.props.organization.id)}>Laporan</Link>
                    </li>
                    <li>Laporan Laba Rugi</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
