import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-container">
        <h1>Franklin Benchmark</h1>
        <p>Measure your abilities to compete against yourself and others</p>
        <div className="game-selection">
          <button className="game-button" onClick={() => navigate('/reaction-time')}>Reaction Time</button>
          <button className="game-button" onClick={() => navigate('/quick-math')}>Quick Math</button>
          <button className="game-button" onClick={() => navigate('/button-masher')}>Button Masher</button>
          {/* <button className="game-button">Speed Typing</button>
          <button className="game-button">Pitch Matcher</button> */}
        </div>
      </div>
    </>
  );
}

export default HomePage;