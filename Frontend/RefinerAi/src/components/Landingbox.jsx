import React from 'react'
import Paranthesis_small from '../assets/Paranthesis_small.svg'
import Paranthesis_big from '../assets/Paranthesis_big.svg'
import Fragment from '../assets/Fragment.svg'

function Landingbox() {
  return (
    <div className="flex justify-center items-center h-screen relative">
      <img className="absolute left-0 ml-[10px] top-[10%]" src={Paranthesis_small} alt="" />
      <div className="flex justify-center items-center mb-[150px]">
        <div className=" px-[220px] bg-gradient-to-b from-[#000000] space-y-4 py-[60px] to-[#350957] p-4">
          <h2 className="text-white text-[2.8rem] font-semibold word-wider text-center">Your Refining Intelligence, <br /> One Code At a Time</h2>
          <p className='text-[#ffffffc2] font-extralight text-[1.2rem] word-wider text-center'>Reiner AI is a cutting-edge platform designed to enhance and optimize <br /> code through artificial intelligence. Perfect for developers and teams <br /> looking to streamline their coding process.</p>
          <div className='flex mt-[40px] justify-center space-x-[25px]'>
            <buttton className='border-[0.5px] font-extralight text-[1.1rem] text-white p-[3px] px-3 rounded-3xl border-white'>Get a Demo</buttton>
            <buttton className='bg-white font-extralight text-[1.1rem] text-black p-[3px] px-3 rounded-3xl'>Start Refining</buttton>
          </div>
          <div className='flex justify-center'>
            <img  src={Fragment} alt="" />      
          </div>

        </div>

      </div>

      <img className="absolute right-0 bottom-[10%]" src={Paranthesis_big} alt="" />
    </div>
  )
}

export default Landingbox
