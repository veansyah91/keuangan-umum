import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoAddOutline, IoArrowBackOutline, IoChevronUpCircleOutline, IoTrashOutline } from 'react-icons/io5';
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
import formatNumber from '@/Utils/formatNumber';
import { Disclosure, Transition } from '@headlessui/react';

export default function Create({ organization, newRef, date, accounts, projects, programs, departments }) {
    // state
    const [selectedAccount, setSelectedAccount] = useState([
        { id: null, name: '', code: '', is_cash: false },
        { id: null, name: '', code: '', is_cash: false },
    ]);

    const [accountErrors, setAccountError] = useState(['', '']);

    const [selectedProject, setSelectedProject] = useState({
        id: null,
        name: '',
        code: '',
    });
    const [projectError, setProjectedError] = useState('');

    const [selectedProgram, setSelectedProgram] = useState({
        id: null,
        name: '',
        code: '',
    });
    const [programError, setProgramedError] = useState('');

    const [selectedDepartment, setSelectedDepartment] = useState({
        id: null,
        name: '',
        code: '',
    });
    const [departmentError, setDepartmentedError] = useState('');

    const { data, setData, post, reset, errors, setError, processing } = useForm({
        date: date,
        no_ref: newRef,
        description: 'Jurnal Umum',
        is_approved: true,
        program_id: null,
        project_id: null,
        department_id: null,
        accounts: [
            { id: null, name: '', code: '', debit: 0, credit: 0, is_cash: false },
            { id: null, name: '', code: '', debit: 0, credit: 0, is_cash: false },
        ],
    });

    const [dateValue, setDateValue] = useState({
        startDate: date,
        endDate: date,
    });

    const [debit, setDebit] = useState(0);
    const [credit, setCredit] = useState(0);

    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevDate = usePrevious(dateValue);

    // useUffect
    useEffect(() => {
        if (prevDate !== undefined) {
            reloadNewRef();
        }
    }, [debounceDateValue]);

    useEffect(() => {
        let tempDebit = data.accounts.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.debit;
        }, 0);
        setDebit(tempDebit);

        let tempCredit = data.accounts.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.credit;
        }, 0);
        setCredit(tempCredit);
    }, [data]);

    // function
    const reloadNewRef = () => {
        router.reload({
            only: ['newRef'],
            data: {
                date: dateValue.startDate,
            },
            onSuccess: (page) => {
                setData('no_ref', page.props.newRef);
            },
        });
    };

    const handleChangeDebit = (values, index) => {
        const { value } = values;
        const tempDetail = [...data.accounts];
        tempDetail[index] = {
            ...tempDetail[index],
            debit: parseInt(value),
        };
        setData('accounts', tempDetail);
    };

    const handleChangeCredit = (values, index) => {
        const { value } = values;
        const tempDetail = [...data.accounts];
        tempDetail[index] = {
            ...tempDetail[index],
            credit: parseInt(value),
        };
        setData('accounts', tempDetail);
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
        setData('date', `${newValue.startDate.getFullYear()}-${newValue.startDate.getMonth() + 1}-${newValue.startDate.getDate()}`);
    };

    const handleDeleteAccount = (index) => {
        const tempDetail = [...data.accounts];
        tempDetail.splice(index, 1);
        setData('accounts', tempDetail);

        const tempSelectedAccount = [...selectedAccount];
        tempSelectedAccount.splice(index, 1);
        setSelectedAccount(tempSelectedAccount);

        let tempAccountError = [...accountErrors];
        tempAccountError.splice(index, 1);
        setAccountError(tempAccountError);
    };

    const handleAddAccount = () => {
        const tempDetail = [
            ...data.accounts,
            { account_id: null, account_name: '', account_code: '', debit: 0, credit: 0, is_cash: false },
        ];
        setData('accounts', tempDetail);

        const tempSelectedAccount = [...selectedAccount, { id: null, name: '', code: '', is_cash: false }];
        setSelectedAccount(tempSelectedAccount);

        let tempAccountError = [...accountErrors];
        tempAccountError = [...tempAccountError, ''];
        setAccountError(tempAccountError);
    };

    const handleSelectedAccount = (selected, index) => {
        const temp = [...selectedAccount];
        temp[index] = selected;
        setSelectedAccount(temp);

        const tempData = [...data.accounts];
        tempData[index] = {
            ...tempData[index],
            id: temp[index].id,
            code: temp[index].code,
            name: temp[index].name,
            is_cash: temp[index].is_cash,
        };
        setData('accounts', tempData);

        let tempAccountError = [...accountErrors];
        tempAccountError[index] = '';
        setAccountError(tempAccountError);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('data-ledger.journal.store', organization.id), {
            onSuccess: (page) => {
                setDefault(page.props);
                toast.success(`Jurnal Berhasil Ditambahkan`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            onError: (errors) => {
                const arrayOfObjects = Object.entries(errors).map(([key, value]) => ({ key, value }));

                let tempAccountErrors = [];

                for (let index = 0; index < accountErrors.length; index++) {
                    let errorValue = '';
                    arrayOfObjects.map((data) => {
                        if (data.key.split('.').length === 3) {
                            if (data.key == `accounts.${index}.id`) {
                                errorValue = 'required';
                            }
                        }
                    });
                    tempAccountErrors = [...tempAccountErrors, errorValue];
                }
                setAccountError(tempAccountErrors);

                errors?.no_ref &&
                    toast.error(errors.no_ref, {
                        position: toast.POSITION.TOP_CENTER,
                    });

                errors?.empty &&
                    toast.error(`Nilai Debit Dan Kredit Tidak Boleh Kosong`, {
                        position: toast.POSITION.TOP_CENTER,
                    });

                errors?.date &&
                    toast.error(errors.date, {
                        position: toast.POSITION.TOP_CENTER,
                    });
            },
            preserveScroll: true,
        });
    };

    const setDefault = (props) => {
        setSelectedAccount([
            { id: null, name: '', code: '', is_cash: false },
            { id: null, name: '', code: '', is_cash: false },
        ]);
        setSelectedDepartment({ id: null, name: '', code: '' });
        setSelectedProject({ id: null, name: '', code: '' });
        setSelectedProgram({ id: null, name: '', code: '' });

        setData({
            date: props.date,
            no_ref: props.newRef,
            description: 'Jurnal Umum',
            is_approved: true,
            program_id: null,
            project_id: null,
            department_id: null,
            accounts: [
                { id: null, name: '', code: '', debit: 0, credit: 0, is_cash: false },
                { id: null, name: '', code: '', debit: 0, credit: 0, is_cash: false },
            ],
        });
        setDateValue({
            startDate: props.date,
            endDate: props.date,
        });
    };

    return (
        <>
            <Head title='Tambah Jurnal Umum' />
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
                        {/* Account */}
                        <div className='mt-5 overflow-x-auto'>
                            <div className='w-[600px] md:w-full'>
                                <div className='flex font-bold gap-3 border-b py-3'>
                                    <div className='w-5/12'>AKUN</div>
                                    <div className='w-3/12 text-end'>DEBIT</div>
                                    <div className='w-3/12 text-end'>KREDIT</div>
                                    <div className='w-1/12 text-center'>#</div>
                                </div>
                                {data.accounts.map((account, index) => (
                                    <div className='flex gap-3 py-3 mt-2' key={index}>
                                        <div className='w-5/12 relative'>
                                            <ClientSelectInput
                                                resources={accounts}
                                                selected={selectedAccount[index]}
                                                setSelected={(selected) => handleSelectedAccount(selected, index)}
                                                maxHeight='max-h-40'
                                                placeholder='Cari Akun'
                                                isError={accountErrors[index] ? true : false}
                                            />
                                            {selectedAccount[index]?.code && (
                                                <div className='absolute text-xs'>
                                                    Kode: {selectedAccount[index].code}
                                                </div>
                                            )}
                                        </div>
                                        <div className='w-3/12 text-end my-auto'>
                                            <NumericFormat
                                                value={account.debit}
                                                customInput={TextInput}
                                                onValueChange={(values) => handleChangeDebit(values, index)}
                                                thousandSeparator={true}
                                                className='text-end w-full'
                                                prefix={'IDR '}
                                            />
                                        </div>
                                        <div className='w-3/12 text-end my-auto'>
                                            <NumericFormat
                                                value={account.credit}
                                                customInput={TextInput}
                                                onValueChange={(values) => handleChangeCredit(values, index)}
                                                thousandSeparator={true}
                                                className='text-end w-full'
                                                prefix={'IDR '}
                                            />
                                        </div>
                                        <div className='w-1/12 text-center my-auto'>
                                            <button
                                                type='button'
                                                className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                                                onClick={() => handleDeleteAccount(index)}>
                                                <IoTrashOutline />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className='py-3 mt-4'>
                                    <button
                                        className='w-full border bg-slate-100 hover:bg-slate-200 text-slate-500 py-3 flex justify-center gap-2'
                                        type='button'
                                        onClick={handleAddAccount}>
                                        <div className='my-auto'>
                                            <IoAddOutline />
                                        </div>
                                        <div>Tambah Baris Baru</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='md:flex font-bold gap-3'>
                            <div className='w-5/12'></div>
                            <div className='md:w-7/12 w-full md:flex border-t py-3 gap-12 px-3'>
                                <div className='md:w-1/2 w-full font-bold flex gap-1'>
                                    <div className='w-1/2'>TOTAL DEBIT </div>
                                    <div className='w-1/2 text-end'>IDR {formatNumber(debit)}</div>
                                </div>
                                <div className='md:w-1/2 w-full font-bold flex gap-1'>
                                    <div className='w-1/2'>TOTAL KREDIT </div>
                                    <div className='w-1/2 text-end'>IDR {formatNumber(credit)}</div>
                                </div>
                            </div>
                        </div>
                        <div className='md:flex font-bold gap-3'>
                            <div className='w-5/12'></div>
                            <div className='md:w-7/12 flex border-t py-3 gap-12 px-3'>
                                <div className='w-1/2'>SELISIH </div>
                                <div className={`w-1/2 text-end ${Math.abs(debit - credit) > 0 && 'text-red-500'}`}>
                                    IDR {formatNumber(Math.abs(debit - credit))}
                                </div>
                            </div>
                        </div>
                        <div className='md:flex font-bold gap-3'>
                            <div className='w-5/12'></div>
                            <div className='md:w-7/12 flex border-t py-3 gap-2 px-3'>
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

                            {Math.abs(debit - credit) === 0 && Math.abs(debit + credit) !== 0 && (
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
        header={<Header>Tambah Jurnal Umum</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Jurnal Umum'
        backLink={
            <Link href={route('data-ledger.journal', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-ledger', page.props.organization.id)}>Buku Besar</Link>
                    </li>
                    <li className='font-bold'>
                        <Link href={route('data-ledger.journal', page.props.organization.id)}>Jurnal Umum</Link>
                    </li>
                    <li>Tambah Jurnal Umum</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
