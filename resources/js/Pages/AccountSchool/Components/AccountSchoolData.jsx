import PrimaryButton from '@/Components/PrimaryButton'
import React, { useContext } from 'react'
import { AccountSchoolState } from '../Index'

export default function AccountSchoolData({ accountSchool }) {
	const { setIsEdit } = useContext(AccountSchoolState);

  return (
    <div className='w-full space-y-3'>						
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Piutang Uang Masuk Siswa <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>
						{ accountSchool?.receivable_entry_student?.code } - { accountSchool?.receivable_entry_student?.name }								
				</div>
			</div>	
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Piutang Iuran Bulanan Siswa <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>
						{ accountSchool?.receivable_monthly_student?.code } - { accountSchool?.receivable_monthly_student?.name }								
				</div>
			</div>
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Pendapatan Dibayar Di Muka Iuran Bulanan Siswa <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>{ accountSchool?.prepaid_student?.code } - { accountSchool?.prepaid_student?.name }
				</div>
			</div>
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Pendapatan Iuran Bulanan Siswa <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>{ accountSchool?.revenue_student?.code } - { accountSchool?.revenue_student?.name }
				</div>
			</div>
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Pendapatan Uang Masuk Siswa <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>{ accountSchool?.entry_student?.code } - { accountSchool?.entry_student?.name }
				</div>
			</div>
			<div className='md:flex gap-2'>
				<div className='w-full md:w-3/12 font-bold md:font-normal'>
					Akun Pembayaran Gaji Staff <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>{ accountSchool?.staff_salary_expense?.code } - { accountSchool?.staff_salary_expense?.name }
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
