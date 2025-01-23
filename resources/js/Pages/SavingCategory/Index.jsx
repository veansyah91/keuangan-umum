import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoArrowBackOutline, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import AddButtonMobile from '@/Components/AddButtonMobile';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import { usePrevious } from 'react-use';
import SavingCategoryMobile from './Components/SavingCategoryMobile';
import SavingCategoryDesktop from './Components/SavingCategoryDesktop';
import SuccessButton from '@/Components/SuccessButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';

export default function Index({ organization, categories, role }) {
  const { data, setData, post, patch, errors, processing, reset } = useForm({
    id: null,
    'name' : ''
  })

  const [search, setSearch] = useState("");

  const [showModalInput, setShowModalInput] = useState(false);
  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Kategori',
    submit: 'Tambah'
  });
  const [isUpdate, setIsUpdate] = useState(false);

  // function
  const createData = () => {
    setShowModalInput(true);
    setIsUpdate(false);
    reset();
    setModalInputLabel({
      title: 'Tambah Kategori',
      submit: 'Tambah'
    });
  }

  const handleDelete = (category) => {
    console.log(category);
    
  }

  const handleEdit = (category) => {
    setShowModalInput(true);
    setIsUpdate(true);
    setModalInputLabel({
      title: 'Ubah Kategori',
      submit: 'Ubah'
    });
    
    let tempData = {...data};
    tempData = {
      name: category.name,
      id: category.id
    }
    setData(tempData);    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    isUpdate
    ? patch(route('cashflow.saving-category.update', {organization: organization.id, category: data.id}),{
      onSuccess: ({ props }) => {
        const { flash } = props;

        setShowModalInput(false);
        setIsUpdate(false);
        reset();
      }
    })
    : post(route('cashflow.saving-category.store', {organization:organization.id}),{
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });

        setShowModalInput(false);
        setIsUpdate(false);
        reset();
      }
    })
  }
  
  return (
    <>
      {/* Mobile */}
      <Head title='Data Kategori Tabungan' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          categories.links[0].url ? (
            <Link
              href={route('cashflow.saving-category', {
                organization: organization.id,
                page: categories.current_page - 1,
                search: search,
              })}
              preserveState
              only={['categories']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          categories.links[categories.links.length - 1].url ? (
            <Link
              href={route('cashflow.saving-category', {
                organization: organization.id,
                page: categories.current_page + 1,
                search: search,
              })}
              only={['categories']}
              preserveState>
              <IoPlayForward />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayForward />
            </div>
          )
        }
        page={
          <>
            {categories.current_page}/{categories.last_page}
          </>
        }
        data={categories}
      />

      <ContentMobile>
        {categories.data.map((category) => (
          <SavingCategoryMobile
            category={category}
            key={category.id}
            handleDelete={() => handleDelete(category)}
            handleEdit={() => handleEdit(category)}
            role={role}
          />
        ))}
      </ContentMobile>

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {role !== 'viewer' && (
              <div className='space-x-2'>
                <PrimaryButton className='py-3' onClick={() => setShowModalInput(true)}>Tambah Data</PrimaryButton>
              </div>
            )}
          </div>
          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Kategori'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={categories} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {categories.links[0].url ? (
                <Link
                  href={route('cashflow.saving-category', {
                    organization: organization.id,
                    page: categories.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['categories']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {categories.current_page}/{categories.last_page}
            </div>
            <div className='my-auto'>
              {categories.links[categories.links.length - 1].url ? (
                <Link
                  href={route('cashflow.saving-category', {
                    organization: organization.id,
                    page: categories.current_page + 1,
                    search: search,
                  })}
                  only={['categories']}
                  preserveState>
                  <IoPlayForward />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayForward />
                </div>
              )}
            </div>
          </div>
        </TitleDesktop>  

        <div className='sm:flex hidden gap-5'>
          <div className='w-full'>
            <ContentDesktop>
              <table className='table table-pin-rows table-pin-cols text-base'>
                <thead className='text-base text-gray-900'>
                  <tr className=''>
                    <th className='bg-gray-200'>Nama Kategori</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.data.map((category, index) => (
                    <SavingCategoryDesktop
                      key={index}
                      category={category}
                      className={`${index % 2 == 0 && 'bg-gray-100'}`}
                      handleDelete={() => handleDelete(category)}
                      handleEdit={() => handleEdit(category)}
                      role={role}
                    />
                  ))}
                </tbody>
              </table>              
            </ContentDesktop>
          </div>      
        </div>      
      </ContainerDesktop>

      {/* Modal */}
      <Modal show={showModalInput} onClose={() => setShowModalInput(false)}>
        <form onSubmit={handleSubmit} className='p-6'>
          <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>{modalInputLabel.title}</h2>
            <div className='mt-5 space-y-5'>
              <div className='flex flex-col sm:flex-row w-full gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel htmlFor='name' value='Nama Kategori' className='mx-auto my-auto' />
                </div>

                <div className='sm:w-2/3 w-full'>
                  <TextInput
                    id='name'
                    type='text'
                    name='name'
                    value={data.name}
                    className={`mt-1 w-full ${errors && errors.name && 'border-red-500'}`}
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                    placeholder='Nama Kategori'
                  />
                  {errors && errors.name && (
                    <div className='-mb-3'>
                      <div className='text-xs text-red-500'>{errors.name}</div>
                    </div>
                  )}
                </div>
              </div> 
              <div className='mt-6 flex justify-end'>
                <SecondaryButton onClick={e => setShowModalInput(false)}>Batal</SecondaryButton>
    
                <PrimaryButton className='ms-3' disabled={processing}>
                  {modalInputLabel.submit}
                </PrimaryButton>
                </div>
            </div>
        </form>        
      </Modal>
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Kategori Tabungan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Kategori Tabungan'
    backLink={
      <Link href={route('data-master', page.props.organization.id)}>
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
            <Link href={route('cashflow.saving', page.props.organization.id)}>Tabungan</Link>
          </li>
          <li>Kategori Tabungan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
