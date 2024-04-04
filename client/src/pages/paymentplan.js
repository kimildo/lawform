import React from 'react';
import dynamic from 'next/dynamic';

const PaymentMobile = dynamic(() => import('../components/payment/paymentmobileplan'),{ssr:false})

const Payment = () => {
    return (
        <div>
            <PaymentMobile></PaymentMobile>
        </div>
    );
};

export default Payment;