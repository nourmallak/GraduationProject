import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import SideBarSubAdmin from '../../../pages/SubAdmin/SideBarSubAdmin/SideBarSubAdmin';

export default function DashBoardSubAdmin() {
 const [isOpen, setIsOpen] = useState(true);
   const location = useLocation(); // للحصول على المسار الحالي
 
   // تغيير حالة الـ Sidebar عند النقر على الأيقونة
   const toggleSidebar = () => setIsOpen(!isOpen);
 
   // تحديث موضع التمرير إلى الأعلى عند تغيير المسار
   useEffect(() => {
     window.scrollTo(0, 0);
   }, [location]);
 
   return (
     <div>
       {/* تمرير الدالة toggleSidebar ل SideBar */}
       <SideBarSubAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />
 
       {/* عرض المحتوى بناءً على حالة الـ Sidebar */}
       <div
         className="content-container"
         style={{
           marginLeft: isOpen ? '250px' : '85px', 
           paddingTop: '20px',
           paddingLeft: '20px',
           transition: 'margin-left 0.3s ease',
         }}
       >
         <Outlet />
       </div>
     </div>)
}
