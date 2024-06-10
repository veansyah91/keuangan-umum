import BadgeSuccess from '@/Components/Badges/BadgeSuccess'
import Header from '@/Components/Header'
import { Head, Link, router, useForm } from '@inertiajs/react'
import React, { useEffect, useRef, useState } from 'react'
import Card from './Components/Card'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import SuccessButton from '@/Components/SuccessButton'
import Container from './Components/Container'
import { useDebounce } from 'use-debounce';
import { usePrevious } from 'react-use';
import TextInput from '@/Components/TextInput';

export default function Create({organization, affiliate}) {
  
  const {data, setData, post, processing, errors, reset} = useForm({
    product: 'Tahunan',
    affiliation_id:''
  });

  const [affilateInput, setAffiliateInput] = useState('');
  const [bonus, setBonus] = useState('');

  const [debounceData] = useDebounce(affilateInput, 500);
  const prevSearch = usePrevious(affilateInput);

  const handleSubmit = (value) => {
    setData('product', value);
  }

  const handleCreateOrder = () => {
    post(route('organization.invoice.post', organization.id),{
      onSuccess: () => reset()
    })
  }

  // useEffect
  useEffect(() => {
    if(prevSearch!==undefined) {
      handleSetAffiliate(); 
    }
  },[debounceData])

  // function
  const handleSetAffiliate = () => {
    router.reload({
      only: ['affiliate', 'organization'],
      data: {
        'affiliate' : affilateInput
      },
      onSuccess: ({ props }) => {
        if (props.affiliate) {
          setBonus('+ 3 Bulan');
          setData('affiliation_id', props.affiliate.id);
        } else {
          setBonus('');
          setData('affiliation_id', '');
        }
      }
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
                    <div>Berakhir Pada {organization.expiredAdd12Month}</div>
                    <div>{bonus && <span className='italic text-green-500 font-bold'>{ bonus }</span>}</div>
                  </div>

                  {/* Affiliate */}
                  {
                    !organization.affiliation_id && 
                    <TextInput
                      id='affiliate'
                      type='text'
                      name='affiliate'
                      value={affilateInput}
                      className={`mt-5 w-full border-red-500'}`}
                      isFocused={true}
                      onChange={(e) => setAffiliateInput(e.target.value.toUpperCase())}
                      placeholder="Kode Affiliate (opsional)"
                    />
                  }
                  
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
                <Link href={ route('organization.invoice', organization.id) }>
                    <SecondaryButton>Halaman Sebelumnya</SecondaryButton>
                </Link>
              </div>
              <div className='w-1/2 text-end'>
                <SuccessButton onClick={handleCreateOrder}>Buat Pesanan</SuccessButton>
              </div>
              
            </div>  
          </Container>          
    </>
  )
}
