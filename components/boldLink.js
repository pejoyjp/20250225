import Link from 'next/link';
import React from 'react';

function BoldLink({ children, href = '/' }) {
  return (
    <Link className='font-bold text-lg' href={href}>
      {children}
    </Link>
  );
}

export default BoldLink;