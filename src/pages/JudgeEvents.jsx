import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Star, ExternalLink, FileText } from 'lucide-react';

export const JudgeEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadJudgeEvents();
    }
  }, [user]);

  const loadJudgeEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .contains('judges', [user.id]);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading judge events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          event_participants (
            team_name,
            profiles (name, email)
          ),
          reviews (
            id,
            rating,
            feedback,
            judge_id
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    loadSubmissions(event.id);
  };

  const handleReview = async (submissionId, rating, feedback) => {
    if (!rating || !feedback.trim()) {
      alert('Please provide both rating and feedback');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          event_id: selectedEvent.id,
          judge_id: user.id,
          submission_id: submissionId,
          rating: parseInt(rating),
          feedback
        }]);

      if (error) {
        if (error.code === '23505') {
          alert('You have already reviewed this submission');
        } else {
          throw error;
        }
      } else {
        alert('Review submitted successfully!');
        loadSubmissions(selectedEvent.id);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
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
      <h1 className="text-4xl font-bold mb-8">Judge Events</h1>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No events assigned for judging</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Your Events</h2>
            <div className="space-y-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedEvent?.id === event.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-bold mb-1">{event.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedEvent.description}</p>

                  {selectedEvent.judging_criteria && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-900 mb-2">Judging Criteria</h3>
                      <p className="text-blue-700">{selectedEvent.judging_criteria}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4">Submissions ({submissions.length})</h3>

                {submissions.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {submissions.map((submission) => {
                      const myReview = submission.reviews.find(r => r.judge_id === user.id);

                      return (
                        <SubmissionReviewCard
                          key={submission.id}
                          submission={submission}
                          myReview={myReview}
                          onReview={handleReview}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Select an event to view submissions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SubmissionReviewCard = ({ submission, myReview, onReview }) => {
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onReview(submission.id, rating, feedback);
    setShowForm(false);
    setRating('');
    setFeedback('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold mb-1">
            {submission.event_participants.team_name}
          </h4>
          <p className="text-sm text-gray-600">
            By {submission.event_participants.profiles.name}
          </p>
        </div>

        {myReview ? (
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-1 text-green-700">
              <Star size={16} fill="currentColor" />
              <span className="font-bold">{myReview.rating}/10</span>
            </div>
            <p className="text-xs text-green-600">Reviewed</p>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Review'}
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4">{submission.description}</p>

      <div className="space-y-2 mb-4">
        <a
          href={submission.github_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-600 hover:underline"
        >
          <ExternalLink size={16} />
          <span>GitHub Repository</span>
        </a>

        {submission.demo_link && (
          <a
            href={submission.demo_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:underline"
          >
            <ExternalLink size={16} />
            <span>Demo Video</span>
          </a>
        )}

        {submission.ppt_url && (
          <a
            href={submission.ppt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:underline"
          >
            <FileText size={16} />
            <span>Presentation</span>
          </a>
        )}
      </div>

      {myReview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <h5 className="font-bold mb-2">Your Feedback</h5>
          <p className="text-gray-700">{myReview.feedback}</p>
        </div>
      )}

      {showForm && !myReview && (
        <form onSubmit={handleSubmit} className="border-t pt-4 mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Rating (1-10) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Provide constructive feedback..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};
