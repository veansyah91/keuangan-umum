import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
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
import { IoCreateOutline, IoEllipsisVertical } from 'react-icons/io5/index.esm';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';

function Index({ withdraws, searchFilter }) {
  console.log(withdraws);
  const [search, setSearch] = useState(searchFilter || '');
  const [showModalFilter, setShowModalFilter] = useState(false);

  const [dateValue, setDateValue] = useState({
    startDate: '', 
    endDate: ''
  });

  // function
  const handleDateValueChange = (newValue) => {
    setDateValue(newValue); 
  } 

  return (
    <>
      <Head title='Penarikan Saldo Afiliasi' />

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
                    Diajukan Tanggal: { dayjs(withdraw.created_at).format('MMMM YYYY, DD') }
                </div>
                <div className='text-sm'>
                    {
                        withdraw.status 
                        ? <div className='italic text-green-600'>Telah Dikirim</div>
                        : <div className='italic text-red-600'>Belum Dikirim</div>
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
                        <Link>
                          <IoCreateOutline /> Edit
                        </Link>   
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
              <input id='search-input' name='search-input' type="search" placeholder='Cari Pengguna' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
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
                  <th className='bg-gray-200'>Status</th>
                  <th className='bg-gray-200'></th>
                </tr>
              </thead>
            </table>  
          </ContentDesktop>
        </ContainerDesktop>
      {/* Desktop */}

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
