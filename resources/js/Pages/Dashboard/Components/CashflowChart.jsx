import { AppContext } from '@/Layouts/AuthenticatedLayout';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React, { useContext } from 'react'
import { FaRupiahSign } from 'react-icons/fa6'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const formatter = (value) => formatNumber(value);

const fullDate = (date) => {
  return dayjs(date.start).format('MMMM YYYY');
}

const CustomToolTip = (props) => {
  const { date } = useContext(AppContext);

  return (
    <div className='bg-white p-2 border border-slate-900 rounded-lg'>
     {
      props?.payload?.[0] && 
      <div className='text-xs'>Tanggal : {props.payload[0].payload.date} {fullDate(date)} </div>
     }
     {
      props?.payload?.map((value, index) => <div className='text-xs' key={index}>        
        <div>{value.name} : IDR {formatNumber(value.value)}</div>
      </div>)
     }
    </div>
  )
}

export default function CashflowChart({ data }) {
  const { date } = useContext(AppContext);

  console.log(data);

  return (
    <div className='mt-2 bg-white p-2 mx-2 rounded-lg border flex gap-2 pt-3'>
      {/* Bulanan */}
      <div className='font-bold w-full'>
        {/* Header */}
        <div className='flex w-full gap-2 justify-between'>
          <div className="flex gap-2">
            <div className='my-auto'>
              <FaRupiahSign/>
            </div>
            <div>
              Arus Kas
            </div>
          </div>
          <div className='text-slate-400'>{ dayjs(date.start).format('MMMM YYYY') }</div>
          
        </div>

        {/* Content */}
        <div className='mt-5'>
          <ResponsiveContainer width="100%" height={250}>
            {
              data && 
              <LineChart width={730} height={250} data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" 
                  style={{
                    fontSize: "10px"
                  }}
                />
                <YAxis 
                  tickFormatter={formatter}
                  format={formatter}
                  style={{
                    fontSize: "8px"
                  }}
                  
                />
                <Tooltip content={<CustomToolTip />}/>  
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#3770ed" 
                  tickFormatter={formatter}
                  style={{
                    fontSize: "8px"
                  }}
                  name='Saldo'
                  
                />
                <Line type="monotone" dataKey="debit" stroke="#82ca9d" 
                  tickFormatter={formatter}
                  style={{
                    fontSize: "8px"
                  }}
                  name='Kas Masuk'
                />
                <Line type="monotone" dataKey="credit" stroke="#dc2626" 
                  tickFormatter={formatter}
                  format={formatter}
                  style={{
                    fontSize: "8px"
                  }}
                  name='Kas Keluar'
                />
              </LineChart>
            }
            
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
