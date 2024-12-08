import dayjs from 'dayjs'
import React from 'react'

export default function WhatsappLogComponentDesktop({
  log, className
}) {
  return (
    <tr className={className}>
      <td>{dayjs(log.created_at).locale('id').format('MMM DD, YYYY')}</td>
      <td>
        <div className='text-sm'>{log.contact.name}</div>
        <div>{log.contact.phone}</div>
      </td>
      <td>{log.description}</td>
      <td>
        {
          log.status == 'waiting' && <div className='text-orange-600'>
            Menunggu
          </div>
        }
        {
          log.status == 'failed' && <div className='text-red-600'>
            Gagal
          </div>
        }
        {
          log.status == 'sent' && <div>
            <div className='text-green-600'>Terkirim</div>
            <div className='text-xs italic'>{dayjs(log.updated_at).locale('id').format('MMM DD, YYYY')}</div>
          </div>
        }
      </td>
    </tr>
  )
}
