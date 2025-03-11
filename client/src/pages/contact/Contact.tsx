import { FaFacebook, FaInstagram, FaPaperPlane, FaPhone } from 'react-icons/fa'

export default function Contact() {
  return (
    <div className='min-h-screen py-10'>
      <div className='max-w-4xl mx-auto p-6 rounded-sm  shadow-2xl'>
        <h1 className='text-3xl font-bold text-center mb-8'>Contact Me</h1>
        <div className='w-40 h-33 mx-auto'>
          <img src='/admin_image.jpg' alt='Workflow' className='rounded-full' />
        </div>
        <div className='mt-15'>
          <div className='space-y-4'>
            <p className='text-gray-700 flex space-x-2'>
              <FaPaperPlane className='mr-2' /> <strong>Email:</strong>
              <i>dtq0512@gmail.com</i>
            </p>
            <p className='text-gray-700 flex space-x-2'>
              <FaPhone className='mr-2' />
              <strong>Phone:</strong> <i>0904136018</i>
            </p>
            <p className='text-gray-700 flex space-x-2'>
              <FaFacebook className='mr-2' />
              <strong>Facebook:</strong>{' '}
              <a href='https://www.facebook.com/dat.trang.02/' className='hover:text-blue-500'>
                <i>dat.trang.02</i>
              </a>
            </p>
            <p className='text-gray-700 flex space-x-2'>
              <FaInstagram className='mr-2' />
              <strong>Instagram:</strong>{' '}
              <a href='https://www.instagram.com/dattrang__/' className='hover:text-blue-500'>
                <i>dattrang__</i>
              </a>
            </p>
          </div>
          <div>
            <p className='text-sm text-red-600 mt-6 text-center'>
              If you have business inquiries or other questions, please call me following form to contact me. Thank you
              !.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
