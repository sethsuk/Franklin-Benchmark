import { useNavigate } from 'react-router-dom';
import './HomePage.css';

import { ReactComponent as QuickMathIcon } from './QuickMathIcon.svg';
import { ReactComponent as ButtonMasherIcon } from './ButtonMasherIcon.svg';
import { ReactComponent as ReactionTimeIcon } from './ReactionTimeIcon.svg';
import { ReactComponent as PennBenchmarkIcon } from './PennBenchmarkIcon.svg'

import Header from '../../components/Header/Header';
import UsernameForm from '../../components/UsernameForm/UsernameForm';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-root">
      <div className="header-row">
        <div className="header-left">
          <div className="hamburger">&#9776;</div>
          <PennBenchmarkIcon className="svg-PennBenchmark" />
          <span className="brand-name">Franklin Benchmark</span>
        </div>
        <Header userData={userData} setUserData={setUserData} />
      </div>

      <div className="top-banner">
        <h2>Measure your abilities to compete against other students at Penn!</h2>
        <p>Click on one of the three minigames below</p>
      </div>

      <div className="home-container">
        <div className="game-selection">
          <div className="game-card">
            <div className="card-top reaction-time">
              <ReactionTimeIcon className="svg-icon" />
              <div className="game-label">Reaction Time</div>
            </div>
            <div className="card-bottom">
              <button className="play-btn" onClick={() => navigate('/reaction-time')}>Play</button>
            </div>
          </div>

          <div className="game-card">
            <div className="card-top quick-math">
              <QuickMathIcon className="svg-icon" />
              <div className="game-label">Quick Math</div>
            </div>
            <div className="card-bottom">
              <button className="play-btn" onClick={() => navigate('/quick-math')}>Play</button>
            </div>
          </div>

          <div className="game-card">
            <div className="card-top button-masher">
              <ButtonMasherIcon className="svg-icon" />
              <div className="game-label">Button Masher</div>
            </div>
            <div className="card-bottom">
              <button className="play-btn" onClick={() => navigate('/button-masher')}>Play</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;