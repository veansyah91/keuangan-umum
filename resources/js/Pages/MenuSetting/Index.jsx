import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router, useForm } from '@inertiajs/react';
import TitleMobile from '@/Components/Mobiles/TitleMobile';
import {
    IoPlayBack,
    IoPlayForward,
    IoSearchSharp,
} from 'react-icons/io5';
import { useDebounce } from 'use-debounce';
import PageNumber from '@/Components/PageNumber';
import Datepicker from 'react-tailwindcss-datepicker';
import ContentMobile from '@/Components/Mobiles/ContentMobile';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import TitleDesktop from '@/Components/Desktop/TitleDesktop';
import ContentDesktop from '@/Components/Desktop/ContentDesktop';
import { usePrevious } from 'react-use';
import { ToastContainer } from 'react-toastify';
import FormInput from '@/Components/FormInput';
import PrimaryButton from '@/Components/PrimaryButton';

const filterData = (pages, menus) => {
  let newMenus = [];
  
  pages.forEach(page => {
    let tempPage = {
      pageName: page.name,
      details: menus.filter(menu => page.name === menu.page).map(menu => ({ menuId: menu.id, menuName: menu.name, isActive: menu.pivot.is_active }))
    }
    if (tempPage.details.length > 0) {
      newMenus = [
        ...newMenus, tempPage
      ]  
    }       
  });
  return newMenus;
}

const filterValue = (page, data) => {
  // return data.filter(d => )
}

export default function Index({ pages, organization }) {
  const { data, setData, processing } = useForm({
    'menu' : []
  });


  useEffect(() => {

    setData('menu',filterData(pages, organization.menus));

  },[]);

  const handleChangeData = (menu, index1, index2) => {
    console.log(menu);
    console.log(index1);
    console.log(index2);

    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(data);
    
  }
  
  return (
    <>
      <Head title='Pengaturan Menu' />
      <ToastContainer />

      <FormInput onSubmit={handleSubmit}>
        <div className='w-full sm:mt-2 sm:py-5'>
          <div className='sm:mx-auto px-3 sm:px-5 space-y-5'>
            {
              filterData(pages, organization.menus).map((menu, index1) => 
                <div className='w-full text-slate-900 space-y-2 sm:space-y-0 sm:flex' key={index1}>
                  <div className='w-full sm:w-2/12 text-center sm:text-start uppercase font-bold'>
                    { menu.pageName }
                  </div>
                  <div className='w-full sm:w-2/12 text-start'>
                    {
                      menu.details.map((detail, index2) =>
                        <div className='form-control' key={index2}>
                          <label className='label cursor-pointer gap-2' htmlFor={detail.menuId}>
                            <input
                              type='checkbox'
                              className='checkbox'
                              id={detail.menuId}
                              value={detail.isActive}
                              onChange={() => handleChangeData(menu, index1, index2)}
                              checked={detail.isActive}
                            />
                            <span className='label-text w-full'>{ detail.menuName }</span>
                          </label>
                        </div>
                      ) 
                    }                    
                  </div>
                </div>
              )
              
            }
            
            <div className='flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5'>
              <div className='w-full sm:w-1/12 text-center'>
                <PrimaryButton className='w-full' disabled={processing}>
                  <div className='text-center w-full'>Ubah</div>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
        
      </FormInput>
    </>
  )
}

Index.layout = (page) => (
    <AuthenticatedLayout
        header={<Header>Pengaturan Menu</Header>}
        children={page}
        user={page.props.auth.user}
        role={page.props.role}
        organization={page.props.organization}
        title='Pengaturan Menu'
    />
);
