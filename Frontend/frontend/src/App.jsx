import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Pocetna from "./components/Pocetna";
import PregledInstruktora from "./components/PregledInstruktora";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <PregledInstruktora onLogout={() => setIsLoggedIn(false)} />
  ) : (
    <Pocetna onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;