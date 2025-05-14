import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
const BookingPage = () => {
    const [doctors, setDoctors] = useState([]);
    const params = useParams();
    const [date, setDate] = useState(null);
    const [timings, setTimings] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    
      const getUserData =async ()=>{
        try {
          const res = await axios.post('/api/v1/doctor/getDoctorById',{doctorId :params.doctorId},  {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (res.data.success) {
            setDoctors(res.data.data);
          } 
        } catch (error) {
          console.log(error);
        }
      }
    
   useEffect(() => {
     getUserData();
   }, []) 
  return (
    <Layout>
        <h3 className='text-center mt-5' style={{color:"#061e54", fontWeight:"bold", textShadow:"0 0 1px gray"}}>Book your Appointement</h3>
        <div className='container mt-5 '>
            <h3 style={{color:"#061e54", fontWeight:"bold", textShadow:"0 0 1px gray"}}>Doctor Details</h3>
            {doctors && (
                <div>
                  <h5 style={{color:"#061e54", fontWeight:"light", textShadow:"0 0 1px gray"}}>Dr. {doctors.firstName} {doctors.lastName}</h5>
                  <h6>Specialization : {doctors.specialization}</h6>
                  <h6>Fees : {doctors.feesPerConsultation} da</h6>
              <h6 style={{color:"#061e54"}}>
  Timings : {doctors?.timings?.[0]} - {doctors?.timings?.[1]}
</h6>
                <div className='d-flex flex-column '>
                    <DatePicker format={"DD-MM-YYYY"} onChange={(value)=>{ setDate(moment(value).format("DD-MM-YYYY"))}} className='mt-2'/>
                    <TimePicker.RangePicker className='mt-2' format={"HH:mm"}  onChange={(value)=>{ setTimings([moment(value[0]).format("HH:mm"),moment(value[1]).format("HH:mm")])}} />
                    <button className='btn btn-primary mt-2'> Check availability</button>

                </div>
                </div>
            )}
        </div>
    </Layout>
  )
}

export default BookingPage