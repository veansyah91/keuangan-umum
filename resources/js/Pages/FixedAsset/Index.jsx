import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import { NumericFormat } from 'react-number-format';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import FixedAssetMobile from './Components/FixedAssetMobile';
import FixedAssetDesktop from './Components/FixedAssetDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';

export default function Index({ role, organization, fixedAssets, status, searchFilter, startDate, endDate, flash, accounts }) {
  // console.log(fixedAssets);

  const [search, setSearch] = useState(searchFilter || '');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDisposal, setShowDisposal] = useState(false);

  const {data, setData, delete: destroy, patch, errors, setError, processing, reset} = useForm({
    'id': null,
    'no_ref' : '',
    'name': '',
    'description' : '',
    'debit_account' : {
      'id' : null,
      'is_cash' : false,
      'code': ''
    }, 
    'value_in_book' : 0,
    'lifetime' : 0
  });

  const [modalDelete, setModalDelete] = useState({
		title: ''
   });

	const [dateValue, setDateValue] = useState({
		startDate: startDate || '', 
		endDate: endDate || ''
	});

  const [selectedAccount, setSelectedAccount] = useState(
    {id: null, name: '', code: '', is_cash:true},
  ); 

  // useEffect
  useEffect(() => {
    flash.error && 
    toast.error(flash.error, {
      position: toast.POSITION.TOP_CENTER
    });
  },[])

	// function
	const handleDateValueChange = (newValue) => {
    setDateValue(newValue); 
  }

  const handleDelete = (fixedAsset) => {
    setShowDeleteConfirmation(true);
    setModalDelete({
			title: `Hapus Data Harta Tetap ${fixedAsset.name}, No Ref ${fixedAsset.code}`
		});
    setData({...data, 
      'id' : fixedAsset.id,
      'code' : fixedAsset.code,
      'name' : fixedAsset.name,
    })
  }

  const handleDisposal = (fixedAsset) => {
    // console.log(fixedAsset.lifetime);
    let lifetime = parseInt(fixedAsset.lifetime);
    setShowDisposal(true);
    setData({...data, 
      'id' : fixedAsset.id,
      'name' : fixedAsset.name,
      'description' : fixedAsset.disposal_description || '',
      'lifetime' : lifetime,
      'value_in_book' : fixedAsset.value - fixedAsset.depreciation_accumulated
    });

  }

  const handleSubmitDelete = (e) => {
		e.preventDefault();

    destroy(route('data-master.fixed-asset.destroy', {organization: organization.id, fixedAsset: data.id}), {
      onSuccess: () => {
        toast.success(`Harta Tetap Berhasil Dihapus`, {
          position: toast.POSITION.TOP_CENTER
        });
        setShowDeleteConfirmation(false);

        reset();
      },
      onError: errors => {
        toast.error(errors.message, {
          position: toast.POSITION.TOP_CENTER
        });
        setShowDeleteConfirmation(false);
      }, 
      preserveScroll: true
    })
  }

  const handleSubmitDisposal = (e) => {
    e.preventDefault();

    console.log(data);
  }

  const handleSelectedAccount = (selected) => {
    setSelectedAccount(selected);
    
    setData({
      ...data,
      'debit_account' : {
        'id' : selected.id,
        'is_cash' : selected.is_cash,
        'code' : selected.code
      },
    })
  }

  return (
    <>
      <Head title='Harta Tetap' />
      <ToastContainer />

			{/* Mobile */}
			{
				(role !== 'viewer') && <Link href={route('data-master.fixed-asset.create', organization.id)}><AddButtonMobile label={"Tambah"}/></Link> 
			}
			<TitleMobile 
        zIndex={'z-50'}
        search={search}
        setSearch= {e => setSearch(e.target.value)}
        pageBefore={
              fixedAssets.links[0].url 
        ? <Link href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page - 1}&search=${search}`} preserveState only={['fixedAssets']}><IoPlayBack /></Link>
        : <div className='text-gray-300'><IoPlayBack /></div>
        }
        pageAfter={
              fixedAssets.links[fixedAssets.links.length-1].url 
              ? <Link href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page + 1}&search=${search}`}
                only={['fixedAssets']} preserveState>
                <IoPlayForward />
              </Link>
              : <div className='text-gray-300'><IoPlayForward /></div>
        }
        page={
          <>
            {fixedAssets.current_page}/{fixedAssets.last_page}
          </>
        }
        data={fixedAssets}
        hasFilter={true}
        showFilter={() => setShowModalFilter(true)}
        hasDate={true}
        dateValue={dateValue}
        onChangeDate={handleDateValueChange}
      />
      <ContentMobile>
      {
        fixedAssets.data.map(fixedAsset => 
          <FixedAssetMobile
            fixedAsset={fixedAsset}
            key={fixedAsset.id}
            handleDelete={() => handleDelete(fixedAsset)}
            handleDisposal={() => handleDisposal(fixedAsset)}
            role={role}
          />
        )
      }
      </ContentMobile>
			{/* Mobile */}

      {/* Desktop */}
        <ContainerDesktop>
          <TitleDesktop>
            <div className='my-auto w-5/12'>
              {
                (role !== 'viewer') &&
                <Link href={route('data-master.fixed-asset.create', organization.id)}>
                  <PrimaryButton className='py-3'>
                      Tambah Data
                  </PrimaryButton>         
                </Link>                   
              }
            </div>
            <div className='my-auto w-4/12 flex gap-5'>
              <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
              <Datepicker
                value={dateValue} 
                onChange={handleDateValueChange} 
                showShortcuts={true} 
                configs={{
                  shortcuts: {
                    today: "Hari Ini", 
                    yesterday: "Kemarin", 
                    past: period => `${period} Hari Terakhir`, 
                    currentMonth: "Bulan Ini", 
                    pastMonth: "Bulan Lalu", 
                    currentYear: "Tahun Ini"
                  },
                }} 
                separator={"s.d"}                                 
              />					
            </div>

            <div className='w-3/12 border flex rounded-lg'>					
              <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
              <input id='search-input' name='search-input' type="search" placeholder='Cari Harta Tetap' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
              onChange={e => setSearch(e.target.value)}/>
            </div>

            <div className='italic text-xs my-auto w-1/12 text-center'>
                <PageNumber data={fixedAssets} />
            </div>

            <div className='my-auto flex space-x-2 w-1/12'>
              <div className='my-auto'>
                {
                  fixedAssets.links[0].url 
                  ? <Link 
                      href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page - 1}&search=${search}`}
                      preserveState only={['fixedAssets']}
                    >
                      <IoPlayBack />
                    </Link>
                  : <div className='text-gray-300'><IoPlayBack /></div>
                }                                
              </div>
              <div className='my-auto'>{fixedAssets.current_page}/{fixedAssets.last_page}</div>
              <div className='my-auto'>
                {
                  fixedAssets.links[fixedAssets.links.length-1].url 
                  ? <Link 
                      href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page + 1}&search=${search}`}
                      only={['fixedAssets']} preserveState
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
                      <th className='bg-gray-200'>Tanggal Perolehan</th>
                      <th className='bg-gray-200'>No. Ref</th>
                      <th className='bg-gray-200'>Nama</th>
                      <th className='bg-gray-200 text-end'>Nilai</th>
                      <th className='bg-gray-200 text-center'>Penyusutan Perbulan</th>
                      <th className='bg-gray-200 text-center'>Akumulasi Penyusutan</th>
                      <th className='bg-gray-200 text-center'>Nilai Buku</th>
                      <th className='bg-gray-200'></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    fixedAssets.data.map((fixedAsset, index) => 
                      <FixedAssetDesktop
                        fixedAsset={fixedAsset}
                        key={fixedAsset.id}
                        className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                        handleDelete={() => handleDelete(fixedAsset)}
                        handleDisposal={() => handleDisposal(fixedAsset)}
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

        {/* Delete */}
        <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
          <form 
            onSubmit={handleSubmitDelete} 
            className="p-6"
            id='deleteForm'
            name='deleteForm'
          >
            <h2 className="text-lg font-medium text-gray-900 text-center">
              {modalDelete.title}
            </h2>

            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setShowDeleteConfirmation(false)}>Batal</SecondaryButton>

              <DangerButton className="ms-3" 
                disabled={processing}
                >
                Hapus
              </DangerButton>
            </div>
          </form>
        </Modal>

        {/* Disposal */}
        <Modal show={showDisposal} onClose={() => setShowDisposal(false)}>
          <form 
            onSubmit={handleSubmitDisposal} 
            className="p-6"
            id='disposalForm'
            name='disposalForm'
          >
            <h2 className="text-lg font-medium text-gray-900 text-center">
              Disposal Harta Tetap
            </h2>
            <div className='mt-5 space-y-2'>

              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel value={'Nama Harta Tetap'} htmlFor='name' className=' mx-auto my-auto'/>
                </div>
                
                <div className='w-full sm:w-2/3'>
                  <TextInput 
                    id="name"
                    name='name'
                    className={`w-full ${errors?.name && 'border-red-500'}`}
                    
                    placeholder='Nama Harta Tetap'
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value.toUpperCase())}
                    disabled
                  />
                  {
                    errors?.name && <span className='text-red-500 text-xs'>{errors.name}</span>
                  }
                </div>
              </div>

              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                  <InputLabel value={'Keterangan'} htmlFor='description' className=' mx-auto my-auto'/>
                </div>
                
                <div className='w-full sm:w-2/3'>
                  <TextInput 
                    id="description"
                    name='decription'
                    className={`w-full ${errors?.description && 'border-red-500'}`}
                    
                    placeholder='Keterangan'
                    value={data.description}
                    onChange={(e) => setData('decription', e.target.value.toUpperCase())}
                    disabled
                  />
                  {
                    errors?.decription && <span className='text-red-500 text-xs'>{errors.decription}</span>
                  }
                </div>
              </div>

              {
                (data.lifetime = 0 || data.value_in_book > 0) && 
                <div className='flex flex-col sm:flex-row justify-between gap-1'>
                  <div className='w-full sm:w-1/3 my-auto'>
                    <InputLabel value={'Akun Kredit'} htmlFor='credit_account_id' className=' mx-auto my-auto'/>
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
                    {
                      errors?.credit_account?.id && <span className='text-red-500 text-xs'>{errors.credit_account.id}</span>
                    }
                  </div>
                </div>
              }
              
            </div>

            <div className="mt-6 flex justify-end">
              <SecondaryButton onClick={() => setShowDisposal(false)}>Batal</SecondaryButton>

              <DangerButton className="ms-3" 
                disabled={processing}
                >
                Hapus
              </DangerButton>
            </div>
          </form>
        </Modal>
        
      {/* Desktop */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Harta Tetap</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title="Harta Tetap"
    backLink={<Link href={route('data-master',page.props.organization.id)}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Master</Link></li> 
            <li>Harta Tetap</li>
        </ul>
    </div>}
    role={page.props.role}
/>
