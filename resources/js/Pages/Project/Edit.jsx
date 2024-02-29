import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import FormInput from '@/Components/FormInput';
import { ToastContainer, toast } from 'react-toastify';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Datepicker from 'react-tailwindcss-datepicker';
import { NumericFormat } from 'react-number-format';

export default function Edit({organization, code, project}) {
  // state
  const {data, setData, processing, post, errors, setError, patch} = useForm({
    'name' : project.name || '',
    'code' : project.code || '',
    'description' : project.description || '',
    'start_date' : project.start_date || '',
    'end_date' : project.end_date || '',
    'status' : project.status || '',
    'estimated_value' : project.estimated_value || 0
  });

  const [startDateValue, startSetDateValue] = useState({
    startDate: "", 
    endDate: ""
  });

  const [endDateValue, endSetDateValue] = useState({
    startDate: "", 
    endDate: ""
  });

  // useEffect


  // function
  const handleSubmit = (e) => {
      e.preventDefault();
      patch(route('data-master.project.update', {organization: organization.id, project: project.id}), {
        onSuccess: ({props}) => {
          toast.success(`Proyek Berhasil Diubah`, {
            position: toast.POSITION.TOP_CENTER
          });
        },
        preserveScroll: true
      })
  }

  const handleStartDateValueChange = (newValue) => {
    startSetDateValue(newValue);
    setData('start_date', newValue.startDate);
  }

  const handleEndDateValueChange = (newValue) => {
    endSetDateValue(newValue);
    setData('end_date', newValue.startDate);
  }

  const handleChangeValue = (values) => {
    const { value } = values;

    setData('estimated_value', value);
  }


  return (
  <>
    <Head title='Edit Proyek'/>
    <ToastContainer />    

    <FormInput onSubmit={handleSubmit}>
    <div className='w-full sm:mt-2 sm:py-5'>
      <div className='sm:w-1/2 sm:mx-auto px-3 sm:px-0 space-y-5'>
        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Nama Proyek'} htmlFor='name' className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <TextInput 
              id="name"
              name='name'
              className={`w-full ${errors?.name && 'border-red-500'}`}
              isFocused={true}
              placeholder='Nama'
              value={data.name}
              onChange={(e) => setData('name', e.target.value.toUpperCase())}
            />
            {
              errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>
            }
            
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Kode'} htmlFor='code' className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <TextInput 
              id="code"
              name='code'
              className={`w-full ${errors?.code && 'border-red-500'}`}
              placeholder='Kode'
              value={data.code}
              onChange={(e) => setData('code', e.target.value.toUpperCase())}
            />
            {
              errors?.code && <span className='text-red-500 text-xs'>{errors.code}</span>
            }
            
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Deskripsi'} htmlFor='description' className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <TextInput 
              id="description"
              name='description'
              className={`w-full ${errors?.description && 'border-red-500'}`}
              placeholder='Deskripsi'
              value={data.description}
              onChange={(e) => setData('description', e.target.value.toUpperCase())}
            />
            {
              errors?.description && <span className='text-red-500 text-xs'>{errors.description}</span>
            }
            
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Estimasi Kebutuhan Biaya'} htmlFor='description' className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <NumericFormat 
              value={data.estimated_value} 
              customInput={TextInput} 
              onValueChange={(values) => handleChangeValue(values)}
              thousandSeparator={true}
              className='text-end w-full'
              prefix={'IDR '}
              id='estimated-value'
            />
            {
              errors?.description && <span className='text-red-500 text-xs'>{errors.description}</span>
            }
            
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Tanggal Mulai'} className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <Datepicker
              value={startDateValue} 
              onChange={handleStartDateValueChange}  
              inputClassName={errors?.start_datedate && 'border-red-500 rounded-lg'}
              useRange={false} 
              asSingle={true} 
              placeholder='Tanggal Mulai'
              id="start_date"
            />
            {
              errors?.start_date && <span className='text-red-500 text-xs'>{errors.start_date}</span>
            }
            
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Tanggal Akhir'} className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <Datepicker
              value={endDateValue} 
              onChange={handleEndDateValueChange}  
              inputClassName={errors?.end_datedate && 'border-red-500 rounded-lg'}
              useRange={false} 
              asSingle={true} 
              placeholder='Tanggal Akhir'
              id="end_date"
            />
            {
              errors?.end_date && <span className='text-red-500 text-xs'>{errors.end_date}</span>
            }
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-between gap-1'>
          <div className='w-full sm:w-1/3 my-auto'>
            <InputLabel value={'Status'} htmlFor='status' className=' mx-auto my-auto'/>
          </div>
          
          <div className='w-full sm:w-2/3'>
            <select className="select select-bordered w-full" id='status' value={data.status} onChange={(e) => setData('status', e.target.value)}>
              <option disabled value=''>--Pilih Status--</option>
              <option value='not started'>Belum Dimulai</option>
              <option value='pending'>Menunggu</option>
              <option value='in progress'>Dalam Pengerjaan</option>
              <option value='finished'>Selesai</option>
            </select>
            {
              errors?.status && <span className='text-red-500 text-xs'>{errors.status}</span>
            }            
          </div>
        </div>

        <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
          <div className='w-full sm:w-1/6 my-auto text-center'>
            <Link href={route('data-master.project', organization.id)}>
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
  )
}

Edit.layout = page => <AuthenticatedLayout
  header={<Header>Edit Proyek</Header>}
  children={page}
  user={page.props.auth.user}
  organization={page.props.organization}
  title="Edit Proyek"
  backLink={<Link href={route('data-master.project',page.props.organization.id)}><IoArrowBackOutline/></Link>}
  breadcrumbs={<div className="text-sm breadcrumbs">
    <ul>
    <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Data Master</Link></li> 
    <li className='font-bold'><Link href={route('data-master.project',page.props.organization.id)}>Proyek</Link></li> 
    <li>Edit Proyek</li>
    </ul>
  </div>}
  role={page.props.role}
/>

