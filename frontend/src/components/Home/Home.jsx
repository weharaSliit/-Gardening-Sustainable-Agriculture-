import React from 'react'

const Home = () => {
  return (
    <div>
        <button onClick={()=>(window.location.href='/add-challenge')}>Add Challenge</button>
        <button onClick={()=>(window.location.href='/all-challenge')}>View Challenge</button>
        
        
      
    </div>
  )
}

export default Home
