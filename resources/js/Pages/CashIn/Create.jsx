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
import { Disclosure, Transition } from '@headlessui/react';
import ContactSelectInput from '@/Components/SelectInput/ContactSelectInput';
import formatNumber from '@/Utils/formatNumber';

export default function Create({
    organization,
    newRef,
    date,
    accounts,
    cashAccounts,
    projects,
    programs,
    departments,
    contacts,
}) {
    
    // state
    const [selectedAccount, setSelectedAccount] = useState([{ id: null, name: '', code: '' }]);

    const [selectedContact, setSelectedContact] = useState({ id: null, name: '', phone: '' });

    const [contactError, setContactError] = useState('');

    const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

    const [cashAccountError, setCashAccountError] = useState('');

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

    const [dateValue, setDateValue] = useState({
        startDate: date,
        endDate: date,
    });

    const [value, setValue] = useState(0);

    const { data, setData, post, reset, errors, setError, processing } = useForm({
        date: date,
        contact_id: null,
        no_ref: newRef,
        description: 'Kas Masuk',
        program_id: null,
        project_id: null,
        department_id: null,
        is_approved: true,
        cash_account_id: null,
        accounts: [{ id: null, name: '', code: '', value: 0, is_cash: false }],
    });

    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevDate = usePrevious(dateValue);

    // useEffect
    useEffect(() => {
        if (prevDate !== undefined) {
          reloadNewRef();
        }
    }, [debounceDateValue]);

    useEffect(() => {
        let tempValue = data.accounts.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.value;
        }, 0);

        setValue(tempValue);
    }, [data]);

    // function
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('cashflow.cash-in.post', organization.id), {
            onSuccess: (page) => {
                setDefault(page.props);
                toast.success(`Kas Masuk Berhasil Ditambahkan`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            onError: (errors) => {
                setCashAccountError(errors.cash_account_id);

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
            },
        });
    };

    const setDefault = ({ newRef, date }) => {
        setData({
            date: date,
            contact_id: null,
            no_ref: newRef,
            description: 'Kas Masuk',
            program_id: null,
            project_id: null,
            department_id: null,
            is_approved: true,
            cash_account_id: null,
            accounts: [{ id: null, name: '', code: '', value: 0, is_cash: false }],
        });

        setDateValue({
            startDate: date,
            endDate: date,
        });

        setSelectedAccount([{ id: null, name: '', code: '' }]);

        setSelectedContact({ id: null, name: '', phone: '' });

        setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });

        setSelectedProject({ id: null, name: '', code: '' });

        setSelectedProgram({ id: null, name: '', code: '' });

        setSelectedDepartment({ id: null, name: '', code: '' });
    };

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

    const handleSelectedContact = (selected) => {
        setSelectedContact({ id: selected.id, name: selected.name, phone: selected.phone });
        let temp = data;
        temp = {
            ...temp,
            contact_id: selected.id,
            description: `Kas Masuk dari ${selected.name.toUpperCase()}`,
        };
        setData(temp);
    };

    const handleSelectedCashAccount = (selected) => {
        setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
        setData('cash_account_id', selected.id);
    };

    const handleSelectedAccount = (selected, index) => {
        const temp = [...selectedAccount];
        const tempData = [...data.accounts];

        temp[index] = selected;
        tempData[index] = {
            ...tempData[index],
            id: selected.id,
            name: selected.name,
            code: selected.code,
            is_cash: selected.is_cash,
        };
        setSelectedAccount(temp);
        setData('accounts', tempData);
    };

    const handleChangeValue = (values, index) => {
        const { value } = values;
        const tempData = [...data.accounts];

        tempData[index] = { ...tempData[index], value: parseInt(value) };
        setData('accounts', tempData);
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
        setData('date', newValue.startDate);
    };

    const handleAddAccount = () => {
        const tempDetail = [...data.accounts, { id: null, name: '', code: '', value: 0, is_cash: false }];
        setData('accounts', tempDetail);

        const tempSelectedAccount = [...selectedAccount, { id: null, name: '', code: '', is_cash: false }];
        setSelectedAccount(tempSelectedAccount);

        let tempAccountError = [...accountErrors];
        tempAccountError = [...tempAccountError, ''];
        setAccountError(tempAccountError);
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

    return (
        <>
            <Head title='Tambah Kas Masuk' />
            <ToastContainer />

            <FormInput onSubmit={handleSubmit}>
                <div className='w-full sm:mt-2 sm:py-5'>
                    <div className='sm:mx-auto px-3 sm:px-5'>
                        <div className='flex flex-col sm:flex-row justify-between gap-3'>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Nama Kontak'} htmlFor='contact' />
                                </div>
                                <div>
                                    <ContactSelectInput
                                        resources={contacts}
                                        selected={selectedContact}
                                        setSelected={(selected) => handleSelectedContact(selected)}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Kontak'
                                        isError={errors.contact_id ? true : false}
                                        id='contact'
                                    />
                                </div>
                            </div>
                            <div className='sm:w-1/4 w-full text-slate-900 space-y-2'>
                                <div>
                                    <InputLabel value={'Ke Akun Kas'} htmlFor='cash_account' />
                                </div>
                                <div>
                                    <ClientSelectInput
                                        resources={cashAccounts}
                                        selected={selectedCashAccount}
                                        setSelected={(selected) => handleSelectedCashAccount(selected)}
                                        maxHeight='max-h-40'
                                        placeholder='Cari Akun'
                                        isError={errors.cash_account_id ? true : false}
                                        id='cash_account'
                                        contactFilter={contactFilter || ''}
                                    />
                                    {selectedCashAccount?.code && (
                                        <div className='absolute text-xs'>Kode: {selectedCashAccount.code}</div>
                                    )}
                                </div>
                            </div>
                            <div className='sm:w-1/2 w-full text-slate-900 space-y-2'></div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-3 mt-7'>
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
                        <div className='mt-5'>
                            <div className='w-full'>
                                <div className='md:flex font-bold gap-3 border-b py-3 hidden'>
                                    <div className='w-5/12'>AKUN</div>
                                    <div className='w-3/12 text-end'></div>
                                    <div className='w-3/12 text-end'>NILAI</div>
                                    <div className='w-1/12 text-center'>#</div>
                                </div>
                                {data.accounts.map((account, index) => (
                                    <div
                                        className='md:flex gap-3 py-3 mt-2 space-y-2 border md:border-none rounded-lg border-slate-900 px-3'
                                        key={index}>
                                        <div className='md:hidden text-slate-800'>Baris : {index + 1}</div>
                                        <div className='md:w-5/12 w-full relative'>
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
                                        <div className='md:w-3/12 w-full text-end my-auto'></div>
                                        <div className='md:w-3/12 w-full text-end my-auto'>
                                            <NumericFormat
                                                value={account.value}
                                                customInput={TextInput}
                                                onValueChange={(values) => handleChangeValue(values, index)}
                                                thousandSeparator={true}
                                                className='text-end w-full border'
                                                prefix={'IDR '}
                                            />
                                        </div>
                                        <div className='md:w-1/12 w-full text-center my-auto'>
                                            <button
                                                type='button'
                                                className='md:text-red-500 text-white bg-red-500 md:bg-white text-xl hover:bg-slate-200 rounded-full p-2 w-full'
                                                onClick={() => handleDeleteAccount(index)}>
                                                <div className='text-center'>
                                                    <IoTrashOutline className='text-center w-full' />
                                                </div>
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
                            <div className='md:w-7/12 flex border-t py-3 gap-12 px-3'>
                                <div className='w-1/2'>TOTAL </div>
                                <div className={`w-1/2 text-end`}>IDR {formatNumber(value)}</div>
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

                            {value > 0 && (
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
        header={<Header>Tambah Kas Masuk</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Kas Masuk'
        backLink={
            <Link href={route('cashflow.cash-in', page.props.organization.id)}>
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
                        <Link href={route('cashflow.cash-in', page.props.organization.id)}>Kas Masuk</Link>
                    </li>
                    <li>Tambah Kas Masuk</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
