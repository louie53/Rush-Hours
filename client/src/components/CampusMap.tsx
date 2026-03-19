import { BookOpen, MapPin, PlusCircle, X } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';
import { useCreateSession } from '../hooks/useCreateSession';

// Using the same coordinates we used in the backend seeder
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [174.7600, -36.8580], // Southwest
  [174.7750, -36.8460], // Northeast
];

const INITIAL_VIEW_STATE = {
  longitude: 174.7685,
  latitude: -36.8520,
  zoom: 17,
  pitch: 45,
  bearing: -17.6,
};

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
  const { createSession } = useCreateSession();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creatorName: '',
    capacity: 4,
    buildingId: 'library' // Default selected building
  });

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
      await createSession({
        ...formData,
        buildingIdentifier: formData.buildingId
      });
      setShowModal(false);
      navigate(`/building/${formData.buildingId}`);
    } catch (err) {
      alert('Failed to create session');
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 right-0 z-10 bg-white p-4 shadow-md flex justify-between items-center font-sans border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-500" />
          <h1 className="m-0 text-xl font-bold italic tracking-tight text-gray-800">Rush Hours - Campus Map</h1>
        </div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">📍 Select a building to view study rooms</span>
        </div>
      </div>

      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/louie170/cmmuafbot00be01sk1gvz0cml"
        maxBounds={CAMPUS_BOUNDS}
        style={{ width: '100%', height: '100%' }}
        minZoom={16.5}
        maxZoom={19}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showUserHeading={true}
          onGeolocate={(e) => {
            setUserLocation({
              lat: e.coords.latitude,
              lng: e.coords.longitude,
            });
          }}
        />

        {userLocation && (
          <Marker 
            longitude={userLocation.lng} 
            latitude={userLocation.lat} 
            anchor="bottom"
            offset={[0, -25]}
          >
            <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white animate-bounce">
              👋 You are here
            </div>
          </Marker>
        )}
        
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
            <div className={`flex flex-col items-center cursor-pointer transition-transform duration-200 font-sans ${
              selectedBuilding === bldg.id ? 'scale-110' : 'scale-100'
            }`}>
              <div
                className="bg-white p-2 rounded-xl shadow-xl mb-2 text-center min-w-[140px] border-b-4"
                style={{ borderColor: bldg.color }}
              >
                <div className="font-bold text-sm mb-1 text-gray-900">{bldg.name}</div>
                <div className="text-[10px] text-gray-500 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider">
                  <BookOpen size={10} /> {bldg.classrooms} Classrooms
                </div>
                {selectedBuilding === bldg.id && (
                  <button
                    className="mt-2 w-full text-white rounded-lg py-1.5 font-bold text-[10px] cursor-pointer"
                    style={{ backgroundColor: bldg.color }}
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
                className="w-[50px] h-[50px] rounded-2xl border-[3px] border-white shadow-2xl flex items-center justify-center text-white"
                style={{ 
                  backgroundColor: bldg.color,
                  transform: selectedBuilding === bldg.id ? 'translateY(-8px)' : 'none'
                }}
              >
                {bldg.id === 'library' ? <BookOpen size={24} /> : <MapPin size={24} />}
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <PlusCircle size={28} />
          <span>Start a Session</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-premium w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <PlusCircle className="text-brand w-8 h-8" /> 
              <span className="italic">Go Live!</span>
            </h2>
            
            <form onSubmit={handleCreateSession} className="flex flex-col gap-6">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Location</label>
                <select
                  required
                  className="w-full border-2 border-border-subtle bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand transition-all font-bold text-gray-800"
                  value={formData.buildingId}
                  onChange={(e) => setFormData({...formData, buildingId: e.target.value})}
                >
                  {BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Session Title</label>
                <input 
                  type="text" required
                  className="w-full border-2 border-border-subtle bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand transition-all font-bold text-gray-900"
                  placeholder="e.g. COMP101 Exam Prep"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Alias</label>
                  <input 
                    type="text" required
                    className="w-full border-2 border-border-subtle bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand transition-all font-bold text-gray-900"
                    placeholder="e.g. Alice"
                    value={formData.creatorName}
                    onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Limit</label>
                  <input 
                    type="number" required min="2" max="20"
                    className="w-full border-2 border-border-subtle bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand transition-all font-bold text-gray-900"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 4})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                <textarea 
                  rows={2}
                  className="w-full border-2 border-border-subtle bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand transition-all font-bold text-gray-900 resize-none"
                  placeholder="What's the study vibe?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="mt-2 w-full bg-brand text-white font-black text-xl italic rounded-2xl py-5 hover:bg-brand-hover transition-all"
              >
                CREATE LOBBY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
