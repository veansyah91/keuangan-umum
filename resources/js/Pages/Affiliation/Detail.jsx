import Header from '@/Components/Header'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Detail({ auth }) {
  return (
    <>
      <Head title='Detail Pengajuan Penarikan' />

			<div className='bg-gray-100 min-h-screen'>
				<div className='bg-white max-w-7xl mx-auto sm:px-6 lg:px-8'>
					{/* Breadcrumbs */}
					<div className="text-sm breadcrumbs px-4 py-4">
						<ul>
							<li className='font-bold'><Link href={route('organization')}>Daftar Organisasi</Link></li> 
							<li className='font-bold'><Link href={route('organization')}>Daftar Organisasi</Link></li> 
							<li>Detail</li>
						</ul>
					</div>

					{/* Title */}
					<Header>
						<div className='bg-white overflow-hidden shadow-sm sm:rounded-t-lg'>
								<div className='sm:p-6 px-6 py-3 text-gray-800 flex-none sm:flex'>
										<div className='sm:hidden text-gray-800 flex flex-col-reverse gap-5'>
												<div className="my-auto">
														Afiliasi
												</div>
												<div className="flex flex-row-reverse text-end">
														<div>
																<div className='text-gray-400 text-sm'>
																		{auth.user.name}
																</div>                                    
																<div className=' text-xs text-green-400'>
																		{auth.user.email}
																</div>
														</div>
												</div>                                    
										</div>
										<div className='sm:flex-1 my-auto sm:block hidden'>
												Afiliasi
										</div>
										<div className='sm:flex-1 sm:block hidden text-end text-gray-800'>
												<div className="flex flex-row-reverse">
														<div>
																<div className='text-gray-400'>
																		{auth.user.name}
																</div>
																
																<div className=' text-sm text-green-400'>
																		{auth.user.email}
																</div>
														</div>
												</div>
										</div>
								</div>
						</div>
					</Header>
				</div>
			</div>
    </>
  )
}
