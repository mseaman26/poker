'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const NotFound = () => {
    const router = useRouter()
    router.replace('/')
    return (
        <div>NotFound</div>
    )
}

export default NotFound