import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import DangerButton from '@/Components/DangerButton';
import ProgramDesktop from './Components/ProgramDesktop';
import ProgramMobile from './Components/ProgramMobile';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeDanger from '@/Components/Badges/BadgeDanger';

export default function Index({role, organization, programs, searchFilter, code}) {
  const {data, setData, post, patch, delete:destroy, processing, errors, setError, reset} = useForm({
    'code' : '',
    'description' : '',
    'name' : '',
    'is_active' : true,
    'user_name' : ''
  });

  const [showModalInput, setShowModalInput] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState({
    id: 0,
    name: ''
  });

  const [search, setSearch] = useState(searchFilter || '');
  const [dataFilter, setDataFilter] = useState({
    'status' :''
  });
  const [debounceValue] = useDebounce(search, 500);
	const prevSearch = usePrevious(search);

  // useEffect
  useEffect(() => {
    if(prevSearch!==undefined) {
      handleReloadPage();
    }
  },[debounceValue])

  // function
  const handleSubmitInput = (e) => {
    e.preventDefault();

    isEdit 
    ? patch(route('data-master.program.update', {organization: organization.id, program: selectedProgram.id}), {
      onSuccess: () => {
        toast.success(`Program Kegiatan Berhasil Diubah`, {
          position: toast.POSITION.TOP_CENTER
        });
        reset();
        setShowModalInput(false);
      },
    })
    : post(route('data-master.program.post', organization.id),{
      onSuccess: () => {
        toast.success(`Program Kegiatan Berhasil Ditambahkan`, {
          position: toast.POSITION.TOP_CENTER
        });
        reset();
        setShowModalInput(false);
      },
    })
  } 

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    destroy(route('data-master.program.destroy', {organization: organization.id, program: selectedProgram.id}), {
      onSuccess: () => {
        toast.success(`Program Kegiatan Berhasil Dihapus`, {
          position: toast.POSITION.TOP_CENTER
        });
        reset();
        setShowModalDelete(false);
      },
      onError: error => {
        toast.error(error.delete, {
          position: toast.POSITION.TOP_CENTER
        });
        reset();
        setShowModalDelete(false);
      }
    })
  }

  const handleCancelInput = () => {
    setIsEdit(false);
    setShowModalInput(false);
    setError({
      'code' : '',
      'description' : '',
      'name' : '',
      'is_active' : ''
    });
    reset();
  }

  const handleShowInputModal = () => {
    setShowModalInput(true);
    getNewRef();
  }

  const handleCloseDetailModal = () => {
    setShowModalDetail(false);
    reset();
  }

  const handleShow = (program) => {
    setData({
      'code' : program.code || '',
      'description' : program.description || '',
      'name' : program.name || '',
      'is_active' : program.is_active,
      'user_name' : program.user.name
    });
    setShowModalDetail(true);
  }

  const handleEdit = (program) => {
    setShowModalInput(true);
    setIsEdit(true);
    setSelectedProgram({
      id: program.id,
      name: program.name
    });
    setData({
      'code' : program.code || '',
      'description' : program.description || '',
      'name' : program.name || '',
      'is_active' : program.is_active
    });
  }

  const handleDelete = (program) => {
    setShowModalDelete(true);
    setSelectedProgram({
      id: program.id,
      name: program.name,
    });
  }

  const handleFilter = (e) => {
    e.preventDefault();
    handleReloadPage();
    setShowModalFilter(false);
  }

  const getNewRef = () => {
    router.reload({
      only: ['code'],
      onSuccess: page => {
        setData('code', page.props.code)
      }, 
    })
  }

  const handleReloadPage = () => {
    router.reload({
      only: ['programs'],
      data: {
        search, 
        'is_active' : dataFilter.status
      },
      preserveState: true
    });
  }

  return (
    <>
      <Head title='Data Prgram Kegiatan' />
      <ToastContainer />
      {/* Mobile */}
        {
          (role !== 'viewer') &&<AddButtonMobile label={"Tambah"} handleShowInputModal={handleShowInputModal}/> 
        }
        <TitleMobile 
          zIndex={'z-50'}
          search={search}
          setSearch= {e => setSearch(e.target.value)}
          pageBefore={
                      programs.links[0].url 
          ? <Link href={`/data-master/programs?page=${programs.current_page - 1}&search=${search}`} preserveState only={['programs']}><IoPlayBack /></Link>
          : <div className='text-gray-300'><IoPlayBack /></div>
          }
          pageAfter={
                      programs.links[programs.links.length-1].url 
                      ? <Link href={`/data-master/programs?page=${programs.current_page + 1}&search=${search}`}
                          only={['programs']} preserveState>
                          <IoPlayForward />
                      </Link>
                      : <div className='text-gray-300'><IoPlayForward /></div>
          }
          page={
              <>
                  {programs.current_page}/{programs.last_page}
              </>
          }
          data={programs}
          hasFilter={true}
          showFilter={() => setShowModalFilter(true)}
        />
        <ContentMobile>
        {
          programs.data.map(program => 
          <ProgramMobile
            program={program}
            key={program.id}
            handleDelete={() => handleDelete(program)}
            handleEdit={() => handleEdit(program)}
            handleShow={() => handleShow(program)}
            role={role}
          />
          )
        }
        </ContentMobile>
      {/* Mobibie */}

      {/* Desktop */}
        <ContainerDesktop>
          <TitleDesktop>
            <div className='my-auto w-5/12'>
              {
                (role !== 'viewer') &&
                <PrimaryButton className='py-3' onClick={handleShowInputModal}>
                        Tambah Data
                </PrimaryButton>         
                                    
              }
            </div>

            <div className='my-auto w-4/12 gap-5 justify-end'>
              <div className='text-end'>
                <button className='py-3 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
              </div>
            </div>
              
              <div className='w-3/12 border flex rounded-lg'>					
                <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
                <input id='search-input' name='search-input' type="search" placeholder='Cari Program Kegiatan' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
                onChange={e => setSearch(e.target.value)}/>
              </div>

              <div className='italic text-xs my-auto w-1/12 text-center'>
                <PageNumber data={programs} />
              </div>

              <div className='my-auto flex space-x-2 w-1/12'>
                <div className='my-auto'>
                  {
                    programs.links[0].url 
                    ? <Link 
                          href={`/data-master/${organization.id}/programs?page=${programs.current_page - 1}&search=${search}`}
                          preserveState only={['programs']}
                        >
                          <IoPlayBack />
                        </Link>
                    : <div className='text-gray-300'><IoPlayBack /></div>
                  }                                
                </div>
                  <div className='my-auto'>{programs.current_page}/{programs.last_page}</div>
                  <div className='my-auto'>
                      {
                          programs.links[programs.links.length-1].url 
                          ? <Link 
                                  href={`/data-master/${organization.id}/programs?page=${programs.current_page + 1}&search=${search}`}
                                  only={['programs']} preserveState
                              >
                              <IoPlayForward />
                          </Link>
                          : <div className='text-gray-300'><IoPlayForward /></div>
                      }   
                  </div>
              </div>
          </TitleDesktop>

          <div className='sm:flex hidden gap-5'>
            <div className='w-full'>
              <ContentDesktop>
                <table className='table table-pin-rows table-pin-cols text-base'>
                  <thead className='text-base text-gray-900'>
                    <tr className=''>
                      <th className='bg-gray-200'>Kode</th>
                      <th className='bg-gray-200'>Nama Proyek</th>
                      <th className='bg-gray-200'>Deksripsi</th>
                      <th className='bg-gray-200 text-center'>Status Aktif</th>
                      <th className='bg-gray-200'></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    programs.data.map((program, index) =>
                    <ProgramDesktop 
                      key={index} 
                      program={program} 
                      className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                      handleDelete={() => handleDelete(program)}
                      handleEdit={() => handleEdit(program)}
                      handleShow={() => handleShow(program)}
                      role={role}
                    />
                    )
                  }
                  </tbody>
                </table>
              </ContentDesktop>
            </div>
          </div>
        </ContainerDesktop>
      {/* Desktop */}

      {/* Modal */}
        {/* Input/Edit */}
        <Modal show={showModalInput} onClose={handleCancelInput}>
          <form 
            onSubmit={handleSubmitInput} 
            className="p-6"
            id='Tambah'
            name='Tambah'
          >
            <h2 className="text-lg font-medium text-gray-900">
              { isEdit ? "Edit" : "Tambah" } Program Kegiatan
            </h2>

            <div className="mt-6 ">
              <div className='flex w-full gap-1'>
                  <div className='w-1/4 my-auto'>
                    <InputLabel value={'Nama'} className=' mx-auto my-auto' htmlFor="name"/>
                  </div>
                  <div className='w-3/4 relative'>
                  <TextInput 
                    id="name"
                    name='name'
                    className={`w-full ${errors?.name && 'border-red-500'}`}
                    placeholder='Nama Program Kegiatan'
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                  />
                  {
                    errors?.name && <div className='text-red-500 text-xs absolute'>{errors.name}</div>
                  }
                  
                  </div>
                  
              </div>
            </div>

            <div className="mt-6 ">
              <div className='flex w-full gap-1'>
                <div className='w-1/4 my-auto'>
                  <InputLabel value={'Kode'} className=' mx-auto my-auto' htmlFor="code"/>
                </div>
                <div className='w-3/4 relative'>
                <TextInput 
                  id="code"
                  name='code'
                  className={`w-full ${errors?.code && 'border-red-500'}`}
                  placeholder='Kode'
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value.toUpperCase())}
                  autoComplete="false"
                />
                {
                  errors?.code && <div className='text-red-500 text-xs absolute'>{errors.code}</div>
                }
                </div>
              </div>
            </div>

            <div className="mt-6 ">
              <div className='flex w-full gap-1'>
                <div className='w-1/4 my-auto'>
                  <InputLabel value={'Deskripsi'} className=' mx-auto my-auto' htmlFor="description"/>
                </div>
                <div className='w-3/4 flex'>
                <TextInput 
                  id="description"
                  name='description'
                  className={`w-full ${errors?.description && 'border-red-500'}`}
                  placeholder='Deskripsi'
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value.toUpperCase())}
                  autoComplete="false"
                />
                {
                  errors?.description && <div className='text-red-500 text-xs'>{errors.description}</div>
                }
                </div>
              </div>
            </div>

            {
              isEdit && 
              <div className='flex justify-start w-full gap-1 mt-5'>  
                <div className='w-1/12'>
                  <div className="form-control ">
                      <label className="label cursor-pointer gap-2" htmlFor={`is_active`}>
                          <input 
                          type="checkbox" 
                          className="checkbox" 
                          id={`is_active`}
                          value={data.is_active}
                          onChange={() => setData('is_active', !data.is_active)}
                          checked={data.is_active}
                          />
                          <span className="label-text font-bold">Aktif</span> 
                      </label>
                  </div>
                  {
                    errors && errors.is_active && 
                    <div className='-mb-3'>
                        <div className='text-xs text-red-500'>{errors.is_active}</div>  
                    </div>
                  }
                </div>
              </div>
            }
            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={handleCancelInput}>Batal</SecondaryButton>

              <PrimaryButton className="ms-3" disabled={processing}>
              { isEdit ? "Edit" : "Tambah" }
              </PrimaryButton>
            </div>
          </form>
        </Modal>

        {/* Detail */}
        <Modal show={showModalDetail} onClose={handleCloseDetailModal}>
          <div className='px-5 py-2'>
            <div className='text-lg font-bold py-3 border-b'>
              Detail Program Kegiatan
            </div>
            <div className='py-3 space-y-2'>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'>Nama Kegiatan</div>
                <div className='sm:w-2/3 flex flex-row gap-1'>
                  <span className="hidden sm:block">: </span>
                  {data.name}
                </div>
              </div>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'>Kode</div>
                <div className='sm:w-2/3 flex flex-row gap-1'>
                  <span className="hidden sm:block">: </span>
                  {data.code}
                </div>
              </div>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'>Deskripsi</div>
                <div className='sm:w-2/3 flex flex-row gap-1'>
                  <span className="hidden sm:block">: </span>
                  {data.description}
                </div>
              </div>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'>Status</div>
                <div className='sm:w-2/3 flex flex-row gap-1'>
                  <span className="hidden sm:block">: </span>
                  {data.is_active ? <BadgeSuccess>Aktif</BadgeSuccess> : <BadgeDanger>Tidak Aktif</BadgeDanger>}            
                </div>
              </div>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'>Dibuat Oleh</div>
                <div className='sm:w-2/3 flex flex-row gap-1'>
                  <span className="hidden sm:block">: </span>
                  {data.user_name}
                </div>
              </div>
              <div className='flex sm:gap-5 flex-col sm:flex-row'>
                <div className='sm:w-1/3 font-bold sm:font-normal'></div>
                <div className='sm:w-2/3 text-end'>
                  <SecondaryButton onClick={handleCloseDetailModal}>Tutup</SecondaryButton>         
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showModalDelete} onClose={handleCloseDetailModal}>
          <form 
            onSubmit={handleSubmitDelete} 
            className="p-6"
            id='deleteForm'
            name='deleteForm'
          >
            <h2 className="text-lg font-medium text-gray-900 text-center">
              Hapus Program Kegiatan {selectedProgram.name}
            </h2>

            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setShowModalDelete(false)}>Batal</SecondaryButton>

              <DangerButton className="ms-3" 
                  disabled={processing}
                  >
                  Hapus
              </DangerButton>
            </div>
          </form>
        </Modal>

        {/* Filter  */}
        <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
          <form 
            onSubmit={handleFilter} 
            className="p-6"
            id='filter'
            name='filter'
          >
            <h2 className="text-lg font-medium text-gray-900">
              Filter Proyek
            </h2>

            <div className="mt-6 ">
                <div className='flex w-full gap-1'>
                    <div className='w-1/4 my-auto'>
                        Status
                    </div>
                    <div className='w-3/4 flex'>
                        <select className="select select-bordered w-full" id='status' value={dataFilter.status} onChange={(e) => setDataFilter({...dataFilter, status: e.target.value})}>
                            <option disabled value=''>--Pilih Status Aktif--</option>
                            <option value=''>Semua</option>
                            <option value={true}>Aktif</option>
                            <option value={false}>Tidak Aktif</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

              <PrimaryButton className="ms-3">
                  Filter
              </PrimaryButton>
            </div>
          </form>
        </Modal>

      {/* Modal */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Program Kegiatan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title="Data Program Kegiatan"
    backLink={<Link href={route('data-master',page.props.organization.id)}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Data Master</Link></li> 
            <li>Data Program Kegiatan</li>
        </ul>
    </div>}
    role={page.props.role}
/>
