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

const monthList = () => {
  let monthListTemp = [];

  for (let index = 7; index < 13; index++) {
    monthListTemp = [
      ...monthListTemp, index
    ];
  }

  for (let index = 1; index < 7; index++) {
    monthListTemp = [
      ...monthListTemp, index
    ];
  }
  return monthListTemp;
}

const monthNow = () => {
  let month = dayjs().format('MM');
  return month;
}

const studyYearUpdate = (month, studyYear) => {
  let splitStudyYear = studyYear.split('/');
}

export default function Create({ organization, newRef, contacts, date, categories, studyYears, cashAccounts, lastPayment }) {
  // state
  const [total, setTotal] = useState(0);
  const { data, setData, processing, post, errors, setError, reset } = useForm({
    contact_id:null,
    date:date,
    level:'',
    student_id:'',
    no_ref:newRef,
    value:total,
    type:'now', // set auto
    month:parseInt(monthNow()),
    study_year:studyYear(),
    description:'',
    details: [],
    account_id: null
  });

  const [selectedContact, setSelectedContact] = useState({ id: null, name: '', phone: '' });
  const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });

  const [dateValue, setDateValue] = useState({
    startDate: date,
    endDate: date,
  });

  // useEffect
  useEffect(() => {
    setDefault();
  },[]);

  // function
  const setDefault = () => {
    let tempData = data;
    let temp = categories.map(category => ({
      id: category.id,
      name: category.name,
      value: category.value,
    }));

    let tempTotal = temp.reduce((total, item) => total + item.value, 0);
    setTotal(tempTotal);

    tempData = {
      ...tempData,
      value: tempTotal,
      details: temp,
      contact_id:null,
      date:date,
      level:'',
      student_id:'',
      no_ref:newRef,
      type:'now', // set auto
      month:parseInt(monthNow()),
      study_year:studyYear(),
      description:'',
      account_id: null
    }
    
    setData(tempData);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('cashflow.student-monthly-payment.post', organization.id), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
        setSelectedContact({ id: null, name: '', phone: '' });
        setDefault();

      },
      onError: errors => {
        toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      preserveScroll: false,
    });
  };

  const handleSelectedContact = (selected) => {
    setSelectedContact({ id: selected.id, name: selected.name, phone: selected.phone });
    let temp = data;
    temp = {
      ...temp,
      contact_id: selected.id,
      description: `Kas Masuk / Pembayaran Iuran Bulanan dari ${selected.name.toUpperCase()}`,
      student_id: selected.student.no_ref,
      level: selected.levels[selected.levels.length - 1].level
    };
    // handleReloadLastPayment(temp, selected.id)

    setData(temp);
  };

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
    setData('date', newValue.startDate);
  };

  const handleChangeValue = (values, index) => {
    const { value } = values;
    let tempData = [...data.details];
    tempData[index] = { ...tempData[index], value: parseInt(value) };
    let tempTotal = tempData.reduce((total, item) => total + item.value, 0);
    setTotal(tempTotal);
    setData({
      ...data,
      details: tempData,
      value: tempTotal
    })
  }

  const handleChangeStudyYear = (e) => {
    let type = 'now';
    let now = parseInt(dayjs().format('YYYY')) * 100 + parseInt(monthNow());

    let splitYear = e.target.value.split('/');
    let selectedMonth = parseInt(data.month) < 7 ? parseInt(splitYear[1]) * 100 + parseInt(data.month) : splitYear[0] * 100 + parseInt(data.month);

    if (selectedMonth > now) {
      type = 'prepaid';
    } else if (selectedMonth < now) { 
      type = 'receivable';
    } 

    let temp = data;
    temp = {
      ...temp,
      study_year : e.target.value,
      type : type
    };    

    setData(temp);
  }

  const handleChangeMonth = (e) => {    
    let type = 'now';
    let now = parseInt(dayjs().format('YYYY')) * 100 + parseInt(monthNow());

    let splitYear = data.study_year.split('/');
    let selectedMonth = parseInt(e.target.value) < 7 ? parseInt(splitYear[1]) * 100 + parseInt(e.target.value) : splitYear[0] * 100 + parseInt(e.target.value);

    if (selectedMonth > now) {
      type = 'prepaid';
    } else if (selectedMonth < now) { 
      type = 'receivable';
    } 

    let temp = data;
    temp = {
      ...temp,
      month : parseInt(e.target.value),
      type : type
    };    

    setData(temp);
  }

  const handleSelectedCashAccount = (selected) => {
    setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
    setData('cash_account_id', selected.id);
    setError('cash_account_id','');
  };

  // const handleReloadLastPayment = (temp, contact_id) => {
  //   router.reload({
  //     only: ['lastPayment'],
  //     data: {
  //       'contact_id' : contact_id
  //     },
  //     onSuccess: ({ props }) => {
  //       const { lastPayment } = props;        

  //       if (lastPayment) {
  //         console.log(lastPayment);
  //       }
                
  //     }
  //   })
  // }

  return (
    <>
      <Head title='Tambah Pembayaran' />
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
                    disabled
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
                      id='date'
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
                    defaultValue={data.study_year} 
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

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel
                    value={'Bulan'}
                    htmlFor='month'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full sm:w-2/3'>
                  <select 
                    className="select select-bordered w-full" 
                    defaultValue={data.month} 
                    onChange={handleChangeMonth} 
                    id='month'
                  >
                    {
                      monthList().map((month, index) => 
                        <option 
                          key={index} 
                        >{month}</option>
                      )
                    }
                  </select>
                  {errors?.month && <span className='text-red-500 text-xs'>{errors.month}</span>}
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

            <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
              <div className='w-full sm:w-1/6 my-auto text-center'>
                <Link href={route('cashflow.student-monthly-payment', organization.id)}>
                  <SecondaryButton className='w-full'>
                    <div className='text-center w-full'>Kembali</div>
                  </SecondaryButton>
                </Link>
              </div>

              <div className='w-full sm:w-1/6 text-center'>
                <PrimaryButton className='w-full' disabled={processing}>
                  <div className='text-center w-full'>Simpan</div>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </FormInput>
    </>
  );
}

Create.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Tambah Pembayaran</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Tambah Pembayaran'
    backLink={
      <Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>
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
            <Link href={route('cashflow.student-monthly-payment', page.props.organization.id)}>Pembayaran Iuran Bulanan Siswa</Link>
          </li>
          <li>Tambah Pembayaran</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
