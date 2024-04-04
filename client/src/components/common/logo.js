import React from 'react';
import Link from 'next/link';

const Logo = (props) => {
    const src = props.theme==='dark'?"/images/common/logo-dark.svg":"/images/common/logo.svg"
    return (
        <div className="logo">
            <Link href="/"><a><img src={src} /></a></Link>
        </div>
    );
};

export default Logo;