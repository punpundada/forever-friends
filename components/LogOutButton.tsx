"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/actions/authActions'
import { DropdownMenuItem } from './ui/dropdown-menu'

const LogOutButton = () => {
    const router = useRouter();
    const handleLogout = ()=>{
        logout()
        router.prefetch('')
        router.refresh()
    }
  return (
    <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>Logout</DropdownMenuItem>
  )
}

export default LogOutButton