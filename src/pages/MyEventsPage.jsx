import { useState } from 'react';
import { Users, Calendar, MessageSquare, Upload, Github, Link as LinkIcon, FileText } from 'lucide-react';
import { myEvents } from '../data/dummyData';
import { Modal } from '../components/Modal';

export const MyEventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleSubmit = (eventName) => {
    setSelectedEvent(eventName);
    setIsModalOpen(true);
  };

  const handleSubmitProject = () => {
    alert('Project submitted successfully!');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Events</h1>
          <p className="text-gray-600">Manage your participating events and collaborate with your team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {event.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">{event.teamName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.teamMembers.map((member, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Submission Deadline: </span>
                  <span className="ml-2 font-semibold text-red-600">{event.submissionDeadline}</span>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium">
                    <MessageSquare className="w-5 h-5" />
                    <span>Team Chat</span>
                  </button>
                  <button
                    onClick={() => handleSubmit(event.name)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Submit Project</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {myEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Join events from the homepage to get started!</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Project">
        <div className="space-y-6">
          <p className="text-gray-600">Submit your project for <strong>{selectedEvent}</strong></p>

          <div>
            <label className="block text-gray-700 font-medium mb-2">GitHub Repository Link</label>
            <div className="relative">
              <Github className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Demo Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="url"
                placeholder="https://your-demo.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Presentation (PPT/PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">PPT, PDF up to 10MB</p>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Project Description</label>
            <textarea
              rows={4}
              placeholder="Describe your project, key features, and impact..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={handleSubmitProject}
            className="w-full bg-gradient-to-red from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Submit Project
          </button>
        </div>
      </Modal>
    </div>
  );
};
