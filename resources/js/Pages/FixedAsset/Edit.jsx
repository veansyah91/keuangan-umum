import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline } from 'react-icons/io5';
import FormInput from '@/Components/FormInput';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import { NumericFormat } from 'react-number-format';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import dayjs from 'dayjs';

const depreciationValue = (value, lifetime, residue) => (lifetime > 0 ? Math.ceil((value - residue) / lifetime) : 0);

export default function Edit({
    organization,
    fixedAsset,
    fixedAssetCategory,
    newRef,
    date,
    accounts,
    fixedAssetCategories,
    creditAccount,
}) {
    // state
    const { data, setData, processing, patch, errors, setError, reset } = useForm({
        lifetime: '',
        name: '',
        code: '',
        residue: '',
        value: '',
        date: '',
        fixed_asset_category: '',
        credit_account: {
            id: null,
            is_cash: false,
            code: '',
        },
        depreciation_value: '',
        depreciation_accumulated: '',
        status: true,
    });

    const [dateValue, setDateValue] = useState({
        startDate: fixedAsset.date,
        endDate: fixedAsset.date,
    });

    const [debounceDateValue] = useDebounce(dateValue, 500);

    const prevDate = usePrevious(dateValue);

    const [selectedFixedAssetCategory, setSelectedFixedAssetCategory] = useState({
        id: fixedAssetCategory.id,
        name: fixedAssetCategory.name,
        lifetime: fixedAssetCategory.lifetime,
    });

    const [selectedAccount, setSelectedAccount] = useState({
        id: creditAccount.id,
        name: creditAccount.name,
        code: creditAccount.code,
        is_cash: creditAccount.is_cash,
    });

    // useEffect
    useEffect(() => {
        setData({
            lifetime: fixedAsset.lifetime,
            name: fixedAsset.name,
            code: fixedAsset.code,
            residue: fixedAsset.residue,
            value: fixedAsset.value,
            date: fixedAsset.date,
            fixed_asset_category: fixedAsset.fixed_asset_category_id,
            credit_account: {
                id: creditAccount.id,
                is_cash: creditAccount.is_cash,
                code: creditAccount.code,
            },
            depreciation_value: fixedAsset.depreciation_value,
            depreciation_accumulated: fixedAsset.depreciation_accumulated,
            status: fixedAsset.status,
        });
    }, []);

    useEffect(() => {
        if (prevDate !== undefined) {
            if (dateValue.startDate) {
                let inputDateFormatted = dayjs(dateValue.startDate);
                let tempInputDate = `${inputDateFormatted.month() + 1}-${inputDateFormatted.year()}`;

                let oldDateFormatted = dayjs(fixedAsset.date);
                let tempOldDate = `${oldDateFormatted.month() + 1}-${oldDateFormatted.year()}`;

                tempInputDate !== tempOldDate ? reloadNewRef() : setData('code', fixedAsset.code);
            }
        }
    }, [debounceDateValue]);

    // function
    const reloadNewRef = () => {
        router.reload({
            only: ['newRef'],
            data: {
                date: dayjs(dateValue.startDate).format('YYYY-MM-DD'),
            },
            onSuccess: (page) => {
                setData('code', page.props.newRef);
            },
        });
    };

    const handleDateValueChange = (newValue) => {
        setDateValue(newValue);
        setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
    };

    const handleChangeValue = (values) => {
        const { floatValue } = values;

        setData({
            ...data,
            value: floatValue,
            depreciation_value: depreciationValue(floatValue, data.lifetime, data.residue),
        });
    };

    const handleChangeResidue = (values) => {
        const { floatValue } = values;

        setData({
            ...data,
            residue: floatValue,
            depreciation_value: depreciationValue(data.value, data.lifetime, floatValue),
        });
    };

    const handleChangeLifetime = (values) => {
        const { floatValue } = values;

        setData({
            ...data,
            lifetime: floatValue,
            depreciation_value: depreciationValue(data.value, floatValue, data.residue),
        });
    };

    const handleSelectedFixedAssetCategory = (selected) => {
        setSelectedFixedAssetCategory(selected);

        setData({
            ...data,
            lifetime: selected.lifetime,
            fixed_asset_category: selected.id,
            depreciation_value: depreciationValue(data.value, selected.lifetime, data.residue),
        });
    };

    const handleSelectedAccount = (selected) => {
        setSelectedAccount(selected);

        setData({
            ...data,
            credit_account: {
                id: selected.id,
                is_cash: selected.is_cash,
                code: selected.code,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        patch(route('data-master.fixed-asset.update', { organization: organization.id, fixedAsset: fixedAsset.id }), {
            onSuccess: () => {
                toast.success(`Harta Tetap Berhasil Diubah`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            onError: (errors) => {
                toast.error(errors.date, {
                    position: toast.POSITION.TOP_CENTER,
                });
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title='Tambah Harta Tetap' />
            <ToastContainer />

            <FormInput onSubmit={handleSubmit}>
                <div className='w-full sm:mt-2 sm:py-5'>
                    <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0 space-y-3'>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Tanggal Perolehan'} htmlFor='name' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <Datepicker
                                    value={dateValue}
                                    onChange={handleDateValueChange}
                                    useRange={false}
                                    asSingle={true}
                                    placeholder='Tanggal'
                                    id='date'
                                    displayFormat='MMMM DD, YYYY'
                                />
                                {errors?.date && <span className='text-red-500 text-xs'>{errors.date}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Kode'} htmlFor='name' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='code'
                                    name='code'
                                    className={`w-full ${errors?.code && 'border-red-500'}`}
                                    placeholder='Kode'
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                />
                                {errors?.code && <span className='text-red-500 text-xs'>{errors.code}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Kategori Harta Tetap'}
                                    htmlFor='category'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <ClientSelectInput
                                    resources={fixedAssetCategories}
                                    selected={selectedFixedAssetCategory}
                                    setSelected={(selected) => handleSelectedFixedAssetCategory(selected)}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Kategori Harta Tetap'
                                    id='category'
                                    isError={errors?.fixed_asset_category ? true : false}
                                    isFocused={true}
                                />
                                {errors?.fixed_asset_category && (
                                    <span className='text-red-500 text-xs'>{errors.fixed_asset_category}</span>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Usia Pakai (Bulan)'}
                                    htmlFor='lifetime'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <NumericFormat
                                    value={data.lifetime}
                                    customInput={TextInput}
                                    onValueChange={(values) => handleChangeLifetime(values)}
                                    thousandSeparator={true}
                                    className='text-end w-full border'
                                    id='lifetime'
                                />
                                {errors?.lifetime && <span className='text-red-500 text-xs'>{errors.lifetime}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Nama'} htmlFor='name' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <TextInput
                                    id='name'
                                    name='name'
                                    className={`w-full ${errors?.name && 'border-red-500'}`}
                                    placeholder='Nama'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                />
                                {errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Nilai Perolehan'} htmlFor='value' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <NumericFormat
                                    value={data.value}
                                    customInput={TextInput}
                                    onValueChange={(values) => handleChangeValue(values)}
                                    thousandSeparator={true}
                                    className='text-end w-full border'
                                    prefix={'IDR '}
                                    id='value'
                                />
                                {errors?.value && <span className='text-red-500 text-xs'>{errors.value}</span>}
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel value={'Residu'} htmlFor='residue' className=' mx-auto my-auto' />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <NumericFormat
                                    value={data.residue}
                                    customInput={TextInput}
                                    onValueChange={(values) => handleChangeResidue(values)}
                                    thousandSeparator={true}
                                    className='text-end w-full border'
                                    prefix={'IDR '}
                                    id='residue'
                                />
                                {errors?.residue && <span className='text-red-500 text-xs'>{errors.residue}</span>}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-1'>
                            <div className='w-full sm:w-1/3 my-auto'>
                                <InputLabel
                                    value={'Akun Kredit'}
                                    htmlFor='credit_account_id'
                                    className=' mx-auto my-auto'
                                />
                            </div>

                            <div className='w-full sm:w-2/3'>
                                <ClientSelectInput
                                    resources={accounts}
                                    selected={selectedAccount}
                                    setSelected={(selected) => handleSelectedAccount(selected)}
                                    maxHeight='max-h-40'
                                    placeholder='Cari Akun'
                                    id='credit_account_id'
                                    isError={errors?.credit_account?.id ? true : false}
                                />
                                {errors?.credit_account?.id && (
                                    <span className='text-red-500 text-xs'>{errors.credit_account.id}</span>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
                            <div className='w-full sm:w-1/6 my-auto text-center'>
                                <Link href={route('data-master.fixed-asset', organization.id)}>
                                    <SecondaryButton className='w-full'>
                                        <div className='text-center w-full'>Batal</div>
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <div className='w-full sm:w-1/6 text-center'>
                                <PrimaryButton className='w-full' disabled={processing}>
                                    <div className='text-center w-full'>Ubah</div>
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </FormInput>
        </>
    );
}

Edit.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Tambah Harta Tetap</Header>}
        children={page}
        user={page.props.auth.user}
        organization={page.props.organization}
        title='Tambah Harta Tetap'
        backLink={
            <Link href={route('data-master.fixed-asset', page.props.organization.id)}>
                <IoArrowBackOutline />
            </Link>
        }
        breadcrumbs={
            <div className='text-sm breadcrumbs'>
                <ul>
                    <li className='font-bold'>
                        <Link href={route('data-master', page.props.organization.id)}>Data Master</Link>
                    </li>
                    <li className='font-bold'>
                        <Link href={route('data-master.fixed-asset', page.props.organization.id)}>Harta Tetap</Link>
                    </li>
                    <li>Tambah Harta Tetap</li>
                </ul>
            </div>
        }
        role={page.props.role}
    />
);
