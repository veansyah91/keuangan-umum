import SecondaryButton from '@/Components/SecondaryButton'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'
import dayjs from 'dayjs'
import React from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdOutlineCancel } from 'react-icons/md'

const levelArr = () => {
  let levelArr = [];

  for (let index = 1; index < 13; index++) {
      levelArr = [
          ...levelArr, index
      ];
  }

  return levelArr;
}

const yearList = () => {
  const now = dayjs().year();

  const start = now - 10;

  let arrayYear = [];

  for (let index = start; index < now + 2; index++) {
      arrayYear = [
          ...arrayYear, index
      ];
  }
  return arrayYear;
}

export default function EditLevelStudent({ level, cancelEdit, organizationId }) {  
  const { data, setData, errors, patch } = useForm({
    'year': level.year,
    'level': level.level,
    'contact_id': level.contact_id
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    patch(route('data-master.student-level.update', {organization: organizationId, level: level.id}), {
      onSuccess: ({ props }) => {
        const { flash } = props;
        cancelEdit()
        
      },
      onError: errors => {
        console.log(errors);
      }, 
      preserveScroll: false
    })
    
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col sm:flex-row justify-between gap-1'>
        <div className='w-2/5'>
          <select className="select select-bordered w-full" value={data.year} onChange={e => setData('year', parseInt(e.target.value))} id='year'>
            {
              yearList().map(year => 
                <option 
                  key={year} 
                >{year}/{year + 1}</option>
              )
            }
          </select>
        </div>
        <div className='w-2/5'>
          <select className="select select-bordered w-full" value={data.level} onChange={e => setData('level', parseInt(e.target.value))} id='level'>
            {
              levelArr().map(level => 
                <option 
                  key={level} 
                >{level}</option>
              )
            }
          </select>
        </div>
        <div className='w-1/5 my-auto space-x-2'>
          <button type='submit'>
            <FaRegCheckCircle color='green'/>
          </button>
          <button onClick={cancelEdit} type='button'>
            <MdOutlineCancel color='red'/>
          </button>
        </div>
      </div>
    </form>
  )
}
