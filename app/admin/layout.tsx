import React from 'react'
import AdminNavbar from '../components/adminComponents/AdminNavbar'

const AdminDashboardLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <main className='w-full flex flex-col justify-center'>
            <div className="min-h-screen flex">
                <AdminNavbar />
                {children}
            </div>
        </main>
    )
}

export default AdminDashboardLayout