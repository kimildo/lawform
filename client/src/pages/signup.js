import React from 'react'
import dynamic from 'next/dynamic'
import User from '../utils/user'
import { useRouter } from 'next/router'

const Header = dynamic(() => import('../components/common/header'), { ssr: false })
const SignupMain = dynamic(() => import('../components/auth/signupMain'), { ssr: false })
const Footer = dynamic(() => import('../components/common/footer'), { ssr: false })
// const User = dynamic(() => import("../utils/user"),{ssr:false})

const Signup = () => {
    if (process.browser) {
        window.location.href = '/auth/signup'
    }

    return null
}

export default Signup