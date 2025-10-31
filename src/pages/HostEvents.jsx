import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Trophy, Plus, X } from 'lucide-react';

export const HostEvents = () => {
  const [showForm, setShowForm] = useState(false);
  const [myHostedEvents, setMyHostedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    max_participants: 100,
    rounds: [{ name: '', description: '' }],
    judging_criteria: '',
    start_date: '',
    end_date: '',
    prizes: '',
    judge_emails: ''
  });

  useEffect(() => {
    if (user) {
      loadMyHostedEvents();
    }
  }, [user]);

  const loadMyHostedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, event_participants(count)')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyHostedEvents(data || []);
    } catch (error) {
      console.error('Error loading hosted events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index][field] = value;
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, { name: '', description: '' }]
    }));
  };

  const removeRound = (index) => {
    const newRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rounds: newRounds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const judgeEmails = formData.judge_emails
        .split(',')
        .map(email => email.trim())
        .filter(email => email);

      const { data: judges } = await supabase
        .from('profiles')
        .select('id')
        .in('email', judgeEmails);

      const judgeIds = judges?.map(j => j.id) || [];

      const { error } = await supabase
        .from('events')
        .insert([{
          name: formData.name,
          description: formData.description,
          host_id: user.id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          eligibility: formData.eligibility,
          max_participants: parseInt(formData.max_participants),
          rounds: formData.rounds,
          judging_criteria: formData.judging_criteria,
          prizes: formData.prizes,
          judges: judgeIds,
          status: 'upcoming'
        }]);

      if (error) throw error;

      alert('Event created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        eligibility: '',
        max_participants: 100,
        rounds: [{ name: '', description: '' }],
        judging_criteria: '',
        start_date: '',
        end_date: '',
        prizes: '',
        judge_emails: ''
      });
      loadMyHostedEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const announceWinners = async (eventId) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'completed' })
        .eq('id', eventId);

      if (error) throw error;
      alert('Winners announced! Event marked as completed.');
      loadMyHostedEvents();
    } catch (error) {
      console.error('Error announcing winners:', error);
      alert('Failed to announce winners');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Host Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Event</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Eligibility</label>
                <input
                  type="text"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Students, Professionals, Open to all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Participants</label>
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Judge Emails (comma-separated)</label>
                <input
                  type="text"
                  name="judge_emails"
                  value={formData.judge_emails}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="judge1@email.com, judge2@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Judging Criteria</label>
              <textarea
                name="judging_criteria"
                value={formData.judging_criteria}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Innovation, Implementation, Presentation, Impact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prizes</label>
              <textarea
                name="prizes"
                value={formData.prizes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="1st: $1000, 2nd: $500, 3rd: $250"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium">Rounds</label>
                <button
                  type="button"
                  onClick={addRound}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Round
                </button>
              </div>

              {formData.rounds.map((round, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Round {index + 1}</span>
                    {formData.rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={round.name}
                    onChange={(e) => handleRoundChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Round name"
                    required
                  />

                  <textarea
                    value={round.description}
                    onChange={(e) => handleRoundChange(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Round description"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">My Hosted Events</h2>

        {myHostedEvents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You haven't hosted any events yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myHostedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  {event.status === 'ongoing' && (
                    <button
                      onClick={() => announceWinners(event.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium flex items-center space-x-2"
                    >
                      <Trophy size={18} />
                      <span>Announce Winners</span>
                    </button>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span>{event.event_participants?.[0]?.count || 0} / {event.max_participants}</span>
                  </div>
                  {event.prizes && (
                    <div className="flex items-center text-gray-600">
                      <Trophy size={16} className="mr-2" />
                      <span className="truncate">{event.prizes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};