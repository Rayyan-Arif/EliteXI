import React from 'react'
import AdminNavbar from '../components/adminComponents/AdminNavbar'

const AdminDashboardLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <main className='w-full flex flex-col justify-center'>
            <div className="min-h-screen flex">
                <AdminNavbar />
                <div className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default AdminDashboardLayout