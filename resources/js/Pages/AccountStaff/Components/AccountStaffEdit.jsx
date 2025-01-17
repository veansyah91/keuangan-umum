import React, { useContext, useState } from 'react'
import { AccountStaffState } from '../Index';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { Link, useForm } from '@inertiajs/react';
import FormInput from '@/Components/FormInput';
import { toast } from 'react-toastify';

export default function AccountStaffEdit({ organization, accountStaff, accounts }) {	
	const { setIsEdit } = useContext(AccountStaffState);
  const { data, setData,  patch, processing, errors } = useForm({
		id: accountStaff ? accountStaff.id : null,
    staff_salary_expense: accountStaff ? accountStaff.staff_salary_expense.id : null,
  });

	const [staffSalaryExpense, setStaffSalaryExpense] = useState({ 
		id: accountStaff ? accountStaff.staff_salary_expense.id : null, 
		name: accountStaff ? accountStaff.staff_salary_expense.name : '', 
		code: accountStaff ? accountStaff.staff_salary_expense.code : '', 
		is_cash: accountStaff ? accountStaff.staff_salary_expense.is_cash : false 
	});

  // function
	const handleStaffSalaryExpense = (selected) => { 		
		errors.staff_salary_expense = null;
		if (selected){
			setStaffSalaryExpense({ id: selected ? selected.id : null, name: selected ? selected.name : '', code: selected ? selected.code : '', is_cash: selected ? selected.is_cash : false });
			setData('staff_salary_expense', selected ? selected.id : null);
		}    
	};

	const handleSubmit = (e) => {
		e.preventDefault();		

		patch(route('data-ledger.account-staff.update', {
			organization: organization.id,
		}),{
			onSuccess: ({ props }) => {
				const {flash} = props;

				toast.success(flash.success, {
					position: toast.POSITION.TOP_CENTER,
			});
				
			},
			onError: errors => {
				console.log(errors);
				
			}
		});

	}

  return (
		<FormInput onSubmit={handleSubmit}>
			<div className='w-full space-y-5'>
				<div className='md:flex gap-2'>
					<div className='w-full md:w-3/12 font-bold md:font-normal my-auto'>
						<InputLabel value={'Akun Pembayaran Gaji Staff'} htmlFor='staff_salary_expense' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={staffSalaryExpense}
							setSelected={(selected) => handleStaffSalaryExpense(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='staff_salary_expense'
							isError={errors?.staff_salary_expense? true : false}
						/>
						{staffSalaryExpense?.code && (
							<div className='absolute text-xs'>Kode: {staffSalaryExpense.code}</div>
						)}
					</div>
				</div>
				<div className='pt-10 space-x-2'>
					<SecondaryButton
						onClick = { () => setIsEdit(false)}
					>
						Batal
					</SecondaryButton>
					<PrimaryButton
						disabled={processing}
					>
						{accountStaff ? 'Ubah' : 'Tambah'}
					</PrimaryButton>	
							
				</div>
			</div>
		</FormInput>
  )
}
