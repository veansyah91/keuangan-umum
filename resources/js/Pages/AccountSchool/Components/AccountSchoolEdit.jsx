import React, { useContext, useState } from 'react'
import { AccountSchool } from '../Index';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { useForm } from '@inertiajs/react';

export default function AccountSchoolEdit({ accountSchool, accounts }) {
  
	const { isEdit, setIsEdit } = useContext(AccountSchool);
  const { data, setData,  patch, processing } = useForm({
    receivable_entry_student: accountSchool ? accountSchool.revenue_student : null
  });

  const [receivableEntryStudent, setReceivableEntryStudent] = useState({ id: accountSchool ? accountSchool.receivable_entry_student.id : null, name: accountSchool ? accountSchool.receivable_entry_student.name : '', code: accountSchool ? accountSchool.receivable_entry_student.id : '', is_cash: accountSchool ? accountSchool.receivable_entry_student.is_cash : true });

  // function
  const handleReceivableEntryStudent = (selected) => {
    console.log(selected);
    
    setReceivableEntryStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('cash_account_id', selected.id);
};

  return (
    <div className='w-full space-y-3'>
      <div className='md:flex gap-2'>
        <div>
          <InputLabel value={'Akun Piutang Uang Masuk Siswa'} htmlFor='receivable_entry_student' />
        </div>
        <div>
          <ClientSelectInput
            resources={accounts}
            selected={setReceivableEntryStudent}
            setSelected={(selected) => handleReceivableEntryStudent(selected)}
            maxHeight='max-h-40'
            placeholder='Cari Akun'
            id='receivable_entry_student'
          />
          {setReceivableEntryStudent?.code && (
            <div className='absolute text-xs'>Kode: {setReceivableEntryStudent.code}</div>
          )}
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
					Akun Pembayaran Gaji Staff <span className='md:hidden'>:</span>
				</div>
				<div className='w-full md:w-7/12 my-auto'>
					<span className='hidden md:inline'>: </span>{ accountSchool?.staff_salary_expense?.code } - { accountSchool?.staff_salary_expense?.name }
				</div>
			</div>	
      <div className='pt-10 space-x-2'>
        <SecondaryButton
					onClick = { () => setIsEdit(false)}
				>
					Batal
				</SecondaryButton>
				<PrimaryButton
					onClick = { () => setIsEdit(true)}
				>
					Ubah
				</PrimaryButton>	
        		
			</div>
    </div>
  )
}
