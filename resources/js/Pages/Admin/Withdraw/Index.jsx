import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import Datepicker from 'react-tailwindcss-datepicker';
import formatNumber from '@/Utils/formatNumber';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import dayjs from 'dayjs';
import { IoCreateOutline, IoEllipsisVertical, IoTrashOutline } from 'react-icons/io5/index.esm';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ToastContainer, toast } from 'react-toastify';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeWarning from '@/Components/Badges/BadgeWarning';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import UserSelectInput from '@/Components/SelectInput/UserSelectInput';


function Index({ withdraws, searchFilter, statusFilter, affiliation, affiliators, startDate, endDate }) {
  console.log(affiliators);
  const [search, setSearch] = useState(searchFilter || '');
  const [filterValue, setFilterValue] = useState({
    status: statusFilter || '',
  });

  const [showModalFilter, setShowModalFilter] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [dateValue, setDateValue] = useState({
    startDate: startDate, 
    endDate: endDate
  });

  const { data, setData, patch, processing, reset } = useForm({
    name: '',
    no_ref: '',
    email: '',
    value: 0,
    bank_account: '',
    bank_name : '',
    date: '',
    id: null
  });

  const [selectedAffiliator, setSelectedAffiliator] = useState(
    {id: null, name: '', email:''}
  ); 

	const [debounceDateValue] = useDebounce(dateValue, 500);
  const [debounceValue] = useDebounce(search, 500);

	const prevSearch = usePrevious(search);

  // useEffect
  useEffect(() => {
    if(prevSearch!==undefined) {
      handleReloadPage();
    }
  },[debounceDateValue, debounceValue])

  // function
  const handleDateValueChange = (newValue) => {
    setDateValue(newValue); 
  } 

  const handleShowConfirmationModal = (data) => {
    setShowConfirmationModal(true);

    router.reload({
      only: ['affiliation'],
      data: {
        'user_id' : data.user_id
      },
      onSuccess: result => {
        const { props } = result;
        setData({
          name: data.user.name,
          date: dayjs(data.created_at).format('MMMM YYYY, DD'),
          no_ref: data.no_ref,
          email: data.user.email,
          value: data.value,
          bank_account: props.affiliation.bank_account,
          bank_name : props.affiliation.bank_name,
          id: data.id
        });
      },
      preserveState: true
    });
  } 

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    router.reload({
      only: ['withdraws'],
      data: {
        'user_id' : ''
      },
      onSuccess: _ => {
        reset();
      },
      preserveState: true
    });
  }

  const handleSubmitConfirmation = (e) => {
    e.preventDefault();
    patch(route('admin.user-master.withdraws.update', data.id), {
      onSuccess: result => {
        toast.success(`Penarikan Saldo No. Ref: ${data.no_ref} Berhasil Dikonfirmasi`, {
          position: toast.POSITION.TOP_CENTER
        });
        reset();
        setShowConfirmationModal(false);

      }
    })
  }

  const handleSelectedAffiliator = (data) => {
    console.log(data);
    setSelectedAffiliator({
      id: data.id, name: data.name, email:data.email
    });
  }
  
  const handleReloadPage = () => {
    router.reload({
      only:['withdraws'],
      data: {
        search,
        'start_date' : debounceDateValue.startDate, 
        'end_date' : debounceDateValue.endDate,
        'status' : filterValue.status,
        'user_id' : selectedAffiliator.id
      }
    })
  }

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    handleReloadPage();
    setShowModalFilter(false);
  }

  const handleDeleteSelectedAffiliator = () => {
    setSelectedAffiliator({
      id: null, name: '', email:''
    })
  }

  return (
    <>
      <Head title='Penarikan Saldo Afiliasi' />

      <ToastContainer />  

      {/* Mobile */}
      <TitleMobile 
        zIndex={'z-50'}
        search={search}
        setSearch= {e => setSearch(e.target.value)}
        pageBefore={
            withdraws.links[0].url 
            ? <Link href={`/admin/data-master/withdraws?page=${withdraws.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
            : <div className='text-gray-300'><IoPlayBack /></div>
        }
        pageAfter={
            withdraws.links[withdraws.links.length-1].url 
            ? <Link href={`/admin/data-master/withdraws?page=${withdraws.current_page + 1}&search=${search}`}
                only={['withdraws']} preserveState>
                <IoPlayForward />
            </Link>
            : <div className='text-gray-300'><IoPlayForward /></div>
        }
        page={
            <>
                {withdraws.current_page}/{withdraws.last_page}
            </>
        }
        data={withdraws}
        hasDate={true}
        dateValue={dateValue}
        onChangeDate={handleDateValueChange}
        showFilter={() => setShowModalFilter(true)}
      />
      {/* Content */}
      <ContentMobile>
        {
          withdraws.data.map(withdraw => 
            <div key={withdraw.id} className=' text-gray-900 py-2 px-1 border flex justify-between'>
              <div className='space-y-3'>
                <div>
                  {withdraw.no_ref}
                </div>
                <div className='text-sm'>
                  <div>{withdraw.user.name.toUpperCase()}</div>
                  <div>{withdraw.user.email}</div>
                    
                </div>
                <div className='text-sm'>
                  <div>
                    Diajukan Tanggal: { dayjs(withdraw.created_at).format('MMMM YYYY, DD') }
                  </div>
                  {
                    withdraw.status ? <div> Dikirim Tanggal: { dayjs(withdraw.updated_at).format('MMMM YYYY, DD') } </div> : ''
                  }
                  
                </div>
                <div className='text-sm'>
                    {
                        withdraw.status 
                        ? <BadgeSuccess>Telah Dikirim</BadgeSuccess>
                        : <BadgeWarning>Belum Dikirim</BadgeWarning>
                    }
                </div>
              </div>
              <div>
                <div>
                  Nilai Pengajuan : 
                </div>
                <div className='text-lg text-end font-bold'>
                  IDR. { formatNumber(withdraw.value) }
                </div>
              </div>   
              <div>
                <div className="dropdown dropdown-left">
                    <div                             
                        tabIndex={0} 
                        role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                        <IoEllipsisVertical />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                        <li>                                
                          <button onClick={() => handleShowConfirmationModal(withdraw)}>
                            <IoCreateOutline /> Edit
                          </button> 
                        </li>
                    </ul>
                </div>
              </div>                                   
            </div>) 
        }
      </ContentMobile>
      {/* Mobile */}

      {/* Desktop */}
        <ContainerDesktop>
          <TitleDesktop>
            <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
            <div className='w-1/4 my-auto '>
              <Datepicker
                value={dateValue} 
                onChange={handleDateValueChange} 
                showShortcuts={true} 
                classNames={'border-2'}
                separator={" sampai "} 
              />
            </div>
            <div className='w-1/4 border flex rounded-lg'>
              <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
              <input id='search-input' name='search-input' type="search" placeholder='Cari' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
              onChange={e => setSearch(e.target.value)}/>
            </div>

            <div className='italic text-xs my-auto w-1/12 text-center'>
                {formatNumber(withdraws.current_page*withdraws.per_page-(withdraws.per_page-1))}-{formatNumber(withdraws.to)} dari {formatNumber(withdraws.total)}
            </div>

            <div className='my-auto flex space-x-2 w-1/12'>
                <div className='my-auto'>
                    {
                        withdraws.links[0].url 
                        ? <Link href={`/admin/withdraws?page=${withdraws.current_page - 1}&search=${search}`}preserveState><IoPlayBack /></Link>
                        : <div className='text-gray-300'><IoPlayBack /></div>
                    }                                
                </div>
                <div className='my-auto'>{withdraws.current_page}/{withdraws.last_page}</div>
                <div className='my-auto'>
                    {
                        withdraws.links[withdraws.links.length-1].url 
                        ? <Link href={`/admin/withdraws?page=${withdraws.current_page + 1}&search=${search}`}
                            only={['withdraws']} preserveState>
                            <IoPlayForward />
                        </Link>
                        : <div className='text-gray-300'><IoPlayForward /></div>
                    }   
                </div>
            </div>
          </TitleDesktop>
          <ContentDesktop>
            <table className='table table-pin-rows table-pin-cols text-base'>
              <thead className='text-base text-gray-900'>
                <tr className=''>
                  <th className='bg-gray-200'>No Ref</th>
                  <th className='bg-gray-200'>Nama</th>
                  <th className='bg-gray-200'>Email</th>
                  <th className='bg-gray-200'>Diajukan Tanggal</th>
                  <th className='bg-gray-200'>Dikirim Tanggal</th>
                  <th className='bg-gray-200'>Nilai</th>
                  <th className='bg-gray-200'>Status</th>
                  <th className='bg-gray-200'></th>
                </tr>
              </thead>
              <tbody>
                {
                  withdraws.data.map(withdraw =>
                    <tr key={withdraw.id}>
                      <td className=''>{ withdraw.no_ref }</td>
                      <td className=''>{ withdraw.user.name.toUpperCase() }</td>
                      <td className=''>{ withdraw.user.email }</td>
                      <td className=''>{ dayjs(withdraw.created_at).format('MMMM YYYY, DD') }</td>
                      <td className=''>
                      { 
                        withdraw.created_at === withdraw.updated_at 
                        ? ''
                        : dayjs(withdraw.updated_at).format('MMMM YYYY, DD')
                      }
                      </td>
                      <td>
                        IDR. { formatNumber(withdraw.value) }
                      </td>
                      <td className=''>
                      {
                        withdraw.status 
                        ? <BadgeSuccess>Telah Dikirim</BadgeSuccess>
                        : <BadgeWarning>Belum Dikirim</BadgeWarning>
                      }
                      </td>
                      <td className=''>
                        <div className="dropdown dropdown-left">
                          <div                             
                            tabIndex={0} 
                            role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                            <IoEllipsisVertical />
                          </div>
                          <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                            <li>
                              <button onClick={() => handleShowConfirmationModal(withdraw)}>
                                <IoCreateOutline /> Konfirmasi  
                              </button> 
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>  
          </ContentDesktop>
        </ContainerDesktop>
      {/* Desktop */}

      {/* Modal */}
        <Modal show={showConfirmationModal} onClose={handleCloseConfirmationModal}>
          <form onSubmit={handleSubmitConfirmation}>
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900">
                  Konfirmasi Pengiriman Saldo Afiliasi
              </h2>
              <div className="mt-6 space-y-3">
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>No Ref</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.no_ref }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>Tanggal Pengajuan</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.date }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>Nama</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.name.toUpperCase() }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>Email</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.email }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>Nilai Pengajuan</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>IDR { formatNumber(data.value) }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>No. Rekening</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.bank_account }</div>
                </div>
                <div className='flex gap-2'>
                    <div className='w-1/4 flex justify-between'>
                        <div>Nama Bank</div>
                        <div>:</div>
                    </div>
                    <div className='w-3/4'>{ data.bank_name }</div>
                </div>
                <div className="mt-6 flex sm:flex-row flex-col-reverse gap-2 sm:gap-0 sm:justify-end">
                  <SecondaryButton 
                    onClick={handleCloseConfirmationModal}
                  >
                    <div className='w-full'>
                        Batal
                    </div>
                  </SecondaryButton>

                  {/* Mobile */}
                  <PrimaryButton className="sm:hidden" 
                    disabled={processing}
                    >
                    <div className='w-full'>
                        Konfirmasi
                    </div>
                  </PrimaryButton>

                  {/* Desktop */}
                  <PrimaryButton className="ms-3 hidden sm:block" 
                    disabled={processing}
                    >
                    Konfirmasi
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </form>
        </Modal>

        <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
          <form onSubmit={handleSubmitFilter}>
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900">
                Filter
              </h2>
              <section className='mt-5 space-y-2'>
                <div className='flex w-full gap-1'>
                    <div className='w-3/12 my-auto'>Affiliatior</div>
                      <div className='w-8/12'>
                        <UserSelectInput
                          resources={affiliators}
                          selected={selectedAffiliator}
                          setSelected={(selected) => handleSelectedAffiliator(selected)}
                          maxHeight='max-h-40'
                          placeholder='Cari Afiliator'
                          isError={false}
                          id='affiliator'
                        />
                      </div>
                    <div className='w-1/12 my-auto'>
                    {
                      selectedAffiliator.id && 
                      <button 
                        type='button' className='text-red-500 text-xl hover:bg-slate-200 rounded-full p-2'
                        onClick={handleDeleteSelectedAffiliator}
                      >
                        <IoTrashOutline />
                      </button>
                    }
                    </div>
                </div>
                <div className='flex w-full gap-1'>
                    <div className='w-3/12 my-auto'>Status</div>
                    <div className='w-8/12'>
                        <select className="w-full rounded-lg border-gray-300" onChange={(e) => setFilterValue({status: e.target.value})} value={filterValue.status}>
                            <option value=''>Semua</option>
                            <option value="false">Belum Dikirim</option>
                            <option value="true">Telah Dikirim</option>
                        </select>
                    </div>
                    <div className='w-1/12 my-auto'>
                      
                    </div>
                </div>
              </section>
              <div className="mt-6 flex justify-end">
                <SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

                <PrimaryButton className="ms-3">
                  Filter
                </PrimaryButton>
              </div>
            </div>
          </form>
        </Modal>
      {/* Modal */}

    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Data Penarikan Saldo Afiliasi</Header>}
    children={page}
    user={page.props.auth.user}
    title="Data Penarikan Saldo Afiliasi"
    backLink={<Link href={route('admin.user-master')}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('admin.user-master')}>Data Master Pengguna</Link></li> 
            <li>Data Penarikan Saldo Afiliasi</li>
        </ul>
    </div>}
/>

export default Index;
