import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventCard = ({ event }) => {
  const getStatusColor = (status) => {
    return status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {event.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
            {event.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <span>{event.startDate} - {event.endDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-purple-600" />
            <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-semibold text-yellow-700">{event.prize}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b">
          <span className="font-medium">Hosted by:</span>
          <span className="ml-2">{event.host}</span>
        </div>

        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium">
            Join Event
          </button>
          <Link
            to={`/event/${event.id}`}
            className="flex items-center justify-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <span className="mr-1">Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
