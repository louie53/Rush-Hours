import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampusMap from './components/CampusMap';
import BuildingDetail from './pages/BuildingDetail';

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* Home Route: The Map */}
          <Route path="/" element={<CampusMap />} />
          
          {/* Detail Route: Building Study Rooms */}
          <Route path="/building/:buildingId" element={<BuildingDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
