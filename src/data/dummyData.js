export const upcomingEvents = [
  {
    id: '1',
    name: 'AI Innovation Challenge 2025',
    description: 'Build innovative AI solutions that solve real-world problems. Compete with the best minds in artificial intelligence.',
    startDate: '2025-11-15',
    endDate: '2025-11-17',
    host: 'TechCorp Inc.',
    maxParticipants: 500,
    currentParticipants: 234,
    status: 'upcoming',
    prize: '$10,000',
    eligibility: 'All college students',
  },
  {
    id: '2',
    name: 'Web3 Blockchain Hackathon',
    description: 'Explore the future of decentralized applications. Build dApps, smart contracts, and blockchain solutions.',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    host: 'CryptoLabs',
    maxParticipants: 300,
    currentParticipants: 156,
    status: 'ongoing',
    prize: '$15,000',
    eligibility: 'Open to all',
  },
  {
    id: '3',
    name: 'Healthcare Innovation Sprint',
    description: 'Design technology solutions to improve healthcare accessibility and patient care in underserved communities.',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    host: 'MedTech Foundation',
    maxParticipants: 200,
    currentParticipants: 89,
    status: 'upcoming',
    prize: '$8,000',
    eligibility: 'Students & Professionals',
  },
  {
    id: '4',
    name: 'Sustainable Tech Challenge',
    description: 'Create eco-friendly tech solutions for a sustainable future. Focus on renewable energy, waste reduction, and climate action.',
    startDate: '2025-11-25',
    endDate: '2025-11-27',
    host: 'Green Earth Initiative',
    maxParticipants: 400,
    currentParticipants: 312,
    status: 'ongoing',
    prize: '$12,000',
    eligibility: 'All innovators welcome',
  },
];

export const myEvents = [
  {
    id: '2',
    name: 'Web3 Blockchain Hackathon',
    teamName: 'ChainBreakers',
    teamMembers: ['You', 'Alice Smith', 'Bob Johnson'],
    status: 'ongoing',
    submissionDeadline: '2025-11-22',
  },
  {
    id: '4',
    name: 'Sustainable Tech Challenge',
    teamName: 'EcoWarriors',
    teamMembers: ['You', 'Carol White'],
    status: 'ongoing',
    submissionDeadline: '2025-11-27',
  },
];

export const judgeEvents = [
  {
    id: '1',
    name: 'AI Innovation Challenge 2025',
    submissions: 45,
    reviewed: 12,
    pending: 33,
  },
  {
    id: '3',
    name: 'Healthcare Innovation Sprint',
    submissions: 28,
    reviewed: 28,
    pending: 0,
  },
];

export const hostedEvents = [
  {
    id: '5',
    name: 'Mobile App Development Contest',
    participants: 145,
    maxParticipants: 200,
    status: 'ongoing',
    judgeCount: 5,
    submissionsReceived: 67,
  },
];

export const chatMessages = [
  {
    id: '1',
    sender: 'Alice Smith',
    message: 'Hey team! Have we decided on the tech stack yet?',
    timestamp: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'You',
    message: 'I think we should go with React and Node.js for this project.',
    timestamp: '10:32 AM',
    isMe: true,
  },
  {
    id: '3',
    sender: 'Bob Johnson',
    message: 'Sounds good! I can handle the backend API development.',
    timestamp: '10:35 AM',
    isMe: false,
  },
  {
    id: '4',
    sender: 'Alice Smith',
    message: 'Perfect! I\'ll work on the UI design and frontend components.',
    timestamp: '10:36 AM',
    isMe: false,
  },
];

export const chatbotResponses = {
  'show my events': 'You are currently participating in 2 events: Web3 Blockchain Hackathon and Sustainable Tech Challenge.',
  'how to host an event': 'To host an event, go to the Host Events page from your profile menu. Fill in the event details including name, eligibility, dates, and prizes. Then click Create Event!',
  'submission deadline': 'Your nearest submission deadline is Nov 22, 2025 for the Web3 Blockchain Hackathon.',
  'help': 'I can help you with:\n• Show my events\n• How to host an event\n• Submission deadlines\n• Finding events to join',
  default: 'I\'m here to help! Try asking about your events, hosting events, or submission deadlines.',
};
