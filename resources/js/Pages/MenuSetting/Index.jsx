import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, router } from '@inertiajs/react';
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

export default function Index({ pages, organization }) {
  console.log(pages);
  console.log(organization);
  
  return (
    <div>Index</div>
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
