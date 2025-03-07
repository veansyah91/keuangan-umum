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
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';

const yearList = () => {
  const now = dayjs().year();
  const start = now - 10;
  let arrayYear = [];

  for (let index = start; index < now + 1; index++) {
      arrayYear = [
          ...arrayYear, index
      ];
  }
  return arrayYear;
}

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

export default function Create({ organization, newRef, contacts, date, categories, studyYears, lastPayment, selectedContactParam }) {  
  // state
  const [total, setTotal] = useState(0);
  const { data, setData, processing, post, errors, setError, reset } = useForm({
    contact_id:selectedContactParam ? selectedContactParam.id : null,
    date:date,
    level:selectedContactParam ? selectedContactParam.last_level.level : '',
    student_id:selectedContactParam ? selectedContactParam.student.no_ref : '',
    no_ref:newRef,
    value:total,
    month:parseInt(monthNow()),
    study_year:studyYear(),
    description:'',
    debit_account: null,
    details: [],
  });  

  const [selectedContact, setSelectedContact] = useState({ id: selectedContactParam ? selectedContactParam.id : null, name: selectedContactParam ? selectedContactParam.name : '', phone: selectedContactParam ? selectedContactParam.phone : '' });
  const [dateValue, setDateValue] = useState({
    startDate: date,
    endDate: date,
  });

  const [debounceDateValue] = useDebounce(dateValue, 500);
  const prevDate = usePrevious(dateValue);

  // useEffect
  useEffect(() => {
    setDefault(newRef);
  },[]);

  useEffect(() => {
    if (prevDate !== undefined) {
      if (dateValue.startDate) {        
        reloadNewRef();
      }
    }
  }, [debounceDateValue]);

  // function
  const setDefault = (newRef) => {
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
      date:date,
      no_ref:newRef,
      month:parseInt(monthNow()),
      study_year:studyYear(),
      description:'',
      debit_account: null,
    }
    
    setData(tempData);
  }
  
  const reloadNewRef = (date) => {    
    router.reload({
        only: ['newRef'],
        data: {
          date: dayjs(dateValue.startDate).format('YYYY-MM-DD'),
        },
        onSuccess: ({ props }) => {
          const { newRef } = props;
          
          let temp = data;
          temp = {
            ...data,
            no_ref: newRef,
            date: date
          }
          
          setData(temp);
        },
        onError: errors => {
          console.log(errors);
          
        }
    });
};

  const handleSubmit = (e) => {
    e.preventDefault();
        
    post(route('cashflow.student-monthly-receivable.store', organization.id), {
      onSuccess: ({ props }) => {
        const { flash, newRef } = props;
        
        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        setSelectedContact({ id: null, name: '', phone: '' });
        setDefault(newRef);
      },
      onError: errors => {
        console.log(errors);
        
        toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      preserveScroll: false,
    });
  };

  const handleSelectedContact = (selected) => {
    if (selected) {
      setSelectedContact({ id: selected.id, name: selected.name, phone: selected.phone });
      
      let temp = data;
      temp = {
        ...temp,
        contact_id: selected.id,
        description: `Piutang Iuran Bulanan dari ${selected.name.toUpperCase()}`,
        student_id: selected.student.no_ref,
        level: selected.last_level.level
      };

      // handleReloadLastPayment(temp, selected.id)

      setData(temp);
    }
  };

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
    
    setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
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
    setData('study_year', e.target.value);
  }

  const handleChangeMonth = (e) => {    
    setData('month', parseInt(e.target.value));
  }

  return (
    <>
      <Head title='Tambah Piutang Iuran Bulanan Siswa' />
      <ToastContainer />

      <FormInput onSubmit={handleSubmit}>
        <div className='w-full md:mt-2 md:py-5'>
          <div className='md:w-1/2 md:mx-auto px-3 md:px-0'>
              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'No. Ref'}
                    htmlFor='no_ref'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
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
              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'Tanggal Input'}
                    htmlFor='date'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
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
              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel value={'Nama Siswa'} htmlFor='name' className=' mx-auto my-auto' />
                </div>

                <div className='w-full md:w-2/3'>
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
              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'No. Siswa'}
                    htmlFor='student_id'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
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

              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'Kelas'}
                    htmlFor='level'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
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

              <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'Tahun Ajaran'}
                    htmlFor='study_year'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
                  <select 
                    className="select select-bordered w-full" 
                    value={data.study_year} 
                    onChange={handleChangeStudyYear} 
                    id='study_year'
                  >
                    {
                      yearList().map((study_year, index) => 
                        <option 
                          key={index} 
                          value={`${study_year.toString()}/${(study_year+1).toString()}`}
                        >{study_year.toString()}/{(study_year+1).toString()}</option>
                      )
                    }
                  </select>
                  {errors?.study_year && <span className='text-red-500 text-xs'>{errors.study_year}</span>}
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2'>
                <div className='w-full md:w-1/3 my-auto'>
                  <InputLabel
                    value={'Bulan'}
                    htmlFor='month'
                    className=' mx-auto my-auto'
                  />
                </div>

                <div className='w-full md:w-2/3'>
                  <select 
                    className="select select-bordered w-full" 
                    value={data.month} 
                    onChange={handleChangeMonth} 
                    id='month'
                  >
                    {
                      monthList().map((month, index) => 
                        <option 
                          key={index} 
                          // selected={month == data.month}
                          value={month}
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
                <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 md:mt-2' key={index}>
                  <div className='w-full md:w-1/3 my-auto'>
                    <InputLabel
                      value={category.name}
                      htmlFor={`category-${index}`}
                      className=' mx-auto my-auto'
                    />
                  </div>

                  <div className='w-full md:w-2/3'>
                    <NumericFormat
                      value={category.value}
                      customInput={TextInput}
                      onValueChange={(values) => handleChangeValue(values, index)}
                      thousandSeparator={true}
                      className='text-end w-full border'
                      prefix={'IDR '}
                      id={`category-${index}`}
                    />
                  </div>
                </div>
              )
            }

            <div className='flex flex-col md:flex-row justify-between gap-1 mt-5 pt-5 md:mt-2 font-bold text-xl'>
              <div className='w-full md:w-1/3 my-auto'>
                TOTAL
              </div>

              <div className='w-full md:w-2/3 text-end'>
                Rp. {formatNumber(data.value)}
              </div>
            </div>

            <div className='flex justify-end flex-col-reverse md:flex-row gap-2 mt-5'>
              <div className='w-full md:w-1/6 my-auto text-center'>
                <Link href={route('cashflow.student-monthly-receivable', organization.id)}>
                  <SecondaryButton className='w-full'>
                    <div className='text-center w-full'>Kembali</div>
                  </SecondaryButton>
                </Link>
              </div>

              <div className='w-full md:w-1/6 text-center'>
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
    header={<Header>Tambah Piutang Iuran Bulanan Siswa</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Tambah Piutang Iuran'
    backLink={
      <Link href={route('cashflow.student-monthly-receivable', page.props.organization.id)}>
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
            <Link href={route('cashflow.student-monthly-receivable', page.props.organization.id)}>Piutang Iuran Bulanan Siswa</Link>
          </li>
          <li>Tambah Piutang Iuran Bulanan Siswa</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
