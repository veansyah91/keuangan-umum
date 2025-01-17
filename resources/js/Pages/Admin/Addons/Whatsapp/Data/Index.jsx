import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import WhatsappDataDesktop from './Components/WhatsappDataDesktop';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';


export default function Index(
  { whatsappPlugins, searchFilter, statusFilter, connectionFilter, flash }
) {
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [search, setSearch] = useState(searchFilter || '');

  const [showModalEdit, setShowModalEdit] = useState(false);

  const { data, setData, processing, patch, errors, reset } = useForm({
    'name' : '',
    'phone' : '',
    'appKey' : '',
    'authkey' : '',
    'url' : '',
    'id': null
  });

  const [dataFilter, setDataFilter] = useState({
    status: statusFilter || '',
    connection: connectionFilter || '',
  });

  const [debounceValue] = useDebounce(search, 500);

  const prevSearch = usePrevious(search);

  // useEffect
  useEffect(() => {
		flash?.success && toast.success(flash.success, {
			position: toast.POSITION.TOP_CENTER,
		});
    
	},[]);

  useEffect(() => {
    if (prevSearch !== undefined) {
      handleReloadPage();
    }
  }, [debounceValue]);

  // function
  const handleReloadPage = () => {
    router.reload({
      only: ['whatsappPlugins'],
      data: {
        search,
        status: dataFilter.status,
        connection: dataFilter.connection,
      },
    });
  };
  const handleEdit = (plugin) => {    
    setData({
      name: plugin.organization.name,
      url: plugin.url,
      phone: plugin.phone,
      appKey: plugin.appKey,
      authkey: plugin.authkey,
      id: plugin.id
    });
    setShowModalEdit(true);
  }

  const handleCheckConnection = (plugin) => {
    patch(route('admin.add-ons.whatsapp.data.connection', {plugin: plugin.id}),{
      onSuccess: ({ props }) => {
        const { flash } = props;

        flash?.success && toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
      onError: errors => {        
        errors?.error && toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    })
    
  }

  const handleChangeValue = (values) => {
		setData('phone', values.value)
	}

  const handleFilter = (e) => {
    e.preventDefault();
    setShowModalFilter(false);
    handleReloadPage();
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    patch(route('admin.add-ons.whatsapp.data.update', {plugin: data.id}), {
      onSuccess: ({ props }) => {
        const { flash } = props;

				toast.success(flash.success, {
					position: toast.POSITION.TOP_CENTER,
				});

        reset();
        setShowModalEdit(false);        
      }
    })

  }

  
  return (
    <>
      <Head title='Data Whatsapp Plugins' />
      <ToastContainer />

      {/* Mobile */}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          whatsappPlugins.links[0].url ? (
            <Link
              href={route('admin.add-ons.whatsapp.data', {
                page: whatsappPlugins.current_page - 1,
                search: search,
              })}
              preserveState
              only={['whatsappPlugins']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          whatsappPlugins.links[whatsappPlugins.links.length - 1].url ? (
            <Link
              href={route('admin.add-ons.whatsapp.data', {
                page: whatsappPlugins.current_page + 1,
                search: search,
              })} 
              only={['whatsappPlugins']}
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
            {whatsappPlugins.current_page}/{whatsappPlugins.last_page}
          </>
        }
        data={whatsappPlugins}
        hasFilter={true}
        showFilter={() => setShowModalFilter(true)}
        hasDate={false}
      />
      {/* Mobile */}

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-5/12'>
            
          </div>
          <div className='my-auto w-4/12 flex gap-5 justify-end'>
            <button className='py-3 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
              <IoFilter />
            </button>
          </div>
          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Data'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={whatsappPlugins} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {whatsappPlugins.links[0].url ? (
                <Link
                  href={route('admin.add-ons.whatsapp.data', {
                    page: whatsappPlugins.current_page - 1,
                    search: search,
                  })} 
                  preserveState
                  only={['whatsappPlugins']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {whatsappPlugins.current_page}/{whatsappPlugins.last_page}
            </div>
            <div className='my-auto'>
              {whatsappPlugins.links[whatsappPlugins.links.length - 1].url ? (
                <Link
                  href={route('admin.add-ons.whatsapp.data', {
                    page: whatsappPlugins.current_page + 1,
                    search: search,
                  })} 
                  only={['whatsappPlugins']}
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
              <table className='table table-sm table-pin-rows table-pin-cols text-base'>
                <thead className='text-base text-gray-900'>
                  <tr className=''>
                    <th className='bg-gray-200'>Organisasi</th>
                    <th className='bg-gray-200'>Handphone</th>
                    <th className='bg-gray-200'>Tanggal Expired</th>
                    <th className='bg-gray-200'>URL/App Key/Auth Key</th>
                    <th className='bg-gray-200'>Koneksi</th>
                    <th className='bg-gray-200'>Koneksi Terakhir</th>
                    <th className='bg-gray-200'>Status</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    whatsappPlugins.data.map((whatsappPlugin, index) => 
                      <WhatsappDataDesktop 
                        key={index}
                        whatsappPlugin={whatsappPlugin}
                        className={`${index % 2 !== 0 && 'bg-gray-100'}`}
                        handleEdit={() => handleEdit(whatsappPlugin)}
                        handleCheckConnection={() => handleCheckConnection(whatsappPlugin)}
                        processing={processing}
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
      {/* Edit */}
      <Modal show={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <form onSubmit={handleSubmitEdit} className='p-6' id='deleteForm' name='deleteForm'>
          <h2 className='text-lg font-medium text-gray-900 text-center'>Ubah Data Whatsapp Broadcasting { data.name }</h2>
          <div className='mt-5 '>
            <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='phone' value='No. Handphone' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                <NumericFormat
                  value={data.phone}
                  customInput={TextInput}
                  onValueChange={(values) => handleChangeValue(values)}
                  thousandSeparator={false}
                  className='text-start w-full border'
                  placeholder='628xxx'
                  prefix={''}
                />
                {errors && errors.phone && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.phone}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='url' value='URL' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                <TextInput
                  id='url'
                  type='text'
                  name='url'
                  value={data.url || ''}
                  className={`mt-1 w-full ${errors && errors.url && 'border-red-500'}`}
                  onChange={(e) => setData('url', e.target.value.toString())}
                  placeholder='URL'
                />
                {errors && errors.url && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.url}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='app_key' value='App Key' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                <TextInput
                  id='app_key'
                  type='text'
                  name='app_key'
                  value={data.appKey || ''}
                  className={`mt-1 w-full ${errors && errors.appKey && 'border-red-500'}`}
                  onChange={(e) => setData('appKey', e.target.value.toString())}
                  placeholder='App Key'
                />
                {errors && errors.appKey && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.appKey}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1 mt-5'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='auth_key' value='Auth Key' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                <TextInput
                  id='auth_key'
                  type='text'
                  name='auth_key'
                  value={data.authkey || ''}
                  className={`mt-1 w-full ${errors && errors.authkey && 'border-red-500'}`}
                  onChange={(e) => setData('authkey', e.target.value.toString())}
                  placeholder='Auth Key'
                />
                {errors && errors.appKey && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.appKey}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <SecondaryButton onClick={() => setShowModalEdit(false)}>Batal</SecondaryButton>

            <PrimaryButton className='ms-3' disabled={processing}>
                Ubah
            </PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
        <form onSubmit={handleFilter} className='p-6'>
          <h2 className='text-lg font-medium text-gray-900'>Filter Organisasi</h2>

          <div className='mt-6 space-y-2'> 
            <div className='flex w-full gap-1'>
              <div className='w-3/12 my-auto'>Status</div>
              <div className='w-8/12'>
                <select
                  className='w-full rounded-lg border-gray-300'
                  onChange={(e) => setDataFilter({ status: e.target.value })}
                  value={dataFilter.status}>
                  <option value=''>Semua</option>
                  <option value={true}>Aktif</option>
                  <option value={false}>Tidak Aktif</option>
                </select>
              </div>
              <div className='w-1/12 my-auto'></div>
            </div>
            <div className='flex w-full gap-1'>
              <div className='w-3/12 my-auto'>Koneksi</div>
              <div className='w-8/12'>
                <select
                  className='w-full rounded-lg border-gray-300'
                  onChange={(e) => setDataFilter({ connection: e.target.value })}
                  value={dataFilter.connection}>
                  <option value=''>Semua</option>
                  <option value={true}>Connected</option>
                  <option value={false}>Disconnected</option>
                </select>
              </div>
              <div className='w-1/12 my-auto'></div>
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

            <PrimaryButton className='ms-3'>Filter</PrimaryButton>
          </div>
        </form>
      </Modal>
      {/* Modal */}
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Data</Header>}
      breadcrumbs={
        <div className='text-sm breadcrumbs'>
            <ul>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons')}>Addons</Link>
                </li>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons.whatsapp')}>Whatsapp Broadcasting Addons</Link>
                </li>
                <li>Data</li>
            </ul>
        </div>
      }
      backLink={
        <Link href={route('admin.add-ons.whatsapp')}>
            <IoArrowBackOutline />
        </Link>
      }
      children={page}
      user={page.props.auth.user}
      title='Data'
  />
);
