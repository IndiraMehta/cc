import { EventCard } from '../components/EventCard';
import { upcomingEvents } from '../data/dummyData';
import { Trophy, Users, Zap } from 'lucide-react';

export const HomePage = () => {
  const ongoingEvents = upcomingEvents.filter((e) => e.status === 'ongoing');
  const upcomingOnly = upcomingEvents.filter((e) => e.status === 'upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">
                Welcome to InnovateHub
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join the world's most innovative hackathons and collaboration platform.
                Build, compete, and win with teams from around the globe.
              </p>
              <div className="flex justify-center space-x-8 mt-12">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-2">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">$50K+</p>
                  <p className="text-blue-100">Prize Pool</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-2">
                    <Users className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">2,500+</p>
                  <p className="text-blue-100">Participants</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-2">
                    <Zap className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-2xl">15+</p>
                  <p className="text-blue-100">Active Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {ongoingEvents.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-green-600 to-green-400 rounded-full mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Ongoing Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingOnly.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
