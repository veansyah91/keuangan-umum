import React, { useState } from 'react';
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
import SavingBalanceMobile from './Components/SavingBalanceMobile';
import SavingBalanceDesktop from './Components/SavingBalanceDesktop';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import DangerButton from '@/Components/DangerButton';
import ContactSelectInput from '@/Components/SelectInput/ContactSelectInput';

export default function Index({ organization, role, members, querySearch, newRef, contacts, categories }) { 
  // state
  const { data, setData, post, patch, errors, processing, reset, delete:destroy } = useForm({
    id: null,
    'no_ref': newRef || '',
    'contact_id': null,
    'saving_category_id': null
  });

  const [selectedContact, setSelectedContact] = useState({ id: null, name: '', phone: '' });
  const [selectedCategory, setSelectedCategory] = useState({ id: null, name: '' });
  
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalInput, setShowModalInput] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  
  const [modalInputLabel, setModalInputLabel] = useState({
    title: 'Tambah Data Simpanan',
    submit: 'Tambah'
  });

  const [search, setSearch] = useState(querySearch || "");

  // function
  const setDefault = () => {
    setData({
      id: null,
      'no_ref': newRef || '',
      'contact_id': null,
      'saving_category_id': null
    });
    setSelectedContact({ id: null, name: '', phone: '' });
    setSelectedCategory({ id: null, name: '' });
  }

  const handleSelectedContact = (selected) => {
    if (selected) {
      setSelectedContact({ id: selected?.id, name: selected?.name, phone: selected?.phone });
      setData('contact_id', selected?.id);
    }    
  };

  const handleSelectedCategory = (selected) => {
    if (selected) {
      setData('saving_category_id', selected?.id);
      setSelectedCategory({
        id: selected?.id, name: selected?.name
      });
    }
  }

  const createData = () => {    
    setShowModalInput(true);
    setIsUpdate(false);
    setDefault();
    setModalInputLabel({
      title: 'Tambah Data Simpanan',
      submit: 'Tambah'
    });
  }

  const handleDelete = (member) => {
    setShowModalDelete(true);

    setData({
      'id': member.id,
      'no_ref': member.no_ref,
      'contact_id': member.contact_id,
      'saving_category_id': member.saving_category_id,
    });
  }

  const handleEdit = (member) => {
    setModalInputLabel({
      title: 'Ubah Kategori',
      submit: 'Ubah'
    });
    setShowModalInput(true);
    setData({
      'id': member.id,
      'no_ref': member.no_ref,
      'contact_id': member.contact_id,
      'saving_category_id': member.saving_category_id,
    });
    setSelectedContact({ id: member.contact.id, name: member.contact.name, phone: member.contact.phone });
    setSelectedCategory({ id: member.saving_category.id, name: member.saving_category.name });
    setIsUpdate(true);
  }

  const handleSubmitDelete = (e) => {
    e.preventDefault();

    destroy(route('cashflow.saving.balance.delete', {organization: organization.id, balance:data.id}), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        router.replace(window.location.pathname);
        setShowModalDelete(false); 
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();  
    
    isUpdate 
    ?patch(route('cashflow.saving.balance.update', {organization: organization.id, balance: data.id}), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        router.replace(window.location.pathname);
        setShowModalInput(false);
        setIsUpdate(false);  
      }
    })
    :post(route('cashflow.saving.balance.store', { organization: organization }), {
      onSuccess: ({ props }) => {
        const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
        router.replace(window.location.pathname);
        setShowModalInput(false);
        setIsUpdate(false);  
      },
      onError: errors => {
        toast.error(errors.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      },
    })
  }

  return (
    <>
      {/* Mobile */}
      <Head title='Data Simpanan' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          members.links[0].url ? (
            <Link
              href={route('cashflow.saving.balance', {
                organization: organization.id,
                page: members.current_page - 1,
                search: search,
              })}
              preserveState
              only={['members']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          members.links[members.links.length - 1].url ? (
            <Link
              href={route('cashflow.saving.balance', {
                organization: organization.id,
                page: members.current_page + 1,
                search: search,
              })}
              only={['members']}
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
            {members.current_page}/{members.last_page}
          </>
        }
        data={members}
      />
      <ContentMobile>
        {members.data.map((member) => (
          <SavingBalanceMobile
            member={member}
            key={member.id}
            handleDelete={() => handleDelete(member)}
            handleEdit={() => handleEdit(member)}
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
              placeholder='Cari Data Tabungan'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={members} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {members.links[0].url ? (
                <Link
                  href={route('cashflow.saving.balance', {
                    organization: organization.id,
                    page: members.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['members']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {members.current_page}/{members.last_page}
            </div>
            <div className='my-auto'>
              {members.links[members.links.length - 1].url ? (
                <Link
                  href={route('cashflow.saving.balance', {
                    organization: organization.id,
                    page: members.current_page + 1,
                    search: search,
                  })}
                  only={['members']}
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
                    <th className='bg-gray-200'>No. Ref</th>
                    <th className='bg-gray-200'>Nama Kontak</th>
                    <th className='bg-gray-200'>Kategori Simpanan</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
                <tbody>
                  {members.data.map((member, index) => (
                    <SavingBalanceDesktop
                      key={index}
                      member={member}
                      className={`${index % 2 == 0 && 'bg-gray-100'}`}
                      handleDelete={() => handleDelete(member)}
                      handleEdit={() => handleEdit(member)}
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
                <InputLabel htmlFor='contact_id' value='Kontak' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                 <ContactSelectInput
                  resources={contacts}
                  selected={selectedContact}
                  setSelected={(selected) => handleSelectedContact(selected)}
                  maxHeight='max-h-40'
                  placeholder='Cari Kontak'
                  isError={errors.contact_id ? true : false}
                  id='contact'
                  notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-master.contact.create', {organization:organization.id})}>Buat Baru ?</Link></span>}
                />
                {errors && errors.contact_id && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.contact_id}</div>
                  </div>
                )}
              </div>
            </div> 
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='category' value='Kategori Tabungan' className='mx-auto my-auto' />
              </div>

              <div className='sm:w-2/3 w-full'>
                 <ClientSelectInput
                  resources={categories}
                  selected={selectedCategory}
                  setSelected={(selected) => handleSelectedCategory(selected)}
                  maxHeight='max-h-40'
                  placeholder='Cari Kategori'
                  isError={errors.saving_category_id ? true : false}
                  notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-ledger.account', {organization:organization.id})}>Buat Baru ?</Link></span>}
                />
                {errors && errors.category && (
                  <div className='-mb-3'>
                    <div className='text-xs text-red-500'>{errors.category}</div>
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
      <Modal show={showModalDelete} onClose={() => setShowModalDelete(false)}>
        <form onSubmit={handleSubmitDelete} className='p-6' id='delete-confirmation' name='delete-confirmation'>
          <h2 className='text-lg font-medium text-gray-900 text-center'>
              <div>Hapus Data Simpanan { data?.no_ref }?
              </div>              
          </h2>

            <div className='mt-6 flex justify-end'>
                <SecondaryButton onClick={() => setShowModalDelete(false)}>Batal</SecondaryButton>

                <DangerButton className='ms-3' disabled={processing}>
                    Hapus
                </DangerButton>
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
          <li>Data Simpanan</li>
        </ul>
      </div>
    }
    role={page.props.role}
  />
);
