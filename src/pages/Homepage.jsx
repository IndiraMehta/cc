import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EventCard } from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';

export const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (filter === 'upcoming') {
        query = query.eq('status', 'upcoming');
      } else if (filter === 'ongoing') {
        query = query.eq('status', 'ongoing');
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (event) => {
    if (!user) {
      alert('Please login to join events');
      return;
    }

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert([{
          event_id: event.id,
          user_id: user.id,
          team_name: `Team ${user.email.split('@')[0]}`
        }]);

      if (error) {
        if (error.code === '23505') {
          alert('You have already joined this event!');
        } else {
          throw error;
        }
      } else {
        alert('Successfully joined the event!');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join event');
    }
  };

  const handleViewDetails = (event) => {
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'eventDetails', eventId: event.id }
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
    <div>
      <div className="bg-gradient-to-red from-blue-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to InnovateHub</h1>
          <p className="text-xl text-blue-100">
            Discover hackathons, collaborate with innovators, and showcase your projects
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Explore Events</h2>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ongoing
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
