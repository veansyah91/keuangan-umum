import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    IoArrowBackOutline,
    IoPlayBack,
    IoPlayForward,
} from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { NumericFormat } from 'react-number-format';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { FaPowerOff } from 'react-icons/fa';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import WhatsappLogComponentMobile from './Components/WhatsappLogComponentMobile';

export default function Log({
  logs, startDate, endDate, searchFilter
}) {
  const [search, setSearch] = useState(searchFilter || '');
  const [dateValue, setDateValue] = useState({
    startDate: startDate || '',
    endDate: endDate || '',
  });

  // function
  const handleDateValueChange = (newValue) => {
    setDateValue(newValue);
  };


  console.log(logs);
  
  return (
    <>
      <Head title='Log Aktifitas' />
      <ToastContainer />

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
