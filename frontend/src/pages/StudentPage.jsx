import React from 'react'
import Timetable from './Timetable'

const StudentPage = ({initialData}) => {
  return (
    <div>
      <Timetable initialData={initialData} />
    </div>
  )
}

export default StudentPage