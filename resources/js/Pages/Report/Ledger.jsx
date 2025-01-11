import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
import { IoArrowBackOutline, IoChevronUpCircleOutline, IoTrashOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaPrint } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import { Disclosure, Transition } from '@headlessui/react';
import LedgerContent from './Component/LedgerContent';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';

export default function Ledger({
    ledgers,
    accounts,
    startedValue,
    organization,
    startDateFilter,
    endDateFilter,
    departments,
    projects,
    programs,
    department,
    project,
    program,
    account,
}) {
    // state
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

    const [selectedAccount, setSelectedAccount] = useState({
        id: account ? account.id : null,
        name: account ? account.name : '',
        code: account ? account.code : '',
    });

    const [accountError, setAccountedError] = useState('');

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

    useEffect(() => {
        handleModifyLedgers(ledgers, startedValue);
    }, []);

    // function
    const handleSelectedAccount = (selected) => {
        // let tempData = [...selectedAccount];
        setSelectedAccount(selected);
    };

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
                program: selectedProgram.id,
                project: selectedProject.id,
                department: selectedDepartment.id,
                account: selectedAccount?.id,
            },
            onBefore: (visit) => {
                visit.completed ? setIsLoading(false) : setIsLoading(true);
            },
            onSuccess: (page) => {
                handleModifyLedgers(page.props.ledgers, page.props.startedValue);
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head
                title={`Laporan Buku Besar Periode : ${dayjs(startDate).format('MMMM DD, YYYY')} - ${dayjs(endDate).format('MMMM DD, YYYY')}`}
            />

            <div className='md:pt-0 pb-16 pt-12'>
                <div className='bg-white py-2 md:pt-0 px-5 space-y-2'>
                    {/* Nav Title */}
                    <div className='flex md:flex-row justify-between gap-2 print:hidden'>
                        <div className='px-3 my-auto flex flex-col md:flex-row gap-3 w-full md:w-2/3'>
                            <div className='my-auto w-full'>
                                <ClientSelectInput
                                    resources={accounts}
                                    selected={selectedAccount}
                                    setSelected={(selected) => handleSelectedAccount(selected)}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Akun'
                                    isError={accountError ? true : false}
                                    id='account'
                                />
                                {selectedAccount?.code && (
                                    <div className='absolute text-xs'>Kode: {selectedAccount?.code}</div>
                                )}
                            </div>
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
                                        !selectedAccount?.id ||
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

                    {programs.length > 0 || projects.length > 0 || departments.length ? (
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
                                            <div className='flex flex-col md:flex-row justify-start gap-3 md:py-5 mb-3'>
                                                {programs.length > 0 && (
                                                    <div className='md:w-1/3 w-full text-slate-900 space-y-2'>
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
                                                    <div className='md:w-1/3 w-full text-slate-900 space-y-2'>
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
                                                    <div className='md:w-1/3 w-full text-slate-900 space-y-2'>
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
                                        </Disclosure.Panel>
                                    </Transition>
                                    <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75'>
                                        <div className='flex justify-center w-full gap-3'>
                                            <span>Tampilkan Lebih {open ? 'Sedikit' : 'Banyak'}</span>
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
                    ) : (
                        ''
                    )}

                    <div className='md:hidden w-full print:hidden'>
                        <PrimaryButton
                            disabled={!selectedAccount?.id || !startDate || !endDate || startDate > endDate || isLoading}
                            onClick={handleReload}
                            className='w-full'>
                            <div className='text-center w-full'>Filter</div>
                        </PrimaryButton>
                    </div>

                    {/* Title Print*/}
                    <div className='uppercase pb-3 border-b hidden print:flex print:justify-between'>
                        <div className='w-1/2 text-2xl my-auto'>Laporan Buku Besar</div>
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
                        <div className='uppercase'>
                            Akun : {selectedAccount?.code} - {selectedAccount?.name}
                        </div>
                        <div className='text-end italic'>
                            Periode : {dayjs(startDate).format('MMMM DD, YYYY')} -{' '}
                            {dayjs(endDate).format('MMMM DD, YYYY')}
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
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='font-bold'>
                                        <td colSpan={5}>Nilai Awal</td>
                                        <td className='text-end'>IDR. {formatNumber(total.startValue)}</td>
                                    </tr>
                                    {dataLedgers.map((ledger, index) => (
                                        <LedgerContent ledger={ledger} key={index} />
                                    ))}
                                    <tr className='font-bold'>
                                        <td colSpan={5}>Nilai Akhir</td>
                                        <td className='text-end'>IDR. {formatNumber(total.endValue)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Ledger.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Laporan Buku Besar Per Akun</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Laporan Buku Besar Per Akun'
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
                    <li>Laporan Buku Besar Per Akun</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
