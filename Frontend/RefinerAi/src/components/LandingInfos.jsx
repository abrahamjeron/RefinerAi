import React from 'react'
import Left_Fragement from "../assets/Left_Fragement.svg"
import Right_Fragment from '../assets/Right_Fragment.svg'
import Wrench from '../assets/Wrench.svg'
import SourceCode from '../assets/SourceCode.svg'
import ChatGPT from '../assets/ChatGPT.svg'
import Rocket from '../assets/Rocket.svg'

function LandingInfos() {
  return (
    <div className='relative bottom-[120px] right-[20px] min-h-screen min-w-screen bg-gradient-to-b from-[#000000] to-[#370f578d]'>
        <h1 className='text-white text-center text-[1.7rem] font-semibold'>With RefinerAI, you can</h1>
        <img className='-ml-[20px] relative bottom-[70px]' src={Left_Fragement} alt="" />
        <div className='flex justify-center items-center relative bottom-[260px]'>
            <div className='space-y-[100px]'>
                <div className='bg-[#53A1FF] text-[1.5rem] font-semibold p-[50px] rounded-3xl'>
                    <img className='relative bottom-[20px]' src={Wrench} alt="" />
                    <h1 className='text-white mt-[10px]'>Optimize Code, <br /> Elevate Efficiency</h1>
                </div>


                <div className='bg-[#802FFF] text-[1.5rem] font-semibold p-[50px] rounded-3xl'>
                    <img className='relative bottom-[20px]' src={SourceCode} alt="" />
                    <h1 className='text-white mt-[10px]'>Code Smarter, <br /> Achieve More</h1>
                </div>
            </div>
            <div className='space-y-[100px] ml-[120px] mt-[150px]'>
                <div className='bg-[#802FFF] text-[1.5rem] font-semibold p-[50px] rounded-3xl'>
                    <img className='relative bottom-[20px]' src={ChatGPT} alt="" />
                    <h1 className='text-white mt-[10px]'>AI-Driven Code <br /> Perfection</h1>
                </div>

                <div className='bg-[#53A1FF] text-[1.5rem] font-semibold p-[50px] px-[60px] rounded-3xl'>
                    <img className='relative bottom-[20px]' src={Rocket} alt="" />
                    <h1 className='text-white mt-[10px]'>Boost Code, <br /> Beat Deadlines</h1>
                </div>
            </div>

        </div>
        <img className='absolute -right-[70px]  bottom-[120px]' src={Right_Fragment} alt="" />
    </div>
  )
}

export default LandingInfos