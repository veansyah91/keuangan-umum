import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import StaffMobile from './Components/StaffMobile';
import StaffDesktop from './Components/StaffDesktop';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { NumericFormat } from 'react-number-format';
import dayjs from 'dayjs';
import BadgeSuccess from '@/Components/Badges/BadgeSuccess';
import BadgeDanger from '@/Components/Badges/BadgeDanger';
import SuccessButton from '@/Components/SuccessButton';

const yearList = () => {
    const now = dayjs().year();

    const start = now - 20;

    let arrayYear = [];

    for (let index = start; index < now + 1; index++) {
        arrayYear = [
            ...arrayYear, index
        ];
    }
    return arrayYear;
}	

export default function Index({ role, organization, contacts, category, searchFilter }) {
  // State
	const [showSearch, setShowSearch] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showModalDetail, setShowModalDetail] = useState(false);
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
    phone: '',
    address: '',
    description: '',
    no_ref:'',
    position:'',
    entry_year:yearList()[20],
    category: category.id,
	});

	const prevSearch = usePrevious(search);
	const [debounceValue] = useDebounce(search, 500);

	// useEffect
	useEffect(() => {
		if (prevSearch !== undefined) {
			handleReloadPage();
		}
	}, [debounceValue]);

	//function
	const handleReloadPage = () => {
		router.reload({
		only: ['contacts'],
		data: {
			search,
		},
		});
	};

	const handleDelete = (contact) => {
		setTitleDeleteModal(`Hapus Rincian Biaya Bulanan ${contact.name} ?`);
		setShowDeleteConfirmation(true);
		setData('id', contact.id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		isUpdate
		? patch(route('data-master.staff.update', {organization: organization.id, contact: data.id}), {
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
		: post(route('data-master.staff.store', organization.id), {
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

	const handleSubmitDelete = (e) => {
		e.preventDefault();

		destroy(route('data-master.staff.destroy', { organization: organization.id, contact: data.id }), {
			onSuccess: ({ props }) => {
				const { flash } = props;

        toast.success(flash.success, {
          position: toast.POSITION.TOP_CENTER,
        });
				setShowDeleteConfirmation(false);
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

	const createData = () => {
		reset();
		setIsUpdate(false);
		setModalInputLabel({title: 'Tambah Staf', submit: 'Tambah'});
		setError('name', '');
		setShowModalInput(true);
	};

  const handleShow = (contact) => {
    console.log(contact);

    setShowModalDetail(true);
    setData({
			id : contact.id,
			name : contact.name,
			is_active : contact.is_active > 0 ? true : false,
      phone: contact.phone || '',
      address: contact.address || '',
      description: contact.description || '',
      no_ref:contact.staff.no_ref || '',
      position:contact.staff.position || '',
      entry_year:contact.staff.entry_year || '',
		});
  }

	const handleEdit = (contact) => {
		setIsUpdate(true);
		setError('name', '');
		setShowModalInput(true);
		setModalInputLabel({
			title: 'Ubah Staf',
			submit: 'Ubah'
		});
		setData({
			id : contact.id,
			name : contact.name,
			is_active : contact.is_active > 0 ? true : false,
      phone: contact.phone || '',
      address: contact.address || '',
      description: contact.description || '',
      no_ref:contact.staff.no_ref || '',
      position:contact.staff.position || '',
      entry_year:contact.staff.entry_year || yearList()[20],
		});
	}

	return (
		<>
      {/* Mobile */}
      <Head title='Data Staf' />
      <ToastContainer />

      {role !== 'viewer' && (
        <AddButtonMobile label={'Tambah'} handleShowInputModal={createData} />
      )}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          contacts.links[0].url ? (
            <Link
              href={`/data-master/${organization.id}/staff?page=${contacts.current_page - 1}&search=${search}`}
              preserveState
              only={['contacts']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          contacts.links[contacts.links.length - 1].url ? (
            <Link
              href={`/data-master/${organization.id}/staff?page=${contacts.current_page + 1}&search=${search}`}
              only={['contacts']}
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
            {contacts.current_page}/{contacts.last_page}
          </>
        }
        data={contacts}
      />
      <ContentMobile>
        {contacts.data.map((contact) => (
          <StaffMobile
            contact={contact}
            key={contact.id}
            handleDelete={() => handleDelete(contact)}
            handleEdit={() => handleEdit(contact)}
            handleShow={() => handleShow(contact)}
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
                <Link href={route('data-master.staff.import', organization.id)}>
                  <SuccessButton className='py-3'>Import Data (.csv)</SuccessButton>
                </Link>
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
              placeholder='Cari Staf'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={contacts} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {contacts.links[0].url ? (
                <Link
                  href={`/admin/data-master/${organization.id}/staff?page=${contacts.current_page - 1}&search=${search}`}
                  preserveState
                  only={['contacts']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {contacts.current_page}/{contacts.last_page}
            </div>
            <div className='my-auto'>
              {contacts.links[contacts.links.length - 1].url ? (
                <Link
                  href={`/admin/data-master/${organization.id}/staff?page=${contacts.current_page + 1}&search=${search}`}
                  only={['contacts']}
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
                    <th className='bg-gray-200'>Nama Staf</th>
                    <th className='bg-gray-200'>Posisi</th>
                    <th className='bg-gray-200'>Tahun Masuk</th>
                    <th className='bg-gray-200'>Status</th>
                    <th className='bg-gray-200'></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.data.map((contact, index) => (
                    <StaffDesktop
                      key={index}
                      contact={contact}
                      className={`${index % 2 == 0 && 'bg-gray-100'}`}
                      handleDelete={() => handleDelete(contact)}
                      handleEdit={() => handleEdit(contact)}
                      handleShow={() => handleShow(contact)}
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

          <div className='mt-5 space-y-5 overflow-y-auto h-[400px]' id='body-input'>
            <div className='flex flex-col sm:flex-row w-full gap-1'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel htmlFor='name' value='Nama Staf' className='mx-auto my-auto' />
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
                    placeholder='Nama Staf'
                />
                {errors && errors.name && (
                    <div className='-mb-3'>
                        <div className='text-xs text-red-500'>{errors.name}</div>
                    </div>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'No. Handphone (opsional)'}
                  htmlFor='phone'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='phone'
                  name='phone'
                  className={`w-full ${errors?.phone && 'border-red-500'}`}
                  placeholder='No. Handphone'
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value.toUpperCase())}
                />
                {errors?.phone && <span className='text-red-500 text-xs'>{errors.phone}</span>}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Alamat (opsional)'}
                  htmlFor='address'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='address'
                  name='address'
                  className={`w-full ${errors?.address && 'border-red-500'}`}
                  placeholder='Alamat'
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value.toUpperCase())}
                />
                {errors?.address && <span className='text-red-500 text-xs'>{errors.address}</span>}
              </div>
            </div>

            <div className='text-center font-bold'>Detail Staf</div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Tahun Masuk'}
                  htmlFor='entry_year'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <select className="select select-bordered w-full" defaultValue={data.entry_year} onChange={e => setData('entry_year', parseInt(e.target.value))} id='entry_year'>
                  {
                    yearList().map(year => 
                      <option 
                        key={year} 
                      >{year}</option>
                    )
                  }
                </select>
                {errors?.entry_year && <span className='text-red-500 text-xs'>{errors.entry_year}</span>}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'No Staf (opsional)'}
                  htmlFor='no_ref'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='no_ref'
                  name='no_ref'
                  className={`w-full ${errors?.no_ref && 'border-red-500'}`}
                  placeholder='No Staf'
                  value={data.no_ref}
                  onChange={(e) => setData('no_ref', e.target.value.toUpperCase())}
                />
                {errors?.no_ref && <span className='text-red-500 text-xs'>{errors.no_ref}</span>}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Posisi (opsional)'}
                  htmlFor='position'
                  className=' mx-auto my-auto'
                />
              </div>
              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='position'
                  name='position'
                  className={`w-full ${errors?.position && 'border-red-500'}`}
                  placeholder='Posisi'
                  value={data.position}
                  onChange={(e) => setData('position', e.target.value.toUpperCase())}
                />
                {errors?.position && <span className='text-red-500 text-xs'>{errors.position}</span>}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2'>
              <div className='w-full sm:w-1/3 my-auto'>
                <InputLabel
                  value={'Informasi Tambahan (opsional)'}
                  htmlFor='description'
                  className=' mx-auto my-auto'
                />
              </div>

              <div className='w-full sm:w-2/3'>
                <TextInput
                  id='description'
                  name='description'
                  className={`w-full ${errors?.description && 'border-red-500'}`}
                  placeholder='Informasi Tambahan'
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value.toUpperCase())}
                />
                {errors?.description && (
                  <span className='text-red-500 text-xs'>{errors.description}</span>
                )}
              </div>
            </div>
            {
              isUpdate && <div className='w-1/6 mt-5'>
              <div className='form-control '>
                <label className='label cursor-pointer gap-2' htmlFor={`is_active`}>
                  <input
                    type='checkbox'
                    className='checkbox'
                    id={`is_active`}
                    value={data.is_active}
                    onChange={() => setData('is_active', !data.is_active)}
                    checked={data.is_active}
                  />
                  <span className='label-text font-bold'>Aktif</span>
                </label>
              </div>
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

      <Modal show={showModalDetail} onClose={() => setShowModalDetail(false)}>
        <div className='p-6'>
          <h2 className='text-lg font-medium text-gray-900 border-b-2 py-1'>Detail Staff</h2>

          <div className='mt-5 space-y-5 overflow-y-auto h-[400px]'>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Nama</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.name}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>No Staf</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.no_ref ?? '-'}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Jabatan</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.position}
                </div>
              </div>
            </div> 
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Tahun Masuk</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.entry_year}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>No. Handphone</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.phone}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Alamat</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.address}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Informasi Lain</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {data.description}
                </div>
              </div>
            </div>
            <div className='sm:mx-auto px-3 sm:px-0 space-y-5'>
              <div className='flex flex-col sm:flex-row justify-between gap-1'>
                <div className='sm:w-1/3 font-bold'>Status</div>
                <div className='sm:w-2/3 flex gap-1'>
                  <span className='hidden sm:block'>:</span>
                  {
                    data.is_active 
                    ? <BadgeSuccess>Aktif</BadgeSuccess>
                    : <BadgeDanger>Tidak Aktif</BadgeDanger>
                  }
                </div>
              </div>
            </div>            
          </div>

          <div className='mt-6 flex justify-end'>
            <SecondaryButton onClick={_ => setShowModalDetail(false)}>Batal</SecondaryButton>
          </div>
        </div>
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
		header={<Header>Data Staf</Header>}
		children={page}
		user={page.props.auth.user}
		organization={page.props.organization}
		title='Data Staf'
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
						<li>Data Staf</li>
					</ul>
				</div>
			}
		role={page.props.role}
	/>
);