import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React from 'react'

export default function StudentEntryPaymentDesktop({
  payment, className
}) {
  console.log(payment);
  
  return (
    <tr className={className}>
      <td>{dayjs(payment.date).locale('id').format('MMMM DD, YYYY')}</td>
      <td>{ payment.no_ref }</td>
      <td>
        <div className='text-xs'>
          No. Siswa: {payment.contact.student.no_ref}
        </div>
        <div>
          {payment.contact.name}
        </div>
      </td>
      <td>{payment.study_year}</td>
      <td className='text-end'>IDR. { formatNumber(payment.value) }</td>
      <td className=''></td>
    </tr>
  )
}
