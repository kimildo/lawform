import React from 'react'
import dynamic from 'next/dynamic'

const PaymentMobile = dynamic(() => import('components/payment/paymentmobile'), { ssr: false })

const Payment = () => {
    return (
        <div>
            <PaymentMobile/>
        </div>
    )
}

export default Payment