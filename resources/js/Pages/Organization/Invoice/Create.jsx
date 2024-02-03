import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import Header from '@/Components/Header'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useRef } from 'react'
import Card from './Components/Card'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import SuccessButton from '@/Components/SuccessButton'
import Container from './Components/Container'

export default function Create({organization}) {
  const productRef = useRef('');
  const {data, setData, post, processing, errors, reset} = useForm({
    product: 'Tahunan',
  });

  const handleSubmit = (value) => {
    setData('product', value);
  }

  const handleCreateOrder = () => {
    post(route('organization.invoice.post', organization.id),{
      onSuccess: () => reset()
    })
  }

  return (
    <>
        <Head title='Organization' />
          <Container>
            <div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
              <div className='sm:p-6 px-6 py-6 text-gray-800 text-center'>
                <Header>
                  Pilih Paket Berlangganan
                </Header>
              </div>
            </div>            

            <div className='bg-white overflow-hidden shadow-sm sm:flex pb-4 px-2'>              
              <Card 
                className={`mt-2 sm:mt-0 ${data.product == "Bulanan" && 'border-[#57987f] border-2'}`}
              >
                <Card.CardHeader>
                  Bulanan
                </Card.CardHeader>
                <Card.CardContent>
                  {/* price */}
                  <div className='text-4xl'>
                    Rp. 70.000
                  </div>
                  <div className='italic text-sm'>
                    Rp. 2.333 / hari
                  </div>

                  {/* Description */}
                  <div className='mt-3 text-gray-500'>
                    Berakhir Pada {organization.expiredAddAMonth}
                  </div>
                </Card.CardContent>
                <div className='mt-5'>
                  <PrimaryButton onClick={e =>handleSubmit('Bulanan')}>
                    Pilih
                  </PrimaryButton>
                </div>
              </Card>
              
              <Card 
                className={`mt-2 sm:mt-0 ${data.product == "Tahunan" && 'border-[#57987f] border-2'}`}
              >
                <Card.CardHeader>
                  Tahunan <BadgeSuccess>Rekomendasi</BadgeSuccess>
                </Card.CardHeader>
                <Card.CardContent>
                  {/* price */}
                  <div className='text-4xl'>
                      Rp. 600.000
                    </div>
                    <div className='italic text-sm'>
                      Rp. 1.643 / hari
                    </div>

                  {/* Description */}
                  <div className='mt-3 text-gray-500'>
                    Berakhir Pada {organization.expiredAdd12Month}
                  </div>
                </Card.CardContent>
                <div className='mt-5'>
                  <PrimaryButton onClick={() => handleSubmit("Tahunan")} type="button">
                    Pilih
                  </PrimaryButton>
                </div>
              </Card>

            </div>

            <div className='bg-white rounded-b-lg p-4 flex'>
              <div className='w-1/2'>
                  <SecondaryButton onClick={() => history.back()}>Halaman Sebelumnya</SecondaryButton>
              </div>
              <div className='w-1/2 text-end'>
                <SuccessButton onClick={handleCreateOrder}>Buat Pesanan</SuccessButton>
              </div>
              
            </div>  
          </Container>          
    </>
  )
}
