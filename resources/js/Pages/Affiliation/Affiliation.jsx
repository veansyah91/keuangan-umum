import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { IoAddCircleOutline, IoArrowBackOutline, IoEllipsisVertical, IoSearchOutline } from 'react-icons/io5';
import TextInput from '@/Components/TextInput';
import rupiah from '@/Utils/rupiah';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import { GiTakeMyMoney } from "react-icons/gi";
import formatNumber from '@/Utils/formatNumber';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import SuccessButton from '@/Components/SuccessButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { NumericFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import AffiliationWithdrawMobile from './Components/AffiliationWithdrawMobile';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeWarning from '@/Components/Badges/BadgeWarning';


export default function Affiliation({ auth, affiliation, affiliationWithdraws }) {
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  

  const { data, setData, patch, errors, setError, processing } = useForm({
    value: affiliation.balance || 0,
    bank_account : affiliation.bank_account || '',
    bank_name : affiliation.bank_name || ''
  })

  useLayoutEffect(() => {
    const screenHeight = window.screen.height;
    document.getElementById("content-desktop").style.height = `${screenHeight-374}px`;
    document.getElementById("content-mobile").style.height = `${screenHeight-374}px`;
  }, []);

  const handleSearch = _ => {
    router.reload({ 
        only: ['organizationInvoices'],
        data: {
            
        }
      });
  }

  const handleSetShowWithdrawModal = () =>
  {
    setShowWithdrawModal(true);
    setError({
      value: '',
      bank_account : '',
      bank_name : ''
    });

    setData({
      value: affiliation.balance || 0,
      bank_account : affiliation.bank_account || '',
      bank_name : affiliation.bank_name || ''
    })
  }

  const handleChangeValue = (values) => {
    const { value } = values;

    setData('value', value);
    
    if (value > affiliation.balance) {
      setError('value', 'Saldo Tidak Cukup');
      return;
    }
    setError('value', '');
  }

  const handleSubmitWithdraw = (e) => {
    e.preventDefault();

    patch(route('affiliation.patch', affiliation.id), {
      onSuccess: page => {
        const { flash } = page.props;
        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER
        });
      },
      onError: errors => {
        const { status } = errors;

        status &&
        toast.error(status, {
          position: toast.POSITION.TOP_CENTER
        });
      },
      onFinish: () => {
        setShowWithdrawModal(false);

      }
    })
  }

  return (
    <>
      <Head title='Afiliasi' />
      <ToastContainer  />

      <div className='bg-gray-100 min-h-screen'>
        <div className='bg-white mx-auto sm:px-6 lg:px-8 max-w-4xl'>
          {/* Breadcrumbs */}
          <div className="text-sm breadcrumbs px-4 py-4">
            <ul>
              <li className='font-bold'><Link href={route('organization')}>Daftar Organisasi</Link></li> 
              <li>Afiliasi</li>
            </ul>
          </div>

          {/* Title */}
          <Header>
            <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
                <div className='sm:p-6 px-6 py-3 text-gray-800 flex-none sm:flex'>
                    <div className='sm:hidden text-gray-800 flex flex-col-reverse gap-5'>
                        <div className="my-auto">
                            Afiliasi
                        </div>
                        <div className="flex flex-row-reverse text-end">
                            <div>
                                <div className='text-gray-400 text-sm'>
                                    {auth.user.name}
                                </div>                                    
                                <div className=' text-xs text-green-400'>
                                    {auth.user.email}
                                </div>
                            </div>
                        </div>                                    
                    </div>
                    <div className='sm:flex-1 my-auto sm:block hidden'>
                        Afiliasi
                    </div>
                    <div className='sm:flex-1 sm:block hidden text-end text-gray-800'>
                        <div className="flex flex-row-reverse">
                            <div>
                                <div className='text-gray-400'>
                                    {auth.user.name}
                                </div>
                                
                                <div className=' text-sm text-green-400'>
                                    {auth.user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </Header>

          <div className='py-3 px-6 text-gray-900 flex-none sm:flex sm:flex-row-reserve sm:gap-2 sm:justify-between space-y-5 sm:space-y-0'>
            <div className='flex gap-2'>
              <div className='my-auto'><GiTakeMyMoney /> </div>
              <div className='my-auto'>Saldo Anda: <span className='font-bold text-lg text-green-500'>Rp. { formatNumber(affiliation.balance) }</span></div>
            </div>
            {
              affiliation.balance > 0 && 
                <div className='flex gap-2'>
                  <PrimaryButton className='w-full' onClick={() => handleSetShowWithdrawModal()}>
                    <div className='w-full'>Ajukan Penarikan</div>                  
                  </PrimaryButton>
                </div>
            }
          </div>
            

          {/* Sub Header */}
          <div className='mt-5 px-4 font-bold'>
            <h4>Riwayat Penarikan Saldo</h4>              
          </div>

          {/* Content Penarikan */}
          
          {/* Mobile */}
          <div className='sm:hidden overflow-auto' id='content-mobile'>
            {
              affiliationWithdraws.map(affiliationWithdraw => 
                <AffiliationWithdrawMobile 
                  affiliationWithdraw = {affiliationWithdraw}
                  key={affiliationWithdraw.id}
                />
              )
            }
          </div>

          {/* Desktop */}
          <div className='hidden sm:block mt-5' id='content-desktop'>
            <div className='flex gap-5 font-bold border-b-2 pb-2 border-gray-500'>
                <div className='w-3/12 text-start'>Tanggal</div>
                <div className='w-2/12 text-start'>No Ref</div>
                <div className='w-3/12 text-end'>Nilai Pengajuan</div>
                <div className='w-2/12 text-start'>Status</div>
                <div className='w-2/12 text-end'></div>
            </div>
            <div className='z-20'>
              {
                affiliationWithdraws.map((affiliationWithdraw) => 
                <div className='flex gap-5 my-3' key={affiliationWithdraw.id}>
                  <div className='w-3/12'>{ dayjs(affiliationWithdraw.created_at).format('MMM DD, YYYY') }</div>
                  <div className='w-2/12'>{ affiliationWithdraw.no_ref }</div>
                  <div className='w-3/12 text-end'>IDR. { formatNumber(affiliationWithdraw.value) }</div>
                  <div className='w-2/12'>
                  { affiliationWithdraw > 0 
                    ? <BadgeSuccess>Sukses</BadgeSuccess>
                    : <BadgeWarning>Mengunggu</BadgeWarning>
                  }
                  </div>
                  <div className='w-2/12'>
                    <div className="dropdown dropdown-left my-auto">
                      <div                             
                        tabIndex={0} 
                        role="button" className={`bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'`}>
                        <IoEllipsisVertical />
                      </div>
                        <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56">
                            
                            <li>           
                              <Link href={route('affiliationWithdraw.detail', affiliationWithdraw.id)}>
                                <IoSearchOutline /> Detail / Tanda Terima
                              </Link>
                            </li>
                        </ul>
                    </div>
                  </div>
                </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <form onSubmit={handleSubmitWithdraw}>
          <div className="p-5">
            <h2 className='font-bold text-xl'>Ajukan Penarikan Saldo</h2>
          </div>
          {/* Body */}
          <div className='p-5 space-y-5'>
            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                    <InputLabel value={'Jumlah Penarikan'} htmlFor='value' className=' mx-auto my-auto'/>
                </div>
                
                <div className='w-full sm:w-2/3'>
                  <NumericFormat 
                    value={data.value} 
                    customInput={TextInput} 
                    onValueChange={(values) => handleChangeValue(values)}
                    thousandSeparator={true}
                    className={`text-end w-full border ${errors?.value && 'border-red-500'}`}
                    prefix={'IDR '}
                  />
                  {
                    errors?.value && <span className='text-red-500 text-xs'>{errors.value}</span>
                  }
                </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                    <InputLabel value={'No Rekening'} htmlFor='bank_account' className=' mx-auto my-auto'/>
                </div>
                
                <div className='w-full sm:w-2/3'>
                    <TextInput 
                      id="bank_account"
                      name='bank_account'
                      className={`w-full ${errors?.bank_account && 'border-red-500'}`}
                      placeholder='No Rekening'
                      value={data.bank_account}
                      onChange={(e) => setData('bank_account', e.target.value)}
                    />
                    {
                      errors?.bank_account && <span className='text-red-500 text-xs'>{errors.bank_account}</span>
                    }
                </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='w-full sm:w-1/3 my-auto'>
                    <InputLabel value={'Nama Bank'} htmlFor='bank_name' className=' mx-auto my-auto'/>
                </div>
                
                <div className='w-full sm:w-2/3'>
                    <TextInput 
                      id="bank_name"
                      name='bank_name'
                      className={`w-full ${errors?.bank_name && 'border-red-500'}`}
                      placeholder='Nama Bank'
                      value={data.bank_name}
                      onChange={(e) => setData('bank_name', e.target.value.toUpperCase())}
                    />
                    {
                      errors?.bank_name && <span className='text-red-500 text-xs'>{errors.bank_name}</span>
                    }
                </div>
            </div>
            <div className='text-end space-x-2'>
              <SecondaryButton type='button' onClick={ () => setShowWithdrawModal(false) }>Batal</SecondaryButton>
              <SuccessButton
                disabled={processing}
              >
                Ajukan
              </SuccessButton>
            </div>
          </div>
        </form>
      </Modal>

    </>
  )
}
