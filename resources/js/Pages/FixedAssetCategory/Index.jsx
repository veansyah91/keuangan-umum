import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { IoArrowBackOutline, IoFilter, IoPlayBack, IoPlayForward, IoSearchSharp, IoTrashOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import AddButtonMobile from '@/Components/AddButtonMobile';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import { usePrevious } from 'react-use';
import { useDebounce } from 'use-debounce';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import PrimaryButton from '@/Components/PrimaryButton';
import PageNumber from '@/Components/PageNumber';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import FixedAssetCategoryDesktop from './Components/FixedAssetCategoryDesktop';

export default function Index({ role, organization, fixedAssetCategories, status, searchFilter, startDate, endDate }) {
  console.log(fixedAssetCategories);
  const [search, setSearch] = useState(searchFilter || '');
  const [debounceValue] = useDebounce(search, 500);
  const [dataFilter, setDataFilter] = useState({
		'status' : status || undefined,
   });

	const prevSearch = usePrevious(search);


  // useEffect
  useEffect(() => {
		if(prevSearch!==undefined) {
      handleReloadPage();
    }
	},[debounceValue]);

  // function
  const handleReloadPage = () => {
		router.reload({
			only: ['fixedAssetCategories'],
			data: {
              search, 
              'status' : dataFilter.status,
            },
			preserveState: true
		})
	}

  return (
    <>
      <Head title='Kelompok Harta Tetap' />
      <ToastContainer />

      {/* Mobile */}
      {
      (role !== 'viewer') && <AddButtonMobile label={"Tambah"}/>
      }
      <TitleMobile 
        zIndex={'z-50'}
        search={search}
        setSearch= {e => setSearch(e.target.value)}
        pageBefore={
          fixedAssetCategories.links[0].url 
          ? <Link href={`/data-master/${organization.id}/fixed-asset-categories?page=${fixedAssetCategories.current_page - 1}&search=${search}`} preserveState only={['fixedAssetCategories']}><IoPlayBack /></Link>
          : <div className='text-gray-300'><IoPlayBack /></div>
        }
        pageAfter={
          fixedAssetCategories.links[fixedAssetCategories.links.length-1].url 
          ? <Link href={`/data-master/${organization.id}/fixed-asset-categories?page=${fixedAssetCategories.current_page + 1}&search=${search}`}
            only={['fixedAssetCategories']} preserveState>
            <IoPlayForward />
          </Link>
          : <div className='text-gray-300'><IoPlayForward /></div>
        }
        page={
          <>
            {fixedAssetCategories.current_page}/{fixedAssetCategories.last_page}
          </>
        }
        data={fixedAssetCategories}
        hasFilter={true}
        showFilter={() => setShowModalFilter(true)}
      />
      {/* Mobile */}

      {/* Desktop  */}
      <ContainerDesktop>
        <TitleDesktop>
          <div className='my-auto w-7/12'>
            {
              (role !== 'viewer') &&
              <PrimaryButton className='py-3'>
                Tambah Data
              </PrimaryButton>      
            }
          </div>
          <div className='w-3/12 border flex rounded-lg'>					
            <label htmlFor='search-input' className='my-auto ml-2'><IoSearchSharp /></label>
            <input id='search-input' name='search-input' type="search" placeholder='Cari Kelompok Harta Tetap' className='w-full border-none focus:outline-none focus:ring-0' value={search || ''}
            onChange={e => setSearch(e.target.value)}/>
          </div>

          <div className='italic text-xs my-auto w-1/12 text-center'>
            <PageNumber data={fixedAssetCategories} />
          </div>
          <div className='my-auto flex space-x-2 w-1/12'>
            <div className='my-auto'>
              {
                fixedAssetCategories.links[0].url 
                ? <Link 
                    href={`/data-master/${organization.id}/fixed-asset-categories?page=${fixedAssetCategories.current_page - 1}&search=${search}`}
                    preserveState only={['fixedAssetCategories']}
                  >
                    <IoPlayBack />
                  </Link>
                : <div className='text-gray-300'><IoPlayBack /></div>
              }                                
            </div>
            <div className='my-auto'>{fixedAssetCategories.current_page}/{fixedAssetCategories.last_page}</div>
            <div className='my-auto'>
              {
                fixedAssetCategories.links[fixedAssetCategories.links.length-1].url 
                ? <Link 
                    href={`/data-master/${organization.id}/fixed-asset-categories?page=${fixedAssetCategories.current_page + 1}&search=${search}`}
                    only={['fixedAssetCategories']} preserveState
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
                  <th className='bg-gray-200'>Nama</th>
                  <th className='bg-gray-200'>Usia Penggunaan (Bulan)</th>
                  <th className='bg-gray-200'>Usia Penggunaan (Tahun)</th>
                  <th className='bg-gray-200 text-center'>Status</th>
                  <th className='bg-gray-200'></th>
                </tr>
              </thead>
              <tbody>
                  {
                      fixedAssetCategories.data.map((data, index) =>
                          <FixedAssetCategoryDesktop 
                              key={index} 
                              data={data} 
                              className={`${index % 2 == 0 && 'bg-gray-100'}`} 
                              handleEdit={() => handleEdit(data)}
                              handleDelete={() => handleDelete(data)}
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
        
      {/* Desktop  */}
    </>
  )
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Kelompok Harta Tetap</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    title="Kelompok Harta Tetap"
    backLink={<Link href={route('data-master',page.props.organization.id)}><IoArrowBackOutline/></Link>}
    breadcrumbs={<div className="text-sm breadcrumbs">
        <ul>
            <li className='font-bold'><Link href={route('data-master',page.props.organization.id)}>Master</Link></li> 
            <li>Kelompok Harta Tetap</li>
        </ul>
    </div>}
    role={page.props.role}
/>