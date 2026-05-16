import api from '@/app/lib/axios';
import React, { useEffect, useState } from 'react'

function page() {

    const [notification,setNotifications]=useState([]);
useEffect(() => {
    const fetchNotifications = async () => {
      try {
    
        const res = await api.get(`api/admin/cart-notifications`);
        setNotifications(res.data);
        console.log("notification",notification)
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    
    fetchNotifications();
  }, []);
  
  return (
    <div>
      recent order 

    </div>
  )
}

export default page
