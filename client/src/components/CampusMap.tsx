import { BookOpen, MapPin, PlusCircle, X } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

// Using the same coordinates we used in the backend seeder
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [174.7600, -36.8580], // Southwest
  [174.7750, -36.8460], // Northeast (slightly wider to allow smooth panning at high zoom)
];

const INITIAL_VIEW_STATE = {
  longitude: 174.7685,
  latitude: -36.8520,
  zoom: 17, // Start closer
  pitch: 45,
  bearing: -17.6,
};

// Accurate coordinates for University of Auckland (UoA)
const BUILDINGS = [
  {
    id: 'science-bldg',
    name: 'Science Building',
    longitude: 174.768460,
    latitude: -36.853192,
    classrooms: 32,
    color: '#3b82f6',
  },
  {
    id: 'library',
    name: 'Library',
    longitude: 174.769328,
    latitude: -36.851185,
    classrooms: 15,
    color: '#ef4444',
  },
];

export default function CampusMap() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creatorName: '',
    capacity: 4,
    buildingId: 'library' // Default selected building
  });

  // Note: We'll use import.meta.env for Vite environment variables
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100">
        <p className="text-xl text-red-500 font-bold">Error: VITE_MAPBOX_TOKEN is missing from .env</p>
      </div>
    );
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        // Navigate straight into the building lobby they just created the session for!
        navigate(`/building/${formData.buildingId}`);
      } else {
        alert('Failed to create session');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header UI Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white',
          padding: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin color="#f97316" />
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Rush Hours - Campus Map</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>📍 Select a building to view study rooms</span>
        </div>
      </div>

      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/louie170/cmmuafbot00be01sk1gvz0cml" // <--- Your custom cartoon style!
        maxBounds={CAMPUS_BOUNDS} // Re-enabled constraints
        style={{ width: '100%', height: '100%' }}
        minZoom={16.5} // Re-enabled constraints
        maxZoom={19}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showUserHeading={true}
          onGeolocate={(e) => {
            // Track the user's location to show our custom label
            setUserLocation({
              lat: e.coords.latitude,
              lng: e.coords.longitude,
            });
          }}
        />

        {/* 📍 'You are here' Label */}
        {userLocation && (
          <Marker 
            longitude={userLocation.lng} 
            latitude={userLocation.lat} 
            anchor="bottom"
            offset={[0, -25]} // Push it above the blue dot
          >
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
              border: '2px solid white'
            }}>
              👋 You are here
            </div>
          </Marker>
        )}
        
        {/* Render Buildings as Custom HTML Markers */}
        {BUILDINGS.map((bldg) => (
          <Marker
            key={bldg.id}
            longitude={bldg.longitude}
            latitude={bldg.latitude}
            anchor="bottom"
            onClick={(e: { originalEvent: { stopPropagation: () => void } }) => {
              e.originalEvent.stopPropagation();
              setSelectedBuilding(bldg.id);
            }}
          >
            {/* The cartoon-style marker UI overlay */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: selectedBuilding === bldg.id ? 'scale(1.1)' : 'scale(1)',
                fontFamily: 'sans-serif'
              }}
            >
              {/* Information Bubble */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  marginBottom: '8px',
                  border: `2px solid ${bldg.color}`,
                  textAlign: 'center',
                  minWidth: '120px'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                  {bldg.name}
                </div>
                <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <BookOpen size={12} /> {bldg.classrooms} Classrooms
                </div>
                {selectedBuilding === bldg.id && (
                  <button
                    style={{
                      marginTop: '8px',
                      backgroundColor: bldg.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/building/${bldg.id}`);
                    }}
                  >
                    ENTER [SELECT]
                  </button>
                )}
              </div>

              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: bldg.color,
                  borderRadius: '12px',
                  border: '3px solid white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transform: selectedBuilding === bldg.id ? 'scale(1.15) translateY(-5px)' : 'scale(1) translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              >
                {bldg.id === 'library' ? <BookOpen size={28} /> : <MapPin size={28} />}
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      {/* Global Floating Action Button for Creating Sessions */}
      <div 
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all outline-none"
        >
          <PlusCircle size={24} />
          <span className="text-lg">Start a Session</span>
        </button>
      </div>

      {/* Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PlusCircle className="text-indigo-600" /> Start a Session
            </h2>
            
            <form onSubmit={handleCreateSession} className="flex flex-col gap-5">
              
              {/* Building Selection Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Building</label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                  value={formData.buildingId}
                  onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
                >
                  {BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Session Title</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g. COMP101 Exam Prep"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" required
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="e.g. Alice"
                    value={formData.creatorName}
                    onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Max Capacity</label>
                  <input 
                    type="number" required min="2" max="20"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 4})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                  placeholder="What are you studying? Do you need quiet or discussion?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="mt-2 w-full bg-indigo-600 text-white font-bold text-lg rounded-xl py-4 hover:bg-indigo-700 transition-colors shadow-md transform active:scale-95"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
