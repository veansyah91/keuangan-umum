import PrimaryButton from '@/Components/PrimaryButton'
import React, { useContext } from 'react'
import { AccountStaffState } from '../Index'

export default function AccountStaffData({ accountStaff }) {
  const { setIsEdit } = useContext(AccountStaffState);

  return (
    <div className='w-full space-y-3'>	
      <div className='md:flex gap-2'>
        <div className='w-full md:w-3/12 font-bold md:font-normal'>
          Akun Pembayaran Gaji Staff <span className='md:hidden'>:</span>
        </div>
        <div className='w-full md:w-7/12 my-auto'>
          <span className='hidden md:inline'>: </span>{ accountStaff?.staff_salary_expense?.code } - { accountStaff?.staff_salary_expense?.name }
        </div>
      </div>	
      <div className='pt-10'>
        <PrimaryButton
          onClick = { () => setIsEdit(true)}
        >
          Ubah
        </PrimaryButton>		
      </div>				
    </div>
  )
}
