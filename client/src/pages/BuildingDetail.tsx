import { ArrowLeft, Users, PlusCircle, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSessions } from '../hooks/useSessions';
import { useCreateSession } from '../hooks/useCreateSession';

export default function BuildingDetail() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  // Custom Hooks for Data Flow
  const { sessions, loading, refreshSessions } = useSessions(buildingId);
  const { createSession, joinSession } = useCreateSession();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', creatorName: '', capacity: 4 });

  // Temporary mapping for building names
  const buildingName = buildingId === 'library' ? 'General Library' : 
                       buildingId === 'science-bldg' ? 'Science Building' : 
                       'Unknown Building';

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSession({ ...formData, buildingIdentifier: buildingId as string });
      setShowModal(false);
      setFormData({ title: '', description: '', creatorName: '', capacity: 4 }); // Reset form data
      refreshSessions(); // Refresh list after creation
    } catch (err) {
      alert('Failed to create session');
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    const userName = prompt('Enter your alias to join:');
    if (!userName) return;

    try {
      await joinSession(sessionId, userName);
      refreshSessions(); // Refresh list after joining
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="p-3 hover:bg-gray-50 rounded-2xl transition-all flex items-center justify-center border-2 border-transparent hover:border-border-subtle active:scale-95"
              aria-label="Go back to map"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 italic tracking-tight">{buildingName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Campus Lobby</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        
        {/* Create Session Banner */}
        <div className="bg-brand rounded-premium shadow-2xl shadow-brand-light p-10 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 transform transition-transform hover:scale-[1.01]">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black mb-3 italic tracking-tighter">Squad up?</h2>
            <p className="text-brand-light text-lg font-medium">Be the one who starts the grind. Create a lobby for others to join.</p>
          </div>
          <button 
            className="flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-2xl font-black text-lg hover:bg-brand-light transition-all shadow-xl active:scale-95 whitespace-nowrap"
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={24} />
            START SESSION
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Happening Now</h3>
          <span className="text-[10px] font-black bg-gray-900 text-white px-4 py-1.5 rounded-full uppercase tracking-widest leading-none">
            {sessions.length} ACTIVE
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-brand-light border-t-brand rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning building...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-gray-50 rounded-premium">
            <p className="text-xl font-bold text-gray-300 italic mb-4">Quiet in here... too quiet.</p>
            <button 
               className="text-brand font-black uppercase tracking-widest text-[10px] hover:underline"
               onClick={() => setShowModal(true)}
            >
              Start the first session
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sessions.map((session) => {
              const isFull = session.participants.length >= session.capacity || session.status === 'closed';
              return (
                <div key={session._id} className="card-premium flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-black text-gray-900 leading-tight italic group-hover:text-brand transition-colors uppercase tracking-tight">{session.title}</h4>
                    <span className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border-2 ${
                      isFull ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {isFull ? 'FULL' : 'OPEN'}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 font-medium mb-8 line-clamp-2 min-h-[48px]">
                    {session.description || 'No description provided.'}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t-2 border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2" title="Host">
                        <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-black italic">
                          {session.creatorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-gray-900">{session.creatorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px]">
                        <Users size={16} className="text-gray-300" />
                        <span>{session.participants.length} / {session.capacity}</span>
                      </div>
                    </div>

                    <button 
                      className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                        isFull 
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                          : 'bg-brand-light text-brand hover:bg-brand hover:text-white active:scale-95'
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

      {/* Create Session Modal for Detail Page */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface rounded-premium w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-all p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-8 italic flex items-center gap-3 tracking-tighter">
              <PlusCircle className="text-brand w-8 h-8" /> 
              Open a Lobby
            </h2>
            
            <form onSubmit={handleCreateSession} className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Session Title</label>
                <input 
                  type="text" required
                  className="w-full border-4 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand/10 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-200"
                  placeholder="e.g. 24H Grind at Library"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Alias</label>
                  <input 
                    type="text" required
                    className="w-full border-4 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand/10 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-200"
                    placeholder="Your name"
                    value={formData.creatorName}
                    onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Limit</label>
                  <input 
                    type="number" required min="2" max="20"
                    className="w-full border-4 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand/10 focus:bg-white transition-all font-bold text-gray-900"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 4})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Description</label>
                <textarea 
                  rows={2}
                  className="w-full border-4 border-gray-50 bg-gray-50 rounded-2xl p-4 outline-none focus:border-brand/10 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-200 resize-none"
                  placeholder="Room vibes..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="mt-2 w-full bg-brand text-white font-black text-xl italic rounded-2xl py-5 hover:bg-brand-hover hover:shadow-2xl hover:shadow-brand-light hover:-translate-y-1 transition-all active:scale-95"
              >
                CREATE SESSION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
