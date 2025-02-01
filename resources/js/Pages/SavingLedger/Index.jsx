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
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import SavingLedgerMobile from './Components/SavingLedgerMobile';
import SavingLedgerDesktop from './Components/SavingLedgerDesktop';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import DangerButton from '@/Components/DangerButton';
import ContactSelectInput from '@/Components/SelectInput/ContactSelectInput';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import SavingAccountSelectInput from '@/Components/SelectInput/SavingAccountSelectInput';
import { NumericFormat } from 'react-number-format';
import Datepicker from 'react-tailwindcss-datepicker';
import dayjs from 'dayjs';
import formatNumber from '@/Utils/formatNumber';

export default function Index({ ledgers, organization, role, newRefCredit, newRefDebit, querySearch, balances, date, cashAccounts }) {  
  // state
  const { data, setData, post, patch, errors, setError, processing, reset, delete:destroy } = useForm({
    'id': null,
    'value': '',
    'balance_id': null,
    'balance_value': 0,
    'value': 0,
    'type' : '',
    'date': date,
    'description' : '',
    'no_ref': '',
    'cash_account_id' : null
  });
  const [dateValue, setDateValue] = useState({
    startDate: date,
    endDate: date,
  });
  const [selectedContact, setSelectedContact] = useState({ id: null, name: '', no_ref: '', balance_value: 0 });
  const [selectedCashAccount, setSelectedCashAccount] = useState({ id: null, name: '', code: '', is_cash: true });
  
  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Data Simpanan',
    submit: 'Tambah'
  });
  const [showModalInput, setShowModalInput] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [search, setSearch] = useState(querySearch || "");
  

  // function
  const setDefault = () => {

  }

  const handleEdit = (ledger) => {
    console.log(ledger);
    
  }

  const handleDelete = (legder) => {

  }

  const handleDateValueChange = (newValue) => {
      setDateValue(newValue);
      setData('date', dayjs(newValue.startDate).format('YYYY-MM-DD'));
  };

  const handleChangeValue = (value) => {
    const { floatValue } = value;

    setData('value', floatValue);    
  }

  const handleSelectedContact = (selected) => {    
    if (selected) {
      setSelectedContact({ id: selected.id, name: selected.contact.name, no_ref: selected.no_ref, balance_value: selected.value });
      let tempData = {...data};
      tempData = {
        ...tempData,
        balance_id: selected.id,
        balance_value: selected.value,
        description: `${selected.contact.name} ${tempData.type == 'credit' ? 'menambah' : 'menarik'} tabungan`
      }
      setData(tempData);
    }    
  }  

  const createCreditData = () => {    
    setError({
      'id': '',
      'value': '',
      'balance_id': '',
      'balance_value': '',
      'value': '',
      'type' : '',
      'date': '',
      'description' : '',
      'no_ref': '',
      'cash_account_id' : ''
    });
    // setSelectedContact({ id: null, name: '', no_ref: '', balance_value: 0 });
    // setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
    setShowModalInput(true);
    setIsUpdate(false);
    setDefault();
    setModalInputLabel({
      title: 'Tambah Simpanan',
      submit: 'Tambah'
    });
    setData({
      'id': null,
      'no_ref': newRefCredit,
      'balance_value': 0,
      'balance_id': null,
      'value': 0,
      'type' : 'credit',
      'date': date,
      'description' : '',
      'cash_account_id' : null
    });
  }

  const createDebitData = () => {    
    setError({
      'id': '',
      'value': '',
      'balance_id': '',
      'balance_value': '',
      'value': '',
      'type' : '',
      'date': '',
      'description' : '',
      'no_ref': '',
      'cash_account_id' : ''

    });
    // setSelectedContact({ id: null, name: '', no_ref: '', balance_value: 0 });
    // setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
    setShowModalInput(true);
    setIsUpdate(false);
    setDefault();
    setModalInputLabel({
      title: 'Tarik Simpanan',
      submit: 'Tarik'
    });
    setData({
      'id': null,
      'no_ref': newRefDebit,
      'balance_value': 0,
      'balance_id': null,
      'value': 0,
      'date': date,
      'type' : 'debit',
      'description' : '',
      'cash_account_id' : null

    });
  }

  const handleSelectedCashAccount = (selected) => {
    if (selected) {
      setSelectedCashAccount({ id: selected.id, name: selected.name, code: selected.code, is_cash: true });
      setData('cash_account_id', selected.id);
      setError('cash_account_id','');
    }    
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('cashflow.saving.ledger.store', { organization: organization.id }), {
      onSuccess: ({ props }) => {
        const { flash } = props;
        router.replace(window.location.pathname);

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });

        setSelectedContact({ id: null, name: '', no_ref: '', balance_value: 0 });
        setSelectedCashAccount({ id: null, name: '', code: '', is_cash: true });
        setShowModalInput(false);
        setIsUpdate(false);  
      },
      onError: errors => {
        console.log(errors);
        
      }
    })
  }
  
  return (
    <>
      <Head title='Tambah/Tarik Simpanan' />
      <ToastContainer />
      {
        role !== 'viewer' && (
          <div className='md:hidden fixed bottom-2 w-full z-40 flex'>
            <div className='px-2'>
              <button type='button' className={'btn bg-green-800 text-white w-full'} onClick={createCreditData}>
                <div className='text-xl font-bold rotate-90'>
                  <FiLogIn />
                </div>
              </button>
            </div>
            <div className='px-2'>
              <button type='button' className={'btn bg-orange-800 text-white w-full'} onClick={createDebitData}>
                <div className='text-xl font-bold -rotate-90'>
                  <FiLogOut />
                </div>
              </button>
            </div>
          </div>
        )
      }
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          ledgers.links[0].url ? (
            <Link
              href={route('cashflow.saving.ledger', {
                organization: organization.id,
                page: ledgers.current_page - 1,
                search: search,
              })}
              preserveState
              only={['ledgers']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          ledgers.links[ledgers.links.length - 1].url ? (
            <Link
              href={route('cashflow.saving.ledger', {
                organization: organization.id,
                page: ledgers.current_page + 1,
                search: search,
              })}
              only={['ledgers']}
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
            {ledgers.current_page}/{ledgers.last_page}
          </>
        }
        data={ledgers}
      />
      <ContentMobile>
        {ledgers.data.map((ledger) => (
          <SavingLedgerMobile
            ledger={ledger}
            key={ledger.id}
            handleDelete={() => handleDelete(ledger)}
            handleEdit={() => handleEdit(ledger)}
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
                <button onClick={createCreditData} className='bg-green-800 px-4 py-2 text-white border border-transparent rounded-md font-semibold'>
                  <div className='text-xl font-bold rotate-90'>
                    <FiLogIn />
                  </div>
                </button>
                <button onClick={createDebitData} className='bg-orange-800 px-4 py-2 text-white border border-transparent rounded-md font-semibold'>
                  <div className='text-xl font-bold -rotate-90'>
                    <FiLogOut />
                  </div>
                </button>
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
              placeholder='Cari'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={ledgers} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {ledgers.links[0].url ? (
                <Link
                  href={route('cashflow.saving.ledger', {
                    organization: organization.id,
                    page: ledgers.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['ledgers']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {ledgers.current_page}/{ledgers.last_page}
            </div>
            <div className='my-auto'>
              {ledgers.links[ledgers.links.length - 1].url ? (
                <Link
                  href={route('cashflow.saving.ledger', {
                    organization: organization.id,
                    page: ledgers.current_page + 1,
                    search: search,
                  })}
                  only={['ledgers']}
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
                  <th className='bg-gray-200'>Tanggal</th>
                  <th className='bg-gray-200'>No. Ref</th>
                  <th className='bg-gray-200'>Rekening</th>
                  <th className='bg-gray-200 text-end'>Jumlah</th>
                  <th className='bg-gray-200'></th>
                </tr>
              </thead>
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
                <InputLabel htmlFor='date' value='Tanggal' className='mx-auto my-auto' />
              </div>
              <div className='sm:w-2/3 w-full'>
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
                {errors && errors.date && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.date}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='no_ref' value='No. Ref' className='mx-auto my-auto' />
              </div>
              <div className='sm:w-2/3 w-full'>
                <TextInput
                  id='no_ref'
                  type='text'
                  name='no_ref'
                  value={data.no_ref}
                  className={`mt-1 w-full ${errors && errors.no_ref && 'border-red-500'}`}
                  isFocused={true}
                  onChange={(e) => setData('no_ref', e.target.value.toUpperCase())}
                  placeholder='No. Ref'
                />
                {errors && errors.no_ref && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.no_ref}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='balance_id' value='Kontak' className='mx-auto my-auto' />
              </div>
              <div className='sm:w-2/3 w-full'>
                <SavingAccountSelectInput
                  resources={balances}
                  selected={selectedContact}
                  setSelected={(selected) => handleSelectedContact(selected)}
                  maxHeight='max-h-40'
                  placeholder='Cari Kontak'
                  isError={errors.contact_id ? true : false}
                  id='contact'
                  notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-master.contact.create', {organization:organization.id})}>Buat Baru ?</Link></span>}
                />
                {
                  selectedContact.id && <div className='flex justify-between text-xs'>
                    <div>Nama: <span className='font-bold'>{ selectedContact.name }</span></div>
                    <div>Sisa Saldo: <span className='text-green-700 font-bold'>IDR. { formatNumber(selectedContact.balance_value) }</span></div>
                  </div>
                }
                {errors && errors.balance_id && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>Silakan isi kontak</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='value' value='Jumlah' className='mx-auto my-auto' />
              </div>
              <div className='sm:w-2/3 w-full'>
                <NumericFormat
                  value={data.value}
                  customInput={TextInput}
                  onValueChange={(values) => handleChangeValue(values)}
                  thousandSeparator={true}
                  className={`text-end w-full border ${errors.value ? 'border-red-500' : ''}`}
                  prefix={'IDR '}
                  id={`value`}
                />
                {errors && errors.value && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.value}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='value' value='Akun Kas' className='mx-auto my-auto' />
              </div>
              <div className='sm:w-2/3 w-full'>
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
                {errors && errors.cash_account_id && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.cash_account_id}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='mt-6 flex justify-end'>
              <SecondaryButton onClick={e => setShowModalInput(false)}>Batal</SecondaryButton>  
              {
                data.balance_id && data.no_ref && data.date && (data.value > 0) &&
                <PrimaryButton className='ms-3' disabled={processing}>
                  {modalInputLabel.submit}
                </PrimaryButton>
              }
            </div>
          </div>        
        </form>
      </Modal>
    </>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header>Data Simpanan</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title='Data Simpanan'
    backLink={
      <Link href={route('cashflow.saving', page.props.organization.id)}>
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
            <Link href={route('cashflow.saving', page.props.organization.id)}>Simpanan</Link>
          </li>
          <li>Tambah/Tarik Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);