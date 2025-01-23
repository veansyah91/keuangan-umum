import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head, Link, usePage } from '@inertiajs/react';
import ContainerDesktop from '@/Components/Desktop/ContainerDesktop';
import CardMenu from '@/Components/CardMenu';
import { IoIdCardOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdChecklist } from 'react-icons/md';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { CgListTree } from 'react-icons/cg';
import { TbBuildingCommunity } from 'react-icons/tb';
import { BsBuildings } from 'react-icons/bs';
import { IoMdPeople } from 'react-icons/io';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BiCategory, BiDetail } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import { RiFileListLine } from 'react-icons/ri';

export default function Index() {
  return (
    <div>Hutang</div>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
    header={<Header></Header>}
    children={page}
    user={page.props.auth.user}
    role={page.props.role}
    organization={page.props.organization}
    title='Data Master'
  />
);
