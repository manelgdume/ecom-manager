'use client'
import { useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react';

import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'


function DashboardPage() {
    const { data: session, status } = useSession();

    console.log(session, status)
   
    return (<>
        <div className=' min-h-screen flex'>
        <Navbar></Navbar>
        <div>
            Dashboard
        </div>
        </div>
        
    </>

    )

}
export default DashboardPage