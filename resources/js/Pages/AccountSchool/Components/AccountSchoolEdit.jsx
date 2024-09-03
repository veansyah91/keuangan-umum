import React, { useContext, useState } from 'react'
import { AccountSchoolState } from '../Index';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import ClientSelectInput from '@/Components/SelectInput/ClientSelectInput';
import { Link, useForm } from '@inertiajs/react';
import FormInput from '@/Components/FormInput';
import { toast } from 'react-toastify';

export default function AccountSchoolEdit({ organization, accountSchool, accounts }) {
	const { setIsEdit } = useContext(AccountSchoolState);
  const { data, setData,  patch, processing, errors } = useForm({
		id: accountSchool ? accountSchool.id : null,
		revenue_student: accountSchool ? accountSchool.revenue_student.id : null,
    receivable_monthly_student: accountSchool ? accountSchool.receivable_monthly_student.id : null,
    receivable_entry_student: accountSchool ? accountSchool.receivable_entry_student.id : null,
    prepaid_student: accountSchool ? accountSchool.prepaid_student.id : null,
    entry_student: accountSchool ? accountSchool.entry_student.id : null,
    staff_salary_expense: accountSchool ? accountSchool.staff_salary_expense.id : null,
  });

	const [entryStudent, setEntryStudent] = useState({ 
		id: accountSchool ? accountSchool.entry_student.id : null, 
		name: accountSchool ? accountSchool.entry_student.name : '', 
		code: accountSchool ? accountSchool.entry_student.code : '', 
		is_cash: accountSchool ? accountSchool.entry_student.is_cash : false 
	});

  const [receivableEntryStudent, setReceivableEntryStudent] = useState({ 
		id: accountSchool ? accountSchool.receivable_entry_student.id : null, 
		name: accountSchool ? accountSchool.receivable_entry_student.name : '', 
		code: accountSchool ? accountSchool.receivable_entry_student.code : '', 
		is_cash: accountSchool ? accountSchool.receivable_entry_student.is_cash : false 
	});

  const [receivableMonthlyStudent, setReceivableMonthlyStudent] = useState({ 
		id: accountSchool ? accountSchool.receivable_monthly_student.id : null, 
		name: accountSchool ? accountSchool.receivable_monthly_student.name : '', 
		code: accountSchool ? accountSchool.receivable_monthly_student.code : '', 
		is_cash: accountSchool ? accountSchool.receivable_monthly_student.is_cash : false 
	});

	const [prepaidStudent, setPrepaidStudent] = useState({ 
		id: accountSchool ? accountSchool.prepaid_student.id : null, 
		name: accountSchool ? accountSchool.prepaid_student.name : '', 
		code: accountSchool ? accountSchool.prepaid_student.code : '', 
		is_cash: accountSchool ? accountSchool.prepaid_student.is_cash : false 
	});

	const [revenueStudent, setRevenueStudent] = useState({ 
		id: accountSchool ? accountSchool.revenue_student.id : null, 
		name: accountSchool ? accountSchool.revenue_student.name : '', 
		code: accountSchool ? accountSchool.revenue_student.code : '', 
		is_cash: accountSchool ? accountSchool.revenue_student.is_cash : false 
	});

	const [staffSalaryExpense, setStaffSalaryExpense] = useState({ 
		id: accountSchool ? accountSchool.staff_salary_expense.id : null, 
		name: accountSchool ? accountSchool.staff_salary_expense.name : '', 
		code: accountSchool ? accountSchool.staff_salary_expense.code : '', 
		is_cash: accountSchool ? accountSchool.staff_salary_expense.is_cash : false 
	});

  // function
	const handleEntryStudent = (selected) => {   
		errors.entry_student = null;
    setEntryStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('entry_student', selected.id);
	};

  const handleReceivableEntryStudent = (selected) => { 
		errors.receivable_entry_student = null;
    setReceivableEntryStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('receivable_entry_student', selected.id);
	};

	const handleReceivableMonthlyStudent = (selected) => { 
		errors.receivable_monthly_student = null;
    setReceivableMonthlyStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('receivable_monthly_student', selected.id);
	};

	const handlePrepaidStudent = (selected) => {    
		errors.prepaid_student = null;
    setPrepaidStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('prepaid_student', selected.id);
	};

	const handleRevenueStudent = (selected) => {  
		errors.revenue_student = null;
    setRevenueStudent({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('revenue_student', selected.id);
	};

	const handleStaffSalaryExpense = (selected) => { 
		errors.staff_salary_expense = null;
    setStaffSalaryExpense({ id: selected.id, name: selected.name, code: selected.code, is_cash: selected.is_cash });
    setData('staff_salary_expense', selected.id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		patch(route('data-ledger.account-school.update', {
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
						<InputLabel value={'Akun Piutang Uang Masuk / Tahunan Siswa'} htmlFor='revenue_student' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={receivableEntryStudent}
							setSelected={(selected) => handleReceivableEntryStudent(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='revenue_student'
							isError={errors?.receivable_entry_student? true : false}
							notFound={<span>Tidak Ada Data. <Link className='font-bold text-blue-600' href={route('data-ledger.account', {organization:organization.id})}>Buat Baru ?</Link></span>}
						/>
						{receivableEntryStudent?.code && (
							<div className='absolute text-xs'>Kode: {receivableEntryStudent.code}</div>
						)}
					</div>
				</div>	
				<div className='md:flex gap-2'>
					<div className='w-full md:w-3/12 font-bold md:font-normal my-auto'>
						<InputLabel value={'Akun Piutang Uang Bulanan Siswa'} htmlFor='receivable_monthly_student' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={receivableMonthlyStudent}
							setSelected={(selected) => handleReceivableMonthlyStudent(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='receivable_monthly_student'
							isError={errors?.receivable_monthly_student? true : false}
						/>
						{receivableMonthlyStudent?.code && (
							<div className='absolute text-xs'>Kode: {receivableMonthlyStudent.code}</div>
						)}
					</div>
				</div>	
				<div className='md:flex gap-2'>
					<div className='w-full md:w-3/12 font-bold md:font-normal my-auto'>
						<InputLabel value={'Akun Pendapatan Diterima Di Muka Iuran Bulanan Siswa'} htmlFor='prepaid_student' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={prepaidStudent}
							setSelected={(selected) => handlePrepaidStudent(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='prepaid_student'
							isError={errors?.prepaid_student? true : false}
						/>
						{prepaidStudent?.code && (
							<div className='absolute text-xs'>Kode: {prepaidStudent.code}</div>
						)}
					</div>
				</div>	
				<div className='md:flex gap-2'>
					<div className='w-full md:w-3/12 font-bold md:font-normal my-auto'>
						<InputLabel value={'Akun Pendapatan Iuran Bulanan Siswa'} htmlFor='revenue_student' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={revenueStudent}
							setSelected={(selected) => handleRevenueStudent(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='revenue_student'
							isError={errors?.revenue_student? true : false}
						/>
						{revenueStudent?.code && (
							<div className='absolute text-xs'>Kode: {revenueStudent.code}</div>
						)}
					</div>
				</div>
				<div className='md:flex gap-2'>
					<div className='w-full md:w-3/12 font-bold md:font-normal my-auto'>
						<InputLabel value={'Akun Pendapatan Uang Masuk / Tahunan Siswa'} htmlFor='entry_student' />
					</div>
					<div className='w-full md:w-7/12 my-auto'>
						<ClientSelectInput
							resources={accounts}
							selected={entryStudent}
							setSelected={(selected) => handleEntryStudent(selected)}
							maxHeight='max-h-40'
							placeholder='Cari Akun'
							id='entry_student'
							isError={errors?.entry_student? true : false}
						/>
						{entryStudent?.code && (
							<div className='absolute text-xs'>Kode: {entryStudent.code}</div>
						)}
					</div>
				</div>
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
						{accountSchool ? 'Ubah' : 'Tambah'}
					</PrimaryButton>	
							
				</div>
			</div>
		</FormInput>
  )
}
