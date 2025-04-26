import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div >
 
      
      <Link to="/addtutorial">
        <button>Add Tutorial</button>
      </Link>

        {/*when button clicks redirect to the /addtutorial page  */}
        {/*App.jsx file give the root path as 'addtutorial'*/}
      <button onClick={() => window.location.href = '/addtutorial'}>Add Tutorial</button>
      <button onClick={() => window.location.href = '/alltutorial'}>All Tutorial</button>

    </div>
  )
}

export default Home;
