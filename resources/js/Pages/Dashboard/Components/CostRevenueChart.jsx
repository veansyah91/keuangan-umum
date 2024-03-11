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

const CustomVertivalBar = ({x, y, fill, value}) => {
   	return <text 
               x={x} 
               y={y} 

               fontSize='12' 
               fontFamily='sans-serif'
               fill={fill}
               textAnchor="start">{value}</text>
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
  // console.log(data && objectToArray(data, type));
  return (
    <div className='mt-2 bg-white p-2 mx-2 rounded-lg border'>
      {/* title */}
      <div className='flex gap-2 text-lg font-bold'>
        <div className={`my-auto ${type == 'cost' && 'rotate-180'}`}>{ logo }</div>
        <div>{ title }</div>               
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

        {/* Top 10 */}
        <div className='sm:w-1/2 w-full'>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
                height={250}
                data={data && objectToArray(data, type)}
                layout={'vertical'}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
                barCategoryGap={1}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  hide type={'number'}
                />
                <YAxis type="category" width={150} padding={{ left: 20 }} dataKey="name"/>
                <Tooltip content={<CustomToolTip />}/>
                <Bar dataKey="value" height={10} fill={type == 'revenue' ? '#3770ed' : '#dc2626'} label={<CustomVertivalBar />}/>

              </BarChart>
          </ResponsiveContainer>
        </div>
      </div>  
    </div>
  )
}
