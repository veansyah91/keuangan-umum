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
import dayjs from 'dayjs';
import studyYear from '@/Utils/studyYear';
import StudentSelectInput from '@/Components/SelectInput/StudentSelectInput';
import Datepicker from 'react-tailwindcss-datepicker';
import { NumericFormat } from 'react-number-format';
import formatNumber from '@/Utils/formatNumber';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';

export default function Edit({
  organization, newRef, contacts, date, categories, studyYears, cashAccounts, payment
}) {
  
  
  const { data, setData, processing, patch, errors, setError, reset } = useForm({
    contact_id:payment.contact_id,
    date:payment.date,
    level:payment.contact.last_level.level,
    student_id:payment.contact.student.no_ref,
    no_ref:payment.no_ref,
    value:payment.value,
    paidValue: payment.value - payment.receivable_value,
    study_year:payment.study_year,
    description:payment.description,
    details: [],
    cash_account_id: null,
  });

  const [selectedContact, setSelectedContact] = useState({ id: payment.contact.id, name: payment.contact.name, phone: payment.contact.phone });
  const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

  const [dateValue, setDateValue] = useState({
    startDate: payment.date,
    endDate: payment.date,
  });

  // useEffect
  useEffect(() => {
    setDefault();
  },[]);

  const setDefault = () => {
    let tempData = data;
    let tempCategories = [];

    categories.filter((category) => {
      let filtered = payment.details.filter(detail => detail.id == category.id);

      tempCategories = [
        ...tempCategories,
        {
          id:category.id,
          name:category.name,
          value: filtered.length > 0 ? filtered[0].pivot.value : 0
        }
      ]
    });

    payment.journal.ledgers.map(ledger => {
      if (ledger.debit > 0 && ledger.account.is_cash) {
        tempData = {
          ...tempData,
          cash_account_id : ledger.account_id
        }

        setSelectedCashAccount({
          id: ledger.account.id, name: ledger.account.name, code: ledger.account.code, is_cash: true
        })
      }
    })

    tempData = {
      ...tempData,
      details: tempCategories,
    }
    
    setData(tempData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    patch(route('cashflow.student-entry-payment.update', {organization: organization.id, id: payment.id}), {
      onSuccess: ({ props  }) => {
        const { flash } = props;
        
        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onError: errors => {        
        toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      preserveScroll: false,
    });
  };

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
    setData('date', newValue.startDate);
  };

  const handleChangeStudyYear = (e) => {
    let temp = data;
    temp = {
      ...temp,
      study_year : e.target.value,
      description:`Pembayaran Iuran Tahunan dari ${selectedContact?.name?.toUpperCase()}  Tahun Ajaran ${e.target.value}`,
    };    
    setData(temp);
  }

  const handleSelectedContact = (selected) => {    
    setSelectedContact({ id: selected.id, name: selected.name, phone: selected.phone });
    let temp = data;
    temp = {
      ...temp,
      contact_id: selected.id,
      description:`Pembayaran Iuran Tahunan dari ${selected.name.toUpperCase()} Tahun Ajaran ${data.study_year}`,
      student_id: selected.student.no_ref,
      level: selected.last_level.level
    };
    setData(temp);
  };

  const handleSelectedCashAccount = (selected) => {
    setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
    setData('cash_account_id', selected.id);
    setError('cash_account_id','');
  };

  const handleChangeValue = (values, index) => {
    const { value } = values;
    let tempData = [...data.details];
    tempData[index] = { ...tempData[index], value: parseInt(value) };
    let tempTotal = tempData.reduce((total, item) => total + item.value, 0);
    
    setData({
      ...data,
      details: tempData,
      value: tempTotal
    })
  }

  const handleChangePaidValue = (values) => {
    const { value } = values;
    setData('paidValue', parseInt(value) ?? 0);
  }

  return (
    <>
      <Head title='Piutang Iuran Tahunan Siswa' />
      <ToastContainer />

      <FormInput onSubmit={handleSubmit}>
        <div className='w-full sm:mt-2 sm:py-5'>
          <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0'>
              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'No. Ref'}
                    htmlFor='no_ref'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <TextInput
                    id='no_ref'
                    name='no_ref'
                    className={`w-full ${errors?.no_ref && 'border-red-500'}`}
                    placeholder='No. Ref'
                    value={data.no_ref || ''}
                    onChange={(e) => setData('no_ref', e.target.value.toUpperCase())}
                  />
                  {errors?.no_ref && <span className='text-red-500 text-xs'>{errors.no_ref}</span>}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'Tanggal'}
                    htmlFor='date'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <div>
                    <Datepicker
                      value={dateValue}
                      onChange={handleDateValueChange}
                      inputClassName={errors?.date && 'border-red-500 rounded-lg'}
                      useRange={false}
                      asSingle={true}
                      placeholder='Tanggal'
                      inputId='date'
                      displayFormat='MMMM DD, YYYY'
                    />
                  </div>
                  {errors?.date && <span className='text-red-500 text-xs'>{errors.date}</span>}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel value={'Nama Siswa'} htmlFor='name' className=' mx-auto my-auto' />
                </div>

                <div className='w-full sm:w-2/3'>
                  <StudentSelectInput
                    resources={contacts}
                    selected={selectedContact}
                    setSelected={(selected) => handleSelectedContact(selected)}
                    maxHeight='max-h-40'
                    placeholder='Cari Kontak'
                    isError={errors.contact_id ? true : false}
                    id='name'
                    notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-master.students.create', {organization:organization.id})}>Buat Baru ?</Link></span>}
                  />
                  {errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>}
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'No. Siswa'}
                    htmlFor='student_id'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <TextInput
                    id='student_id'
                    name='student_id'
                    className={`w-full ${errors?.student_id && 'border-red-500'}`}
                    placeholder='No. Siswa'
                    value={data.student_id || ''}
                    onChange={(e) => setData('student_id', e.target.value.toUpperCase())}
                    disabled
                  />
                  {errors?.student_id && <span className='text-red-500 text-xs'>{errors.student_id}</span>}
                </div>
              </div>

              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'Kelas'}
                    htmlFor='level'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <TextInput
                    id='level'
                    name='level'
                    className={`w-full ${errors?.level && 'border-red-500'}`}
                    placeholder='Kelas'
                    value={data.level || ''}
                    onChange={(e) => setData('level', e.target.value.toUpperCase())}
                    disabled
                  />
                  {errors?.level && <span className='text-red-500 text-xs'>{errors.level}</span>}
                </div>
              </div>

              <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'Tahun Ajaran'}
                    htmlFor='study_year'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <select 
                    className="select select-bordered w-full" 
                    value={data.study_year} 
                    onChange={handleChangeStudyYear} 
                    id='study_year'
                  >
                    {
                      studyYears.map((study_year, index) => 
                        <option 
                          key={index} 
                        >{study_year.year}</option>
                      )
                    }
                  </select>
                  {errors?.study_year && <span className='text-red-500 text-xs'>{errors.study_year}</span>}
              </div>
            </div>

            <div className='text-center mt-5 font-bold'>Rincian Pembayaran</div>
            {
              data.details.map((category, index) => 
                <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2' key={index}>
                  <div className='w-full sm:w-1/3 my-auto'>
                    <InputLabel
                      value={category.name}
                      htmlFor={`category-${index}`}
                      className=' mx-auto my-auto'
                    />
                  </div>

                  <div className='w-full sm:w-2/3'>
                    <NumericFormat
                      value={category.value}
                      customInput={TextInput}
                      onValueChange={(values) => handleChangeValue(values, index)}
                      thousandSeparator={true}
                      className='text-end w-full border'
                      prefix={'IDR '}
                      id={`category-${index}`}
                    />
                    {/* {errors?.level && <span className='text-red-500 text-xs'>{errors.level}</span>} */}
                  </div>
                </div>
              )
            }

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 pt-5 sm:mt-2 font-bold text-xl'>
              <div className='w-full sm:w-1/3 my-auto'>
                TOTAL
              </div>

              <div className='w-full sm:w-2/3 text-end'>
                Rp. {formatNumber(data.value)}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={"Jumlah Bayar"}
                  htmlFor={`paid-value`}
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <NumericFormat
                  value={data.paidValue}
                  customInput={TextInput}
                  onValueChange={(values) => handleChangePaidValue(values)}
                  thousandSeparator={true}
                  className='text-end w-full border'
                  prefix={'IDR '}
                  id={`paid-value`}
                />
                {/* {errors?.level && <span className='text-red-500 text-xs'>{errors.level}</span>} */}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                Sisa
              </div>

              <div className='w-full sm:w-2/3 text-end'>
                Rp. {formatNumber(data.value - data.paidValue)}
              </div>
            </div>

            {
              data.paidValue > 0 && <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Akun Kas'}
                  htmlFor='account'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <ClientSelectInput
                  resources={cashAccounts}
                  selected={selectedCashAccount}
                  setSelected={(selected) => handleSelectedCashAccount(selected)}
                  maxHeight='max-h-40'
                  placeholder='Cari Akun'
                  isError={errors.cash_account_id ? true : false}
                  id='account'
                  contactFilter={''}
                />
                {selectedCashAccount?.code && (
                  <div className='absolute text-xs'>Kode: {selectedCashAccount.code}</div>
                )}
                {errors?.cash_account_id && <span className='text-red-500 text-xs'>{errors.cash_account_id}</span>}

              </div>
            </div>
            }
            

            <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
              <div className='w-full sm:w-1/6 my-auto text-center'>
                <Link href={route('cashflow.student-entry-payment', organization.id)}>
                  <SecondaryButton className='w-full'>
                    <div className='text-center w-full'>Kembali</div>
                  </SecondaryButton>
                </Link>
              </div>

              {
                (data.value - data.paidValue) >= 0 && <div className='w-full sm:w-1/6 text-center'>
                  <PrimaryButton className='w-full' disabled={processing}>
                    <div className='text-center w-full'>Simpan</div>
                  </PrimaryButton>
                </div>
              }
            </div>
          </div>
        </div>
      </FormInput>
    </>
  )
}

Edit.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Ubah Pembayaran</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Ubah Pembayaran'
    backLink={
      <Link href={route('cashflow.student-entry-payment', page.props.organization.id)}>
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
            <Link href={route('cashflow.student-entry-payment', page.props.organization.id)}>Pembayaran Iuran Tahunan Siswa</Link>
          </li>
          <li>Ubah Pembayaran</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
