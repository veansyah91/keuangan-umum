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
import SalaryCategoryMobile from './Components/SalaryCategoryMobile';
import SalaryCategoryDesktop from './Components/SalaryCategoryDesktop';
import SuccessButton from '@/Components/SuccessButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';

export default function Index({ role, organization, salaryCategories, searchFilter }) {
  // State
  
  const [showSearch, setShowSearch] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showModalInput, setShowModalInput] = useState(false);
  const [modalInputLabel, setModalInputLabel] = useState({
    title: '',
    submit: ''
  })

  const [isUpdate, setIsUpdate] = useState(false);

  const [search, setSearch] = useState(searchFilter || '');
  const [titleDeleteModal, setTitleDeleteModal] = useState('');
  const {
    data,
    setData,
    post,
    patch,
    processing,
    errors,
    reset,
    delete: destroy,
    setError,
  } = useForm({
    id: null,
    name: '',
    value: 0,
    has_hour: false,
    is_cut: false,
    is_active: true,
    unit:''
  });

  const prevSearch = usePrevious(search);
  const [debounceValue] = useDebounce(search, 500);

  // useState
  useEffect(() => {
    if (prevSearch !== undefined) {
      handleReloadPage();
    }
  }, [debounceValue]);

  //function
  const handleReloadPage = () => {
    router.reload({
      only: ['salaryCategories'],
      data: {
        search,
      },
    });
  };
  const handleDelete = (category) => {
    setTitleDeleteModal(`Hapus Komponen Penggajian ${category.name} ?`);
    setShowDeleteConfirmation(true);
    setData('id', category.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    isUpdate
    ? patch(route('data-master.salary-category.update', {organization: organization.id, salaryCategory: data.id}), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });

        setShowModalInput(false);
        reset();
      },
      onError: errors => {
        console.log(errors);
      }
    })
    : post(route('data-master.salary-category.store', organization.id), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });

        setShowModalInput(false);
        reset();
      },
      onError: errors => {
        console.log(errors);
      }
    })        
  }

  const handleChangeValue = (values) => {
    const { value } = values;

    setData('value', value);
  }

  const handleSubmitDelete = (e) => {
    e.preventDefault();

    destroy(route('data-master.salary-category.destroy', { organization: organization.id, salaryCategory: data.id }), {
      onSuccess: () => {
        setShowDeleteConfirmation(false);
        toast.success(`Komponen Penggajian Berhasil Dihapus`, {
          position: toast.POSITION.TOP_CENTER,
        });
        reset();
      },
      onError: (error) => {
        setShowDeleteConfirmation(false);
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
    });
  };

  const handleChangeHasHour = () => {
    let temp = !data.has_hour;
    setData({
      ...data,
      has_hour: temp,
      unit: temp ? 'jam' : 'hari'
    });
  }

  const createData = () => {
    reset();
    setIsUpdate(false);
    setModalInputLabel({title: 'Tambah Komponen', submit: 'Tambah'});
    setError('name', '');
    setShowModalInput(true);
  };

  const handleEdit = (category) => {
    setIsUpdate(true);
    setError('name', '');
    setShowModalInput(true);
    setModalInputLabel({
      title: 'Ubah Komponen',
      submit: 'Ubah'
    });
    setData({
      id : category.id,
      name : category.name,
      is_active : category.is_active,
      value: category.value,
      has_hour: category.has_hour,
      is_cut: category.is_cut,
    })
  }

  return (
    <>
      {/* Mobile */}
      <Head title='Data Komponen Penggajian' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          salaryCategories.links[0].url ? (
            <Link
              href={route('data-master.salary-category', {
                organization: organization.id,
                page: salaryCategories.current_page - 1,
                search: search,
              })}
              preserveState
              only={['salaryCategories']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          salaryCategories.links[salaryCategories.links.length - 1].url ? (
            <Link
              href={route('data-master.salary-category', {
                organization: organization.id,
                page: salaryCategories.current_page + 1,
                search: search,
              })}
              only={['salaryCategories']}
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
            {salaryCategories.current_page}/{salaryCategories.last_page}
          </>
        }
        data={salaryCategories}
      />
      <ContentMobile>
        {salaryCategories.data.map((category) => (
          <SalaryCategoryMobile
            category={category}
            key={category.id}
            handleDelete={() => handleDelete(category)}
            handleEdit={() => handleEdit(category)}
            role={role}
          />
        ))}
      </ContentMobile>
      {/* Mobile */}

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {role !== 'viewer' && (
              <div className='space-x-2'>
                <PrimaryButton className='py-3' onClick={createData}>Tambah Data</PrimaryButton>
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
              placeholder='Cari Komponen Penggajian'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={salaryCategories} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {salaryCategories.links[0].url ? (
                <Link
                  href={route('data-master.salary-category', {
                    organization: organization.id,
                    page: salaryCategories.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['salaryCategories']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {salaryCategories.current_page}/{salaryCategories.last_page}
            </div>
            <div className='my-auto'>
              {salaryCategories.links[salaryCategories.links.length - 1].url ? (
                <Link
                  href={route('data-master.salary-category', {
                    organization: organization.id,
                    page: salaryCategories.current_page + 1,
                    search: search,
                  })}
                  only={['salaryCategories']}
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
                    <th className='bg-gray-200'>Nama Komponen</th>
                    <th className='bg-gray-200 text-end'>Nilai (Default)</th>
                    <th className='bg-gray-200 text-center'>Status</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
                <tbody>
                  {salaryCategories.data.map((category, index) => (
                    <SalaryCategoryDesktop
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
      {/* Desktop */}

      {/* Modal */}
      <Modal show={showModalInput} onClose={() => setShowModalInput(false)}>
        <form onSubmit={handleSubmit} className='p-6'>
          <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>{modalInputLabel.title}</h2>

          <div className='mt-5 space-y-5'>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='name' value='Nama Komponen' className='mx-auto my-auto' />
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
                  placeholder='Nama Komponen'
                />
                {errors && errors.name && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.name}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='name' value='Nilai (Default)' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                <NumericFormat
                  value={data.value}
                  customInput={TextInput}
                  onValueChange={(values) => handleChangeValue(values)}
                  thousandSeparator={true}
                  className='text-end w-full border'
                  prefix={'IDR '}
                />
                {errors && errors.name && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.name}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='w-2/6'>
              <label htmlFor={`has_hour`} className='flex cursor-pointer gap-5'>
                <input 
                  type="checkbox" 
                  id='has_hour' 
                  className='checkbox my-auto'
                  value={data.has_hour}
                  onChange={handleChangeHasHour}
                  checked={data.has_hour}
                />
                <div className='font-bold'>Hitung Jam/Hari Kerja</div>
              </label>
            </div>
            {
              data.has_hour ? 
              <div className='flex flex-col sm:flex-row w-full gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel htmlFor='unit' value='Satuan' className='mx-auto my-auto' />
                </div>

                <div className='sm:w-2/3 w-full'>
                <select className="select select-bordered w-full" defaultValue={data.entry_year} onChange={e => setData('unit', parseInt(e.target.value))} id='unit'>
                    <option value={'jam'}>Jam</option>
                    <option value={'hari'}>Hari</option>
                  </select>
                  {errors?.unit && <span className='text-red-500 text-xs'>{errors.unit}</span>}
                </div>
              </div> : ''
            }
            <div className='w-2/6'>
              <label htmlFor={`is_cut`} className='flex cursor-pointer gap-5'>
                <input 
                  type="checkbox" 
                  id='is_cut' 
                  className='checkbox my-auto'
                  value={data.is_cut}
                  onChange={() => setData('is_cut', !data.is_cut)}
                  checked={data.is_cut}
                />
                <div className='font-bold text-red-600'>Potongan</div>
              </label>
            </div>
            {
              isUpdate && <div className='w-2/6'>
                <label htmlFor={`is_active`} className='flex cursor-pointer gap-5'>
                  <input 
                    type="checkbox" 
                    id='is_active' 
                    className='checkbox my-auto'
                    value={data.is_active}
                    onChange={() => setData('is_active', !data.is_active)}
                    checked={data.is_active}
                  />
                  <div className='font-bold'>Aktif</div>
                </label>
              </div>
            }
          </div>

          <div className='mt-6 flex justify-end'>
            <SecondaryButton onClick={e => setShowModalInput(false)}>Batal</SecondaryButton>

            <PrimaryButton className='ms-3' disabled={processing}>
              {modalInputLabel.submit}
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <form onSubmit={handleSubmitDelete} className='p-6'>
          <h2 className='text-lg font-medium text-gray-900 text-center'>{titleDeleteModal}</h2>

          <div className='mt-6 flex justify-end'>
            <SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

            <DangerButton className='ms-3' disabled={processing}>
              Hapus
            </DangerButton>
          </div>
        </form>
      </Modal>
      {/* Modal */}
    </>
  );
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Data Komponen Penggajian</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Data Komponen Penggajian'
    backLink={
      <Link href={route('data-master', page.props.organization.id)}>
        <IoArrowBackOutline />
      </Link>
    }
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('data-master', page.props.organization.id)}>Data Master</Link>
          </li>
          <li>Data Komponen Penggajian</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
