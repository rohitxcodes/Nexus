import React from 'react'
import Nav from '../../components/layout/Nav'
import { FaArrowCircleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Landing = () => {
    return (

        <div

            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            >
                <source src="lv_0_20260206155330.mp4" type="video/mp4" />
            </video>
            <div

                style={{
                    color: "white",
                }}
            >
                <Nav />
                <div className='py-10'>
                    <div className='body pl-2 gap-20 '>

                        <div className='flex gap-50'>
                            <Link to="/login">
                                <div className='buttons flex items-center gap-10 ml-240 mt-55'
                                    style={{
                                        transform: "scale(0.8)", // 🔽 decrease size
                                        transformOrigin: "left center", // keeps position stable
                                    }}>
                                    <p className='text-center -tracking-tighter'>Get Started</p>
                                    <FaArrowCircleRight size={40} />
                                </div>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default Landing