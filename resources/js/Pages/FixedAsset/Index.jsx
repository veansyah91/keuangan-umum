import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import { NumericFormat } from 'react-number-format';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import Datepicker from 'react-tailwindcss-datepicker';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import FixedAssetMobile from './Components/FixedAssetMobile';
import FixedAssetDesktop from './Components/FixedAssetDesktop';

export default function Index({ role, organization, fixedAssets, status, searchFilter, startDate, endDate, flash }) {

  const [search, setSearch] = useState(searchFilter || '');

	const [dateValue, setDateValue] = useState({
		startDate: startDate || '', 
		endDate: endDate || ''
	});

  // useEffect
  useEffect(() => {
    flash.error && 
    toast.error(`Anda Tidak Memiliki Hak Akses`, {
      position: toast.POSITION.TOP_CENTER
    });
  },[])

	// function
	const handleDateValueChange = (newValue) => {
    setDateValue(newValue); 
  }
  return (
    <>
      <Head title='Harta Tetap' />
      <ToastContainer />

			{/* Mobile */}
			{
				(role !== 'viewer') && <Link href={route('data-master.fixed-asset.create', organization.id)}><AddButtonMobile label={"Tambah"}/></Link> 
			}
			<TitleMobile 
        zIndex={'z-50'}
        search={search}
        setSearch= {e => setSearch(e.target.value)}
        pageBefore={
              fixedAssets.links[0].url 
        ? <Link href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page - 1}&search=${search}`} preserveState only={['fixedAssets']}><IoPlayBack /></Link>
        : <div className='text-gray-300'><IoPlayBack /></div>
        }
        pageAfter={
              fixedAssets.links[fixedAssets.links.length-1].url 
              ? <Link href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page + 1}&search=${search}`}
                only={['fixedAssets']} preserveState>
                <IoPlayForward />
              </Link>
              : <div className='text-gray-300'><IoPlayForward /></div>
        }
        page={
          <>
            {fixedAssets.current_page}/{fixedAssets.last_page}
          </>
        }
        data={fixedAssets}
        hasFilter={true}
        showFilter={() => setShowModalFilter(true)}
        hasDate={true}
        dateValue={dateValue}
        onChangeDate={handleDateValueChange}
      />
      <ContentMobile>
      {
        fixedAssets.data.map(fixedAsset => 
          <FixedAssetMobile
            fixedAsset={fixedAsset}
            key={fixedAsset.id}
            handleDelete={() => handleDelete(fixedAsset)}
            role={role}
          />
        )
      }
      </ContentMobile>
			{/* Mobile */}

      {/* Desktop */}
        <ContainerDesktop>
          <TitleDesktop>
            <div className='my-auto w-5/12'>
              {
                (role !== 'viewer') &&
                <Link href={route('data-master.fixed-asset.create', organization.id)}>
                  <PrimaryButton className='py-3'>
                      Tambah Data
                  </PrimaryButton>         
                </Link>                   
              }
            </div>
            <div className='my-auto w-4/12 flex gap-5'>
              <button className='py-2 px-3 border rounded-lg' onClick={() => setShowModalFilter(true)}><IoFilter /></button>
              <Datepicker
                value={dateValue} 
                onChange={handleDateValueChange} 
                showShortcuts={true} 
                configs={{
                  shortcuts: {
                    today: "Hari Ini", 
                    yesterday: "Kemarin", 
                    past: period => `${period} Hari Terakhir`, 
                    currentMonth: "Bulan Ini", 
                    pastMonth: "Bulan Lalu", 
                    currentYear: "Tahun Ini"
                  },
                }} 
                separator={"s.d"}                                 
              />					
            </div>

            <div className='w-3/12 border flex rounded-lg'>					
              <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
              <input id='search-input' name='search-input' type="search" placeholder='Cari Harta Tetap' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
              onChange={e => setSearch(e.target.value)}/>
            </div>

            <div className='italic text-xs my-auto w-1/12 text-center'>
                <PageNumber data={fixedAssets} />
            </div>

            <div className='my-auto flex space-x-2 w-1/12'>
              <div className='my-auto'>
                {
                  fixedAssets.links[0].url 
                  ? <Link 
                      href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page - 1}&search=${search}`}
                      preserveState only={['fixedAssets']}
                    >
                      <IoPlayBack />
                    </Link>
                  : <div className='text-gray-300'><IoPlayBack /></div>
                }                                
              </div>
              <div className='my-auto'>{fixedAssets.current_page}/{fixedAssets.last_page}</div>
              <div className='my-auto'>
                {
                  fixedAssets.links[fixedAssets.links.length-1].url 
                  ? <Link 
                      href={`/data-master/${organization.id}/fixed-assets?page=${fixedAssets.current_page + 1}&search=${search}`}
                      only={['fixedAssets']} preserveState
                    >
                    <IoPlayForward />
                  </Link>
                  : <div className='text-gray-300'><IoPlayForward /></div>
                }   
              </div>
            </div>
          </TitleDesktop>

          <div className='sm:flex hidden gap-5'>
            <div className='w-full'>
					    <ContentDesktop>
                <table className='table table-pin-rows table-pin-cols text-base'>
                  <thead className='text-base text-gray-900'>
                    <tr className=''>
                      <th className='bg-gray-200'>Tanggal Perolehan</th>
                      <th className='bg-gray-200'>No. Ref</th>
                      <th className='bg-gray-200'>Nama</th>
                      <th className='bg-gray-200 text-end'>Nilai</th>
                      <th className='bg-gray-200 text-center'>Penyusutan Perbulan</th>
                      <th className='bg-gray-200 text-center'>Akumulasi Penyusutan</th>
                      <th className='bg-gray-200 text-center'>Nilai Buku</th>
                      <th className='bg-gray-200 text-center'>Status</th>
                      <th className='bg-gray-200'></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    fixedAssets.data.map((fixedAsset, index) => 
                      <FixedAssetDesktop
                        fixedAsset={fixedAsset}
                        key={fixedAsset.id}
                        className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                        handleDelete={() => handleDelete(fixedAsset)}
                        role={role}
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
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Harta Tetap</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title="Harta Tetap"
    backLink={<Link href={route('data-master',page.props.organization.id)}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Master</Link></li> 
            <li>Harta Tetap</li>
        </ul>
    </div>}
    role={page.props.role}
/>
