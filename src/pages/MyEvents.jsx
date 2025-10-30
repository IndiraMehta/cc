import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Upload, MessageCircle } from 'lucide-react';
import { SubmissionModal } from '../components/SubmissionModal';

export const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMyEvents();
    }
  }, [user]);

  const loadMyEvents = async () => {
    try {
      const { data: participations, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          events (
            id,
            name,
            description,
            start_date,
            end_date,
            status,
            prizes
          ),
          submissions (
            id,
            github_link,
            ppt_url,
            demo_link,
            description,
            submitted_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setMyEvents(participations || []);
    } catch (error) {
      console.error('Error loading my events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    setSelectedEvent(event);
    setShowSubmissionModal(true);
  };

  const openTeamChat = (eventId) => {
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'chat', eventId }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Events</h1>

      {myEvents.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">You haven't joined any events yet</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Explore Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myEvents.map((participation) => {
            const event = participation.events;
            const submission = participation.submissions?.[0];

            return (
              <div key={participation.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  {participation.team_name && (
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-600">Team Name</p>
                      <p className="font-bold text-blue-600">{participation.team_name}</p>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
                  </div>
                  {event.prizes && (
                    <div className="flex items-center">
                      <Users size={16} className="mr-2" />
                      <span>{event.prizes}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold mb-3">Submission Status</h4>

                  {submission ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-700 font-medium">Submitted</span>
                        <span className="text-sm text-gray-600">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 text-gray-700">
                        <p><strong>GitHub:</strong> <a href={submission.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.github_link}</a></p>
                        {submission.demo_link && (
                          <p><strong>Demo:</strong> <a href={submission.demo_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.demo_link}</a></p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-700 font-medium mb-3">Not Submitted Yet</p>
                      {event.status === 'ongoing' && (
                        <button
                          onClick={() => handleSubmit(participation)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                        >
                          <Upload size={18} />
                          <span>Submit Project</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => openTeamChat(event.id)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <MessageCircle size={18} />
                    <span>Team Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showSubmissionModal && (
        <SubmissionModal
          participation={selectedEvent}
          onClose={() => {
            setShowSubmissionModal(false);
            loadMyEvents();
          }}
        />
      )}
    </div>
  );
};
