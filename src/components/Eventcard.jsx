import { Calendar, Users, Trophy } from 'lucide-react';

export const EventCard = ({ event, onJoin, onViewDetails }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'ongoing':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="h-2 bg-gradient-to-red from-blue-500 to-cyan-500"></div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
            {event.name}
          </h3>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-2" />
            <span>Max {event.max_participants} participants</span>
          </div>

          {event.prizes && (
            <div className="flex items-center text-sm text-gray-500">
              <Trophy size={16} className="mr-2" />
              <span className="line-clamp-1">{event.prizes}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onJoin(event)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Join Event
          </button>
          <button
            onClick={() => onViewDetails(event)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
