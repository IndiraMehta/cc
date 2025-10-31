import { useState } from 'react';
import { Gavel, CheckCircle, Clock, Star } from 'lucide-react';
import { judgeEvents } from '../data/dummyData';

export const JudgeEventsPage = () => {
  const [ratings, setRatings] = useState({});

  const handleScoreChange = (eventId, score) => {
    setRatings({
      ...ratings,
      [eventId]: { ...ratings[eventId], score },
    });
  };

  const handleFeedbackChange = (eventId, feedback) => {
    setRatings({
      ...ratings,
      [eventId]: { ...ratings[eventId], feedback },
    });
  };

  const handleSubmitRating = (eventId, eventName) => {
    alert(`Rating submitted for ${eventName}!`);
    setRatings({
      ...ratings,
      [eventId]: { score: '', feedback: '' },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Judge Events</h1>
          <p className="text-gray-600">Review and rate submissions for events you've been invited to judge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {judgeEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500" />
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.name}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{event.reviewed} Reviewed</span>
                      </div>
                      <div className="flex items-center text-orange-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{event.pending} Pending</span>
                      </div>
                    </div>
                  </div>
                  <Gavel className="w-8 h-8 text-yellow-600" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-3">
                    Total Submissions: <span className="font-bold text-gray-800">{event.submissions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${(event.reviewed / event.submissions) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Score (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ratings[event.id]?.score || ''}
                        onChange={(e) => handleScoreChange(event.id, e.target.value)}
                        placeholder="Enter score"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none"
                      />
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              parseInt(ratings[event.id]?.score || '0') >= star * 2
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Feedback</label>
                    <textarea
                      rows={3}
                      value={ratings[event.id]?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(event.id, e.target.value)}
                      placeholder="Provide constructive feedback for the participants..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleSubmitRating(event.id, event.name)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {judgeEvents.length === 0 && (
          <div className="text-center py-16">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events to Judge</h3>
            <p className="text-gray-500">You haven't been invited to judge any events yet.</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Judging Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Evaluation Criteria</h4>
              <ul className="space-y-1 text-sm text-yellow-100">
                <li>• Innovation & Creativity</li>
                <li>• Technical Implementation</li>
                <li>• Impact & Usefulness</li>
                <li>• Presentation Quality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="space-y-1 text-sm text-yellow-100">
                <li>• Be fair and objective</li>
                <li>• Provide constructive feedback</li>
                <li>• Review all submissions thoroughly</li>
                <li>• Meet judging deadlines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
