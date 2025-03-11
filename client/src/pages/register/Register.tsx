import React from 'react'
import Input from '../../components/input'
import Button from '../../components/Button'

export default function Register() {
  const year = new Date().getFullYear()
  return (
    <div className='min-h-screen flex items-center justify-center bg-white min-w-[375px] '>
      <div className='bg-white px-8 pb-8 rounded-lg w-full max-w-md'>
        <div className='w-40 h-33 mx-auto'>
          <img src='/public/logo.png' alt='Workflow' />
        </div>
        <h1 className='text-2xl font-bold mb-6 text-center'>Sign Up</h1>
        <form>
          <div className='mb-1'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <Input name='email' type='email' id='email' placeholder='Enter your email' errorMessage='' />
          </div>
          <div className='mb-1'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <Input name='password' type='password' id='password' placeholder='Enter your password' errorMessage='' />
          </div>
          <div className='mb-4'>
            <label htmlFor='confirm_password' className='block text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <Input
              name='confirm_password'
              type='password'
              id='confirm_password'
              placeholder='Enter confirm your password'
              errorMessage=''
            />
            <div className='pr-1'>
              <p className='text-sm text-gray-600 text-right'>
                Have an account please!{' '}
                <a href='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
                  Sign In
                </a>
              </p>
            </div>
          </div>
          <Button className='w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            Sign up
          </Button>
        </form>
        {/* <div className='relative flex items-center my-6'>
          <div className='flex-grow border-t border-gray-300'></div>
          <span className='flex-shrink mx-4 text-gray-500'>or</span>
          <div className='flex-grow border-t border-gray-300'></div>
        </div>
        <button className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4'>
          <img src='https://www.google.com/favicon.ico' alt='Google' className='w-4 h-4 mr-2' />
          Sign up with Google
        </button> */}
        {/* <button className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4'>
              Sign in with Single Sign On
            </button> */}
        <p className='mt-6 text-center text-sm text-gray-600'>© {year} Dat Trang. All Rights Reserved.</p>
      </div>
    </div>
  )
}
