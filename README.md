# Franklin Benchmark

Franklin Benchmark is a React-based web application featuring a suite of mini-games designed to measure and compare user performance in reaction time, button mashing, and quick math. Built with modern authentication flows, seamless user onboarding, and real-time leaderboards, Franklin Benchmark offers a playful yet robust environment to challenge yourself and compete with others.

## Features

* **Google OAuth2 Authentication**: Users can sign in with Google, pick a unique username, and have their session persisted via JWT.
* **Onboarding Flow**: First-time users are prompted in a modal to choose a username, which is sent to the server and stored in their profile.
* **Three Mini-Games**:

  * **Reaction Time**: Measure how quickly you can click once the box turns green.
  * **Button Masher**: Mash the button as many times as possible within a set duration.
  * **Quick Math**: Solve as many random arithmetic problems as you can before time runs out.
* **Real-Time Leaderboards**: Scores are recorded via secure API calls, and leaderboards refresh automatically after each submission.
* **Responsive UI**: Styled with Montserrat font, soft color palette, and consistent component design for a seamless user experience.

## Getting Started

These instructions will help you clone, install dependencies, and run Franklin Benchmark locally.

### Prerequisites

* Node.js (>= 16.x)
* npm or yarn
* A Google OAuth Client ID
* Backend API running at `http://localhost:5000`

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/franklin-benchmark.git
   cd franklin-benchmark
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root with the following:

   ```ini
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server**:

   ```bash
   npm start
   # or
   yarn start
   ```

   The app will be available at `http://localhost:3000`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Happy benchmarking!*
