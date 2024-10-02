import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoChevronUpCircleOutline, IoTrashOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import FormInput from '@/Components/FormInput';
import { ToastContainer, toast } from 'react-toastify';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Datepicker from 'react-tailwindcss-datepicker';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import { NumericFormat } from 'react-number-format';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { Disclosure, Transition } from '@headlessui/react';
import dayjs from 'dayjs';

export default function Create({ organization, newRef, date, cashAccounts, projects, programs, departments }) {
    // state
    const [selectedDebitAccount, setSelectedDebitAccount] = useState({ id: null, name: '', code: '', is_cash: true });

    const [selectedCreditAccount, setSelectedCreditAccount] = useState({ id: null, name: '', code: '', is_cash: true });

    const [selectedProject, setSelectedProject] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [selectedProgram, setSelectedProgram] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [selectedDepartment, setSelectedDepartment] = useState({
        id: null,
        name: '',
        code: '',
    });

    const [dateValue, setDateValue] = useState({
        startDate: date,
        endDate: date,
    });

    const { data, setData, post, reset, errors, setError, processing } = useForm({
        date: date,
        no_ref: newRef,
        description: 'Mutasi Kas',
        program_id: null,
        project_id: null,
        department_id: null,
        is_approved: true,
        value: 0,
        accountDebit: null,
        accountCredit: null,
    });

    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevDate = usePrevious(dateValue);

    // useEffect
    useEffect(() => {
        if (prevDate !== undefined) {
            reloadNewRef();
        }
    }, [debounceDateValue]);

    // function
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('cashflow.cash-mutation.post', organization.id), {
            onSuccess: (page) => {
                setDefault(page.props);
                toast.success(`Mutasi Kas Berhasil Ditambahkan`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            onError: (errors) => {
                // console.log(errors);
            },
            preserveScroll: true,
        });
    };

    const setDefault = ({ newRef, date }) => {
        setData({
            date: date,
            no_ref: newRef,
            description: 'Mutasi Kas',
            program_id: null,
            project_id: null,
            department_id: null,
            is_approved: true,
            value: 0,
            accountDebit: null,
            accountCredit: null,
        });

        setDateValue({
            startDate: date,
            endDate: date,
        });

        setSelectedDebitAccount({ id: null, name: '', code: '', is_cash: true });

        setSelectedCreditAccount({ id: null, name: '', code: '', is_cash: true });

        setSelectedProject({ id: null, name: '', code: '' });

        setSelectedProgram({ id: null, name: '', code: '' });

        setSelectedDepartment({ id: null, name: '', code: '' });
    };

    const reloadNewRef = () => {
        router.reload({
            only: ['newRef'],
            data: {
                date: dayjs(dateValue.startDate).format('YYYY-MM-DD'),
            },
            onSuccess: (page) => {
                setData('no_ref', page.props.newRef);
            },
        });
    };

    const handleSelectedAccount = (selected, type) => {
        if (type == 'debit') {
            setSelectedDebitAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
            setData('accountDebit', selected.id);
        } else {
            setSelectedCreditAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
            setData('accountCredit', selected.id);
        }
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
        setData('date', dayjs(dateValue.startDate).format('YYYY-MM-DD'));
    };

    const handleSelectedProgram = (selected) => {
        setSelectedProgram(selected);
        setData('program_id', selected.id);
    };

    const handleDeleteSelectedProgram = () => {
        setSelectedProgram({ id: null, name: '', code: '' });
        setData('program_id', null);
    };

    const handleSelectedProject = (selected) => {
        setSelectedProject(selected);
        setData('project_id', selected.id);
    };

    const handleDeleteSelectedProject = () => {
        setSelectedProject({ id: null, name: '', code: '' });
        setData('project_id', null);
    };

    const handleSelectedDepartment = (selected) => {
        setSelectedDepartment(selected);
        setData('department_id', selected.id);
    };

    const handleDeleteSelectedDepartment = () => {
        setSelectedDepartment({ id: null, name: '', code: '' });
        setData('department_id', null);
    };

    const handleChangeValue = (value) => {
        const { floatValue } = value;
        setData('value', floatValue);
    };

    return (
        <>
            <Head title='Tambah Mutasi Kas' />
            <ToastContainer />

            <FormInput onSubmit={handleSubmit}>
                <div className='w-full sm:mt-2 sm:py-5'>
                    <div className='sm:mx-auto px-3 sm:px-5'>
                        <div className='flex flex-col sm:flex-row justify-between gap-3'>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Tanggal'} />
                                </div>
                                <div>
                                    <Datepicker
                                        value={dateValue}
                                        onChange={handleDateValueChange}
                                        inputClassName={errors?.date && 'border-red-500 rounded-lg'}
                                        useRange={false}
                                        asSingle={true}
                                        placeholder='Tanggal'
                                        id='date'
                                        displayFormat='MMMM DD, YYYY'
                                    />
                                </div>
                            </div>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'No. Ref'} htmlFor='no_ref' />
                                </div>
                                <div>
                                    <TextInput
                                        id='no_ref'
                                        className={`w-full ${errors.no_ref && 'border-red-500'}`}
                                        value={data.no_ref}
                                        onChange={(e) => setData('no_ref', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='sm:w-1/2 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Deskripsi'} htmlFor='description' />
                                </div>
                                <div>
                                    <TextInput
                                        id='description'
                                        className='w-full'
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {(projects.length > 0 || programs.length > 0 || departments.length > 0) && (
                            <div className='mt-3'>
                                <Disclosure>
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
                                                    <div className='flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3'>
                                                        {programs.length > 0 && (
                                                            <div className='sm:w-1/3 w-full text-slate-900 space-y-2'>
                                                                <div>
                                                                    <InputLabel
                                                                        value={'Program Kegiatan'}
                                                                        htmlFor='program'
                                                                    />
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
                                                                            id='program'
                                                                            isError={false}
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
                                                                            id='project'
                                                                            isError={false}
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
                                                                    <InputLabel
                                                                        value={'Departemen'}
                                                                        htmlFor='department'
                                                                    />
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
                                                                            id='department'
                                                                            isError={false}
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
                                                                                onClick={
                                                                                    handleDeleteSelectedDepartment
                                                                                }>
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
                            </div>
                        )}
                        <div className='flex flex-col sm:flex-row justify-between gap-3 mt-7'>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Dari Akun Kas'} htmlFor='credit_account' />
                                </div>
                                <div>
                                    <ClientSelectInput
                                        resources={cashAccounts}
                                        selected={selectedCreditAccount}
                                        setSelected={(selected) => handleSelectedAccount(selected, 'credit')}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Akun'
                                        isError={errors.accountCredit ? true : false}
                                        id='credit_account'
                                        notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-ledger.account', {organization:organization.id})}>Buat Baru ?</Link></span>}

                                    />
                                    {selectedDebitAccount?.code && (
                                        <div className='absolute text-xs'>Kode: {selectedDebitAccount.code}</div>
                                    )}
                                </div>
                            </div>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Ke Akun Kas'} htmlFor='debit_account' />
                                </div>
                                <div>
                                    <ClientSelectInput
                                        resources={cashAccounts}
                                        selected={selectedDebitAccount}
                                        setSelected={(selected) => handleSelectedAccount(selected, 'debit')}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Akun'
                                        isError={errors.accountCredit ? true : false}
                                        id='debit_account'
                                        notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-ledger.account', {organization:organization.id})}>Buat Baru ?</Link></span>}
                                    />
                                    {selectedDebitAccount?.code && (
                                        <div className='absolute text-xs'>Kode: {selectedDebitAccount.code}</div>
                                    )}
                                </div>
                            </div>

                            <div className='sm:w-1/2 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Jumlah'} htmlFor='value' />
                                </div>
                                <div>
                                    <NumericFormat
                                        value={data.value}
                                        customInput={TextInput}
                                        onValueChange={(values) => handleChangeValue(values)}
                                        thousandSeparator={true}
                                        className='text-end w-full'
                                        prefix={'IDR '}
                                        id='value'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='md:flex font-bold gap-3'>
                            <div className='sm:w-6/12 hidden sm:block'></div>
                            <div className='md:w-6/12 flex border-t py-3 gap-2 px-3'>
                                <div className='form-control'>
                                    <label className='label cursor-pointer gap-2' htmlFor='checkbox'>
                                        <input
                                            type='checkbox'
                                            className='checkbox'
                                            id='checkbox'
                                            value={!data.is_approved}
                                            onChange={() => setData('is_approved', !data.is_approved)}
                                            checked={!data.is_approved}
                                        />
                                        <span className='label-text'>Simpan Ke Dalam Draft</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
                            <div className='w-full sm:w-1/12 my-auto text-center'>
                                <Link href={route('data-ledger.journal', organization.id)}>
                                    <SecondaryButton className='w-full'>
                                        <div className='text-center w-full'>Batal</div>
                                    </SecondaryButton>
                                </Link>
                            </div>

                            {data.value > 0 && data.accountDebit && data.accountCredit && data.date && data.no_ref && (
                                <div className='w-full sm:w-1/12 text-center'>
                                    <PrimaryButton className='w-full' disabled={processing}>
                                        <div className='text-center w-full'>Tambah</div>
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </FormInput>
        </>
    );
}

Create.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Tambah Mutasi Kas</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Mutasi Kas'
        backLink={
            <Link href={route('cashflow.cash-mutation', page.props.organization.id)}>
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
                        <Link href={route('cashflow.cash-mutation', page.props.organization.id)}>Mutasi Kas</Link>
                    </li>
                    <li>Tambah Mutasi Kas</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
