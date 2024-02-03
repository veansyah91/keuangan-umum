import Container from '@/Components/Container';
import Header from '@/Components/Header';
import { Head } from '@inertiajs/react';
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function Index() {
  return (
      <>
          <Head title='Dasbor' />

          <Container>
              <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                  <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                      <div className='p-6 text-gray-900'>Dasbor</div>
                  </div>
              </div>
          </Container>
      </>
  );
}

Index.layout = page => <AuthenticatedLayout
    header={<Header>Dasbor</Header>}
    children={page}
    user={page.props.auth.user}
/>

export default Index;
