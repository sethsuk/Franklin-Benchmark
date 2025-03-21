import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

// import googleOneTap from 'google-one-tap';

// const options = {
//   clientId: process.env.CLIENT_ID,
//   autoSelect: false,
//   cancelOnTapOutside: false,
//   cotnext: 'signin'
// };

function HomePage() {
//   const[loginData, setLoginData] = useState(
//     localStorage.getItem('loginData')
//     ? JSON.parse(localStorage.getItem('loginData'))
//     : null
//   );

//   useEffect(() => {
//     if (!loginData) {
//       googleOneTap(options, async (response) => {
//         console.log(response);
//         const res = await fetch('/api/google-login', {
//           method: "POST",
//           body: JSON.stringify({
//             token: response.credential,
//           }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await res.json();
//         setLoginData(data);
//         localStorage.setItem("loginData", JSON.stringify(data));
//       });
//     }
//   }, [loginData]);

  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Franklin Benchmark</h1>
      <p>Measure your abilities to compete against yourself and others</p>
      <div className="game-selection">
        <button className="game-button" onClick={() => navigate('/reaction-time')}>Reaction Time</button>
        <button className="game-button">Quick Math</button>
        <button className="game-button">Speed Typing</button>
        <button className="game-button">Word Guesser</button>
        <button className="game-button">Pitch Matcher</button>
      </div>
    </div>
  );
}

export default HomePage;