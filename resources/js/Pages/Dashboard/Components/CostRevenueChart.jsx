import { AppContext } from '@/Layouts/AuthenticatedLayout';
import formatNumber from '@/Utils/formatNumber';
import dayjs from 'dayjs';
import React, { useContext } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatter = (value) => formatNumber(value);

const fullDate = (date) => {
  return dayjs(date.start).format('MMMM YYYY');
}

const CustomToolTip = (props) => {
  const { date } = useContext(AppContext);

  return (
    <div className='bg-white p-2 border border-slate-900 rounded-lg'>
     {
      props?.payload?.map((value, index) => <div className='text-xs' key={index}>
        <div>Tanggal : {value.payload.date} {fullDate(date)} </div>
        <div>Jumlah : IDR {formatNumber(value.value)}</div>
      </div>)
     }
    </div>
  )
}

const sumArray = (object) => {
  let temps = Object.entries(object);
  let total = 0;

  temps.map( temp => {
    total += Math.abs(parseInt(temp[1]))
  })

  return total;
}

const objectToArray = (object, type) => {
  let temps = Object.entries(object);
  let arrayTemp = [];

  temps.map((temp, index) => {
    arrayTemp[index] = {
      name: temp[0],
      value : Math.abs(parseInt(temp[1])),
    }
  })
  return arrayTemp.sort((a,b) => {
    return b.value - a.value
  });
}

export default function CostRevenueChart({logo, title, dataChart, type, data}) {
  console.log(data);
  return (
    <div className='mt-2 bg-white p-2 mx-2 rounded-lg border '>
      {/* title */}
      <div className='flex gap-2 text-lg font-bold justify-between'>
        <div className='flex gap-2'>
          <div className={`my-auto ${type == 'cost' && 'rotate-180'}`}>{ logo }</div>
          <div>{ title }</div>  
        </div>
        <div className='hidden sm:block'>
          { type == 'revenue' ? 'Pendapatan' : 'Pengeluaran'} Teratas
        </div>
                     
      </div>
      <div className='flex gap-3 flex-col sm:flex-row mt-5'>
        {/* visual */}
        <div className='sm:w-1/2 w-full'>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
                height={250}
                data={dataChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  style={{
                    fontSize: "10px"
                  }}
                />
                <YAxis 
                  dataKey={"value"} 
                  tickFormatter={formatter}
                  style={{
                    fontSize: "8px"
                  }}
                />
                <Tooltip content={<CustomToolTip />}/>
                <Bar dataKey="value" fill={type == 'revenue' ? '#3770ed' : '#dc2626'} />

              </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top */}
        <div className='sm:w-1/2 w-full pb-5'>
          <div className='sm:hidden font-bold'>
            { type == 'revenue' ? 'Pendapatan' : 'Pengeluaran'} Teratas
          </div>
          {
            data && 
            <div className='max-h-64 overflow-auto'>
              <table className='table'>
                <tbody>
                {
                  objectToArray(data, type).map((d, index) =>
                    <tr key={index}>
                      <td className='w-1/2'>{d.name}</td>
                      <td className='text-end'>
                        <div className='w-full space-x-1 text-xs flex my-auto'>
                          <progress className={`progress ${type == "revenue" ? "progress-info" : "progress-error"} w-56 my-auto`} value={(d.value/sumArray(data) * 100)} max={(sumArray(data)/sumArray(data) * 100)}></progress>
                          <span className='my-auto'> { Math.round(d.value/sumArray(data) * 100) }%</span>
                        </div>
                        <div className='text-xs flex justify-between'>
                          <div>
                            IDR {formatNumber(d.value)}
                          </div>
                        </div>
                      </td>
                    </tr>  
                  )
                }
                </tbody>
              </table>
            </div>
          }
          
        </div>
      </div>  
    </div>
  )
}
