import React from 'react'

import { Link } from 'react-router-dom';
const Nav = () => {

    return (
        <>
            <nav>
                <div className='nav flex gap-50'>
                    <div className='logo py-5'>
                        <Link to="/"><img className="h-20" src="/logo.png" alt="" /></Link>
                    </div>
                    <div className='nav-buttons flex gap-10 py-10 px-10'>
                        <Link to="/train"><p  style={{ cursor: "pointer" }}>Train</p></Link>
                        <Link to="/train"><p  style={{ cursor: "pointer" }}>Practice</p></Link>
                        <Link to="/train"><p  style={{ cursor: "pointer" }}>About</p></Link>
                        <Link to="/train"><p  style={{ cursor: "pointer" }}>Shop</p></Link>
                    </div>
                </div>

            </nav></>
    )
}

export default Nav