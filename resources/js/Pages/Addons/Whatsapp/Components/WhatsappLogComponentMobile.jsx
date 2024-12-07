import dayjs from 'dayjs'
import React from 'react'

export default function WhatsappLogComponentMobile({ log }) {
  return (
    <div className=' text-gray-900 py-2 px-3 border flex gap-5 justify-between'>
      <div className='text-start my-auto w-1/2'>
        <div className='text-xs'>{dayjs(log.created_at).locale('id').format('MMM DD, YYYY')}</div>
        <div>
          <div className='text-sm'>
            {log.contact.name}
          </div>
          <div>
            {log.contact.phone}
          </div>
        </div>
        <div className='text-xs'>{log.description}</div>
      </div>
      <div className='text-end my-auto w-5/12'>
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
      </div>
    </div>
  )
}
