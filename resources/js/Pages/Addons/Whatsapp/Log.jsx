import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
import {
    IoArrowBackOutline,
    IoFilter,
    IoPlayBack,
    IoPlayForward,
    IoSearchSharp,
} from 'react-icons/io5';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import WhatsappLogComponentMobile from './Components/WhatsappLogComponentMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import WhatsappLogComponentDesktop from './Components/WhatsappLogComponentDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';

export default function Log({
  logs, startDate, endDate, searchFilter, statusFilter, organization
}) {
  const [search, setSearch] = useState(searchFilter || '');
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [dateValue, setDateValue] = useState({
    startDate: startDate || '',
    endDate: endDate || '',
  });

  const [dataFilter, setDataFilter] = useState({
    status: statusFilter || 'all',
  });

  const [debounceValue] = useDebounce(search, 500);
  const [debounceDateValue] = useDebounce(dateValue, 500);
  const prevSearch = usePrevious(search);

  // useEffect
  useEffect(() => {
    if (prevSearch !== undefined) {
      handleReloadPage();
    }
  }, [debounceValue, debounceDateValue]);

  // function
  const handleFilter = (e) => {
    e.preventDefault();
    handleReloadPage();
    setShowModalFilter(false);
  };

  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
  };

  const handleReloadPage = () => {
    router.reload({
        only: ['logs'],
        data: {
            search,
            start_date: dateValue.startDate,
            end_date: dateValue.endDate,
            status: dataFilter.status
        },
        preserveState: true,
    });
  };
  
  return (
    <>
      <Head title='Log Aktifitas' />

      {/* Mobile */}
      <TitleMobile
        zIndex={'z-50'}
        search={search}
        setSearch={(e) => setSearch(e.target.value)}
        pageBefore={
          logs.links[0].url ? (
            <Link
              href={route('add-ons.whatsapp-log', {
                organization: organization.id,
                page: logs.current_page - 1,
                search: search,
              })}
              preserveState
              only={['logs']}>
              <IoPlayBack />
            </Link>
          ) : (
            <div className='text-gray-300'>
              <IoPlayBack />
            </div>
          )
        }
        pageAfter={
          logs.links[logs.links.length - 1].url ? (
            <Link
              href={route('add-ons.whatsapp-log', {
                organization: organization.id,
                page: logs.current_page + 1,
                search: search,
              })}                            
              only={['logs']}
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
            {logs.current_page}/{logs.last_page}
          </>
        }
        data={logs}
        hasFilter={true}
        showFilter={() => setShowModalFilter(true)}
        hasDate={true}
        dateValue={dateValue}
        onChangeDate={handleDateValueChange}
      />

      <ContentMobile>
          {logs.data.map((log) => (
              <WhatsappLogComponentMobile
                  log={log}
                  key={log.id}
              />
          ))}
      </ContentMobile>

      {/* Desktop */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-5/12'>
              
          </div>

          <div className='my-auto w-4/12 flex gap-5'>
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
              placeholder='Cari Log Aktivitas'
              className='w-full border-none focus:outline-none focus:ring-0'
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={logs} />
          </div>

          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {logs.links[0].url ? (
                <Link
                  href={route('add-ons.whatsapp-log', {
                    organization: organization.id,
                    page: logs.current_page - 1,
                    search: search,
                  })}
                  preserveState
                  only={['logs']}>
                  <IoPlayBack />
                </Link>
              ) : (
                <div className='text-gray-300'>
                  <IoPlayBack />
                </div>
              )}
            </div>
            <div className='my-auto'>
              {logs.current_page}/{logs.last_page}
            </div>
            <div className='my-auto'>
              {logs.links[logs.links.length - 1].url ? (
                <Link
                  href={route('add-ons.whatsapp-log', {
                    organization: organization.id,
                    page: logs.current_page + 1,
                    search: search,
                  })}
                  only={['logs']}
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
                    <th className='bg-gray-200'>Siswa</th>
                    <th className='bg-gray-200'>Deksripsi</th>
                    <th className='bg-gray-200'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((log, index) => (
                    <WhatsappLogComponentDesktop
                      key={index}
                      log={log}
                      className={`${index % 2 == 0 && 'bg-gray-100'}`}
                    />
                  ))}
                </tbody>
              </table>
            </ContentDesktop>
          </div>
        </div>
      </ContainerDesktop>

      {/* Modal */}
      <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)}>
				<form onSubmit={handleFilter} className='p-6' id='filter' name='filter'>
					<h2 className='text-lg font-medium text-gray-900'>Filter Log Aktifitas</h2>

					<div className='mt-6 '>
						<div className='flex flex-col sm:flex-row w-full gap-1'>
								<div className='sm:w-1/4 w-full my-auto font-bold'>Status</div>
								<div className='sm:w-3/4 w-full flex'>
									<select 
                    className="select select-bordered w-full" 
                    value={dataFilter.status} 
                    onChange={e => setDataFilter({...dataFilter, status: e.target.value})} 
                    id='study_year'
                  >
                    <option value={'all'}>Semua</option>
                    <option value={'sent'}>Terkirim</option>
                    <option value={'waiting'}>Menunggu</option>
                    <option value={'failed'}>Gagal</option>
                  </select>
								</div>
						</div>
					</div>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={() => setShowModalFilter(false)}>Batal</SecondaryButton>

						<PrimaryButton className='ms-3'>Filter</PrimaryButton>
					</div>
				</form>
			</Modal>
    </>
  )
}

Log.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Log Aktifitas</Header>}
      children={page}
      user={page.props.auth.user}
      organization={page.props.organization}
      title='Log Aktifitas'
      backLink={
          <Link href={route('add-ons.whatsapp', page.props.organization.id)}>
              <IoArrowBackOutline />
          </Link>
      }
      breadcrumbs={
          <div className='text-sm breadcrumbs'>
              <ul>
                  <li className='font-bold'>
                      <Link href={route('add-ons', page.props.organization.id)}>Add-ons</Link>
                  </li>
                  <li className='font-bold'>
                      <Link href={route('add-ons.whatsapp', page.props.organization.id)}>WhatsApp Broadcast</Link>
                  </li>
                  <li>Log Aktifitas</li>
              </ul>
          </div>
      }
      role={page.props.role}
  />
);
