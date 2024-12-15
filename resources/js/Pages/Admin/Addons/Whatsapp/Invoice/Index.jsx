import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrash } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import PageNumber from '@/Components/PageNumber';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import WhatsappInvoiceDesktop from './Components/WhatsappInvoiceDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import formatNumber from '@/Utils/formatNumber';
import SecondaryButton from '@/Components/SecondaryButton';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import GeneralSelectInput from '@/Components/SelectInput/GeneralSelectInput';
import Datepicker from 'react-tailwindcss-datepicker';


export default function Index({
    organizations,
    invoices, 
    searchFilter, 
    searchOrganization,
    productFilter,
    statusFilter,
}) {  
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [search, setSearch] = useState(searchFilter || '');

  const [showModalUpdateStatus, setShowModalUpdateStatus] = useState(false);

  const { data, setData, processing, patch, errors } = useForm({
    'id': null,
    'no_ref' : '',
    'organization_name' : '',
    'product': '',
    'price': 0    
  });

  const [dataFilter, setDataFilter] = useState({
    status: statusFilter || '',
    product: productFilter || '',
  });

  const [dateValue, setDateValue] = useState({
    startDate: '',
    endDate: '',
  });

  const [debounceValue] = useDebounce(search, 500);
  const [debounceDateValue] = useDebounce(dateValue, 500);
  const prevSearch = usePrevious(search);

  // Organization Select
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [queryOrganization, setQueryOrganization] = useState(searchOrganization || '');

  // useEffect
  useEffect(() => {
    if (prevSearch !== undefined) {
      handleReloadPage();
    }
  }, [debounceValue, debounceDateValue]);

  // function
  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
  };

  const handleReloadPage = () => {
    router.reload({
      only: ['invoices'],
      data: {
        search,
        start_date: dateValue.startDate,
        end_date: dateValue.endDate,
        status: dataFilter.status,
        product: dataFilter.product,
        organization_id: selectedOrganization.id,
      },
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setShowModalFilter(false);
    handleReloadPage();
  };

  const handleDeleteOrganizationFilter = () => {
    setSelectedOrganization('');
    setQueryOrganization('');
  };

  const handleEdit = (invoice) => {    
    setShowModalUpdateStatus(true);
    setData({
    'id': invoice.id,
    'no_ref' : invoice.no_ref,
    'organization' : invoice.organization.name,
    'product': invoice.product,
    'price': invoice.price
    });
  }

  const updateOrganizationInvoiceStatus = (e) =>
  {
    e.preventDefault();

    patch(route('admin.add-ons.whatsapp.invoice.confirmation', {invoice: data.id}), {
      onSuccess: ({ props }) => {
        console.log(props);
      }
    })
  }

  

  return (
    <>
      <Head title='Invoice Whatsapp Plugins' />
      <ToastContainer />

      {/* Mobile */}
      <TitleMobile
        data={invoices}
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          invoices.links[0].url ? (
            <Link
              href={route('admin.add-ons.whatsapp.invoice', {
                page: invoices.current_page - 1,
                search: search,
              })}
              preserveState
              only={['invoices']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          invoices.links[invoices.links.length - 1].url ? (
            <Link
              href={route('admin.add-ons.whatsapp.invoice', {
                page: invoices.current_page + 1,
                search: search,
              })} 
              only={['invoices']}
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
            {invoices.current_page}/{invoices.last_page}
          </>
        }
        invoice={invoices}
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
            <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}>
              <IoFilter />
            </button>
            <Datepicker
                value={dateValue}
                onChange={handleDateValueChange}
                showShortcuts={true}
                configs={{
                    shortcuts: {
                        today: 'Hari Ini',
                        yesterday: 'Kemarin',
                        past: (period) => `${period} Hari Terakhir`,
                        currentMonth: 'Bulan Ini',
                        pastMonth: 'Bulan Lalu',
                        currentYear: 'Tahun Ini',
                    },
                }}
                separator={'s.d'}
            />
          </div>
          <div className='w-3/12 border flex rounded-lg'>
            <label htmlFor='search-input' className='my-auto ml-2'>
              <IoSearchSharp />
            </label>
            <input
              id='search-input'
              name='search-input'
              type='search'
              placeholder='Cari Invoice'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={invoices} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {invoices.links[0].url ? (
                <Link
                  href={route('admin.add-ons.whatsapp.invoice', {
                    page: invoices.current_page - 1,
                    search: search,
                  })} 
                  preserveState
                  only={['invoices']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {invoices.current_page}/{invoices.last_page}
            </div>
            <div className='my-auto'>
              {invoices.links[invoices.links.length - 1].url ? (
                <Link
                  href={route('admin.add-ons.whatsapp.invoice', {
                    page: invoices.current_page + 1,
                    search: search,
                  })} 
                  only={['invoices']}
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
                    <th className='bg-gray-200'>Tanggal Pembuatan</th>
                    <th className='bg-gray-200'>No. Ref</th>
                    <th className='bg-gray-200'>Produk</th>
                    <th className='bg-gray-200 text-end'>Harga</th>
                    <th className='bg-gray-200 text-center'>Status</th>
                    <th className='bg-gray-200 text-end'></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    invoices.data.map((invoice, index) =>
                      <WhatsappInvoiceDesktop
                        key={index}
                        invoice={invoice}
                        className={`${index % 2 !== 0 && 'bg-gray-100'}`}
                        handleEdit={() => handleEdit(invoice)}
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
      <Modal show={showModalUpdateStatus} onClose={() => setShowModalUpdateStatus(false)}>
        <form onSubmit={updateOrganizationInvoiceStatus} className='p-6'>
          <h2 className='text-lg font-medium text-gray-900'>Konfirmasi Pembayaran Invoice Whatsapp Broadcasting</h2>

          <div className='mt-6 '>
            <div className='flex gap-2'>
              <div className='w-1/4 flex justify-between'>
                <div>No Ref</div>
                <div>:</div>
              </div>
              <div className='w-3/4'>{data.no_ref}</div>
            </div>
            <div className='flex gap-2'>
              <div className='w-1/4 flex justify-between'>
                <div>Organisasi</div>
                <div>:</div>
              </div>
              <div className='w-3/4'>{data.organization}</div>
            </div>
            <div className='flex gap-2'>
              <div className='w-1/4 flex justify-between'>
                <div>Produk</div>
                <div>:</div>
              </div>
              <div className='w-3/4'>{data.product}</div>
            </div>
            <div className='flex gap-2'>
              <div className='w-1/4 flex justify-between'>
                <div>Harga</div>
                <div>:</div>
              </div>
              <div className='w-3/4'>IDR. {formatNumber(data.price)}</div>
            </div>
          </div>

          <div className='mt-6 flex sm:flex-row flex-col-reverse gap-2 sm:gap-0 sm:justify-end'>
            <SecondaryButton onClick={() => setShowModalUpdateStatus(false)}>
              <div className='w-full'>Batal</div>
            </SecondaryButton>

            {/* Mobile */}
            <PrimaryButton className='sm:hidden' disabled={processing}>
              <div className='w-full'>Konfirmasi Pembayaran</div>
            </PrimaryButton>

            {/* Desktop */}
            <PrimaryButton className='ms-3 hidden sm:block' disabled={processing}>
              Konfirmasi Pembayaran
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
                  <option value='pending'>Menunggu</option>
                  <option value='paid'>Lunas</option>
                  <option value='canceled'>Batal</option>
                </select>
              </div>
              <div className='w-1/12 my-auto'></div>
            </div>
            <div className='flex w-full gap-1'>
              <div className='w-3/12 my-auto'>Produk</div>
              <div className='w-8/12'>
                <select
                  className='w-full rounded-lg border-gray-300'
                  onChange={(e) => setDataFilter({ product: e.target.value })}
                  value={dataFilter.product}>
                  <option value=''>Semua</option>
                  <option value='Bulanan'>Bulanan</option>
                  <option value='Tahunan'>Tahunan</option>
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
    header={<Header>Invoice</Header>}
    breadcrumbs={
      <div className='text-sm breadcrumbs'>
        <ul>
          <li className='font-bold'>
            <Link href={route('admin.add-ons')}>Addons</Link>
          </li>
          <li className='font-bold'>
            <Link href={route('admin.add-ons.whatsapp')}>Whatsapp Broadcasting Addons</Link>
          </li>
          <li>Invoice</li>
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
    title='Invoice'
  />
);
