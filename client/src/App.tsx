import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampusMap from './components/CampusMap';
import BuildingDetail from './pages/BuildingDetail';

function App() {
  return (
    <Router>
      <div className="m-0 p-0 w-screen h-screen overflow-hidden">
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
