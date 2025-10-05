import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landslide from './pages/Landslide';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landslide />} />
      </Routes>
    </Router>
  )
}

export default App
