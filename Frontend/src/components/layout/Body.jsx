import React from 'react'

const Body = () => {
  return (
    <>
    <div className="wrapper py-10">
          <div className="box flex py-10 px-10">
            <div className='ele flex'>
              <div className='intro-text text-5xl text-center'>
                <p className='text-black text-center'>Streamline Your Coding</p>
              </div>

              <div className='mask'>
                <img className='inset-y-3' src="gaming.png" alt="" />
              </div>

            </div>
            <div className='ele flex'>
              <div className='mask'>
                <img className='inset-y-3 h-full ' src="interactinve.jpg" alt="" />
              </div>
              <div className='intro-text text-5xl text-center'>
                <p className='text-black text-center'>Interactive Education</p>
              </div>

            </div>
            <div className='ele flex'>
              <div className='mask'>
                <img className='inset-y-3 h-full' src="you.jpg" alt="" />
              </div>
              <div className='intro-text text-5xl text-center'>
                <p className='text-black text-center'>Rewarding Levels </p>
              </div>

            </div>
            <div className='ele flex '>
              <div className='intro-text text-5xl text-center'>
                <p className='text-black text-center'>MULTIPLAYER <br />PLAY WITH FRIENDS
                  <br />COMPETE <br />WIN AND <br />TOP THE TABLE</p>
              </div>

              <div className=''>
                <img className='inset-y-3 w-100' src="leaderboard.png" alt="" />
              </div>

            </div>
          </div>
        </div>
        <div className='wrapper1'>
          <h1 className='text-black text-8xl text-center py-10' style={{ lineHeight: "1.5" ,letterSpacing:"10px"}}>HOW DOES NEXUS <br />HELP ME</h1>
          <div className='box flex px-40 py-20'>
            <div className='contain w-200 flex'>
              <div className="use bg-black">
                <h1 className=' bodytext py-5 text-center text-4xl'>Personalized Learning Paths </h1>
                <p className='bodytext py-20 text-center text-2xl'>Each user
                  gets a guided journey based on their pace and strengths. Whether it’s coding, productivity, memory training, or any other skill, the platform adapts and provides customized challenges that fit their growth.
                </p>
              </div>
              <div className="use bg-black">
                <h1 className=' bodytext py-5 text-center text-4xl'>Personalized Learning Paths </h1>
                <p className='bodytext py-20 text-center text-2xl'>Each user
                  gets a guided journey based on their pace and strengths. Whether it’s coding, productivity, memory training, or any other skill, the platform adapts and provides customized challenges that fit their growth.
                </p>
              </div>
              <div className="use bg-black">
                <h1 className=' bodytext py-5 text-center text-4xl'>Personalized Learning Paths </h1>
                <p className='bodytext py-20 text-center text-2xl'>Each user
                  gets a guided journey based on their pace and strengths. Whether it’s coding, productivity, memory training, or any other skill, the platform adapts and provides customized challenges that fit their growth.
                </p>
              </div>


            </div>
          </div>

        </div>
    </>
  )
}

export default Body