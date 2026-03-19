import { ArrowLeft, Users, PlusCircle, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

interface Session {
  _id: string;
  title: string;
  description: string;
  creatorName: string;
  capacity: number;
  participants: string[];
  status: 'active' | 'closed';
}

export default function BuildingDetail() {
  const { buildingId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', creatorName: '', capacity: 4 });

  // Temporary mapping for building names
  const buildingName = buildingId === 'library' ? 'General Library' : 
                       buildingId === 'science-bldg' ? 'Science Building' : 
                       'Unknown Building';

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/sessions/building/${buildingId}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [buildingId]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, buildingId }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', description: '', creatorName: '', capacity: 4 });
        fetchSessions(); // refetch list
      } else {
        alert('Failed to create session');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    const participantName = prompt('Enter your name to join:');
    if (!participantName) return;

    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantName }),
      });
      if (res.ok) {
        alert('Successfully joined!');
        fetchSessions();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              aria-label="Go back to map"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{buildingName}</h1>
              <p className="text-sm text-gray-500">Active Study Lobbies</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 relative">
        
        {/* Create Session Banner */}
        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 transform transition-transform hover:scale-[1.01]">
          <div>
            <h2 className="text-2xl font-bold mb-2">Looking for study buddies?</h2>
            <p className="text-indigo-100">Start a new session here and let others on campus join you.</p>
          </div>
          <button 
            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap"
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={20} />
            Start a Session
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Happening Now</h3>
          <span className="text-sm font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
            {sessions.length} Active Sessions
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No active sessions here right now. Be the first to start one!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => {
              const isFull = session.participants.length >= session.capacity || session.status === 'closed';
              return (
                <div key={session._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{session.title}</h4>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      {isFull ? 'FULL' : 'OPEN'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                    {session.description || 'No description provided.'}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1.5" title="Host">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {session.creatorName.charAt(0).toUpperCase()}
                        </div>
                        <span>{session.creatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{session.participants.length} / {session.capacity}</span>
                      </div>
                    </div>

                    <button 
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        isFull 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                      disabled={isFull}
                      onClick={() => handleJoinSession(session._id)}
                    >
                      {isFull ? 'Full' : 'Join'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Start a Study Session</h2>
            
            <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Session Title</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. COMP101 Exam Prep"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Alice"
                  value={formData.creatorName}
                  onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Max Capacity</label>
                <input 
                  type="number" required min="2" max="20"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 4})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="What are you studying? Do you need quiet or discussion?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="mt-4 w-full bg-indigo-600 text-white font-bold rounded-xl py-3 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Create Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
