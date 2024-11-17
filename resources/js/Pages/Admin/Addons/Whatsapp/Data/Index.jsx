import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function Index() {
  return (
    <div>Index</div>
  )
}

Index.layout = (page) => (
  <AuthenticatedLayout
      header={<Header>Data</Header>}
      breadcrumbs={
        <div className='text-sm breadcrumbs'>
            <ul>
                <li className='font-bold'>
                    <Link href={route('admin.add-ons')}>Addons</Link>
                </li>
                <li>Data</li>
            </ul>
        </div>
    }
      children={page}
      user={page.props.auth.user}
      title='Data'
  />
);
