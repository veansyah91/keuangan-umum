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
import ReceivableListBox from './Components/ReceivableListBox';

export default function Create({
  organization, newRef, contacts, contact, date, selectedContactQuery, studyYears, cashAccounts, payments
}) {  
  const { data, setData, processing, post, errors, setError, reset } = useForm({
    contact_id:selectedContactQuery ? selectedContactQuery.id : null,
    date:date,
    level:selectedContactQuery ? selectedContactQuery.last_level.level : '',
    student_id:selectedContactQuery ? selectedContactQuery.student.no_ref : '',
    no_ref:newRef,
    value: payments.length > 0 ? payments[0].receivable_value : 0,
    paidValue:0,
    description: selectedContactQuery ? `Pembayaran Piutang Iuran Tahunan Oleh ${selectedContactQuery.name}` : '',
    payment_id: payments.length > 0 ? payments[0].id : null,
    cash_account_id: null,
  });

  const [selectedContact, setSelectedContact] = useState({ id: selectedContactQuery ? selectedContactQuery.id: null, name: selectedContactQuery ? selectedContactQuery.name: '', phone: selectedContactQuery ? selectedContactQuery.phone: '' });
  const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

  const [selectedPayment, setSelectedPayment] = useState({
    id: payments.length > 0 ? payments[0].id : null, 
    noRef: payments.length > 0 ? payments[0].no_ref : '', 
    receivablevalue: payments.length > 0 ? payments[0].receivable_value : 0, 
    studyYear: payments.length > 0 ? payments[0].study_year : ''
  });

  const [dataPayment, setDataPayment] = useState(payments);

  const [dateValue, setDateValue] = useState({
    startDate: date,
    endDate: date,
  });

  // useEffect
  useEffect(() => {
    setDefault(newRef);
  },[]);

  useEffect(() => {
    if (selectedContact.id) {
      handleGetPayments();
    }
  },[selectedContact]);

  const handleGetPayments = () => {
    router.reload({
      only: ['payments'],
      data: {
        selectedContact: selectedContact.id
      },
      onSuccess: ({ props }) => {
        const { payments } = props;
        
        setData({
          ...data,
          value: payments[0].receivable_value,
          payment_id: payments[0].id
        })
        setDataPayment(payments);        
        setSelectedPayment({
          id: payments[0].id, 
          noRef: payments[0].no_ref, 
          receivablevalue: payments[0].receivable_value, 
          studyYear: payments[0].study_year
        })
      }
    });
  }  

  const setDefault = (newRef) => {
    let tempData = data;

    tempData = {
      ...tempData,
      contact_id:null,
      date:date,
      level:'',
      student_id:'',
      no_ref:newRef,
      value: 0,
      paidValue:0,
      description: '',
      payment_id: null,
      cash_account_id: null,
    }    
    setData(tempData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('cashflow.student-entry-receivable-payment.store', organization.id), {
      only:['newRef', 'flash'],
      onSuccess: ({ props  }) => {
        const { flash, newRef } = props;
        
        reset();
        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
        setSelectedContact({ id: null, name: '', phone: '' });
        setSelectedPayment({
          id: null, 
          noRef: '', 
          receivablevalue: 0, 
          studyYear: ''
        });
        setDefault(newRef);
      },
      onError: errors => {        
        toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      preserveScroll: false,
      preserveState: true
    });
  };

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
    setData('date', newValue.startDate);
  };

  const handleSelectedContact = (selected) => {    
    setSelectedContact({ id: selected ? selected.id : null, name: selected ? selected.name : '', phone: selected ? selected.phone : '' });
    
    let temp = data;
    temp = {
      ...temp,
      contact_id: selected ? selected.id : null,
      description:`Pembayaran Iuran Tahunan dari ${selected ? selected.name.toUpperCase() : ''}`,
      student_id: selected ? selected.student.no_ref : '',
      level: selected ? selected.last_level.level : ''
    };
    setData(temp);
  };

  const handleSelectedCashAccount = (selected) => {
    setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
    setData('cash_account_id', selected.id);
    setError('cash_account_id','');
  };

  const handleChangePaidValue = (values) => {
    const { value } = values;
    setData('paidValue', parseInt(value) ?? 0);
  }

  const handleSelectedPayment = (selected) => {
    setSelectedPayment({
      id: selected.id, 
      noRef: selected.no_ref, 
      receivablevalue: selected.receivable_value, 
      studyYear: selected.study_year
    })    
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
            <div className='text-center mt-5 font-bold'>Rincian Pembayaran</div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value="No Ref"
                  htmlFor={`payment`}
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <ReceivableListBox 
                  id='payment'
                  payments={dataPayment}
                  isError={false}
                  selected={selectedPayment}
                  setSelected={(selected) => handleSelectedPayment(selected)}
                />
                {selectedPayment?.studyYear && (
                  <div className='absolute text-xs'>Tahun Ajaran: {selectedPayment.studyYear}</div>
                )}
                {/* {errors?.level && <span className='text-red-500 text-xs'>{errors.level}</span>} */}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 pt-5 sm:mt-2 font-bold text-xl'>
              <div className='w-full sm:w-1/3 my-auto'>
                TOTAL PIUTANG
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
                <Link href={route('cashflow.student-entry-receivable-payment', organization.id)}>
                  <SecondaryButton className='w-full'>
                    <div className='text-center w-full'>Kembali</div>
                  </SecondaryButton>
                </Link>
              </div>

              {
                ((data.value - data.paidValue) >= 0 && data.cash_account_id) && <div className='w-full sm:w-1/6 text-center'>
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

Create.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Tambah Pembayaran</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Tambah Pembayaran'
    backLink={
      <Link href={route('cashflow.student-entry-receivable-payment', page.props.organization.id)}>
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
            <Link href={route('cashflow.student-entry-receivable-payment', page.props.organization.id)}>Pembayaran Iuran Tahunan Siswa</Link>
          </li>
          <li>Tambah Pembayaran</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
