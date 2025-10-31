import { User, Mail, Trophy, Calendar, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Events Participated', value: '2', icon: Calendar, color: 'from-blue-600 to-purple-600' },
    { label: 'Events Hosted', value: '1', icon: Trophy, color: 'from-green-600 to-teal-600' },
    { label: 'Events Judged', value: '2', icon: Award, color: 'from-yellow-600 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-8">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user?.email}</span>
                </div>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
                <p className="text-gray-600">
                  Passionate innovator and problem solver. Love participating in hackathons and building solutions
                  that make a difference. Always excited to collaborate with talented teams and learn new technologies.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'UI/UX Design'].map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
