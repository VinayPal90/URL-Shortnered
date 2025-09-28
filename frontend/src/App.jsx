import React from 'react'
import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [originalUrl,setOriginalUrl]=useState('')
  const [shortUrl,setShortUrl]=useState('')
  const [clicks, setClicks] = useState(0)

  const url = "https://backend-url-shortnered.onrender.com";

  const handleSubmit=()=>{
    //console.log(originalUrl)
    // backend me originalUrl bhejne k liye aur response lene k liye..

    axios.post(`${url}/api/short`,{originalUrl})
    .then((res)=>{
      setShortUrl(res.data)
 //res.data.url.shortUrl, 
      console.log("API response", res.data)
    })
    .catch((err)=>console.log(err))
  }


  return (

    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-lg w-full'>
        <h1 className='text-3xl font-bold text-center mb-6 text-blue-600'>URL Shortner</h1>
        <div onSubmit={handleSubmit} className='flex flex-col space-y-4'>
          <input type="text" 
          name="" id=""
          placeholder='Enter Url'
          onChange={(e)=>setOriginalUrl(e.target.value)}
          value={originalUrl}
          required
          className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black' 
          />

            <button onClick={handleSubmit} type="submit" className='bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700'>Shorten</button>

          {/* shortUrl : {shortUrl} */}

          {
            shortUrl && (
              <div className='mt-6 text-center flex items-center justify-center flex-col'>
                <p className='text-lg font-medium'>Shortedned URL</p>
                <a href={shortUrl?.shortUrl} //`http://localhost:3000/${shortUrl}`
                rel="noopener noreferrer"
                className='text-blue-500 underline mt-2'
                target='blank'
                >
                  {shortUrl?.shortUrl}
                </a>
                {shortUrl && <img src={shortUrl.qrCodeImg} alt="Generated QR Code" /> }
              </div>

            )
          }

        </div>

      </div>
    </div>

    // <div>
    //   <input type="text" name="originalUrl" id="" onChange={(e)=>setOriginalUrl(e.target.value)} value={originalUrl} />
    //   <button onClick={handleSubmit} className='bg-blue-600'>Shorten</button>
    // </div>
  )
}

export default App
