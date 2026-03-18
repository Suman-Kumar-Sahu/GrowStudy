import React from 'react'
import Header from '../componets/Header'
import Footer from '../componets/Footer'

const Layout = ({children}) => {
  return (
    <div>  
        <Header/>
        <main className='min-h-screen bg-gray-50'>{children}</main>
        <Footer/>
    </div>
  )
}

export default Layout