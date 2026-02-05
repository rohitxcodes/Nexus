import React from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import "../index.css"
import { FaArrowCircleRight } from "react-icons/fa";
import Nav from './Nav';
import Body from './Body';
import { Link } from 'react-router-dom';

const Train = () => {
    return (<>
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
                <source src="Pixel Winter Landscape, Snowy Mountains, Retro Pixel Art, Peaceful Winter Forest.mp4" type="video/mp4" />
            </video>
            <div
                style={{
                    color: "white",
                }}
            >
                <Nav />
            </div>
            <div className=' pt-25'>
                <div className='train p-10 flex pb-39 pt-20'>
                    <h1 className='text-5xl tracking-widest'>Training Starts</h1>
                    <p className='text-2xl text-center'>Ready to level up? Solve interactive challenges, compete with friends, and build real skills through fun, game-powered learning.</p>
                    <div className='buttons flex items-center gap-5 tracking-wider '>
                        <Link to="/train/play"><p className='text-center' style={{ cursor: "pointer" }}> Skip overview</p>
                        </Link>
                        <FaArrowCircleRight size={40} />
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='overview  flex pb-39 pt-20 '>
                    <h1 className='text-5xl tracking-widest text-left px-10'> Overview</h1>
                    <p className='text-2xl tracking-widest px-10'>Solve questions alloted to you acc to your level</p>
                    <img src="image.png" className='w-250 px-10' alt="" />
                    <p className='text-2xl tracking-widest px-10'>These are coins,earn it by solving various questions and also completing missions and quests</p>
                    <div className='flex'>
                        <img src="gold.png" className='h-50 px-10' alt="" />
                        <div className='flex flex-col gap-10 px-10'>
                            <p className='text-2xl'>+3 coins for every correct question and -1 for every time you give up </p>
                            <p className='text-2xl'>You can also earn coins by completing various missions and quest </p>
                        </div>
                    </div>
                    <h1 className='text-6xl p-10'>Use of shop</h1>
                    <div className='flex gap-20'>
                        <img className="w-100 " src="pngegg.png" alt="" />
                        <div>
                            <p className='text-2xl pt-20'>Use your coins to buy power ups and various other boosters which will help you to top the leaderboards</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    </>
    )
}

export default Train