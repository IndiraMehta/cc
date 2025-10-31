import { useState } from 'react';
import { Calendar, Users, Trophy, FileText, Award, UserPlus } from 'lucide-react';
import { hostedEvents } from '../data/dummyData';

export const HostEventsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    eligibility: '',
    maxParticipants: '',
    rounds: '',
    criteria: '',
    startDate: '',
    endDate: '',
    prizes: '',
    judges: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({
      name: '',
      eligibility: '',
      maxParticipants: '',
      rounds: '',
      criteria: '',
      startDate: '',
      endDate: '',
      prizes: '',
      judges: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Host an Event</h1>
          <p className="text-gray-600">Create and manage amazing hackathons and innovation challenges</p>
        </div>

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 animate-pulse">
            Event created successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="AI Innovation Challenge 2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Eligibility</label>
                    <input
                      type="text"
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      placeholder="All college students"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of Rounds</label>
                  <input
                    type="number"
                    name="rounds"
                    value={formData.rounds}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Judging Criteria</label>
                  <textarea
                    name="criteria"
                    value={formData.criteria}
                    onChange={handleChange}
                    placeholder="Innovation, Technical Implementation, Impact, Presentation"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Prize Details</label>
                  <input
                    type="text"
                    name="prizes"
                    value={formData.prizes}
                    onChange={handleChange}
                    placeholder="$10,000 - 1st Place, $5,000 - 2nd Place"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Invite Judges (Emails)</label>
                  <input
                    type="text"
                    name="judges"
                    value={formData.judges}
                    onChange={handleChange}
                    placeholder="judge1@example.com, judge2@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  Create Event
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <Trophy className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Set clear eligibility criteria</li>
                <li>• Define detailed judging criteria</li>
                <li>• Invite experienced judges early</li>
                <li>• Plan multiple rounds for better selection</li>
                <li>• Offer attractive prizes</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">Event Guidelines</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Users className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                  <span>Events should run for at least 2 days</span>
                </li>
                <li className="flex items-start">
                  <FileText className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                  <span>Provide clear problem statements</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-4 h-4 mt-0.5 mr-2 text-purple-600 flex-shrink-0" />
                  <span>Announce winners within 7 days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Ongoing Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{event.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-semibold text-gray-800">
                      {event.participants} / {event.maxParticipants}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Judges:</span>
                    <span className="font-semibold text-gray-800">{event.judgeCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Submissions:</span>
                    <span className="font-semibold text-gray-800">{event.submissionsReceived}</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center">
                  <Award className="w-5 h-5 mr-2" />
                  Announce Winner
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
