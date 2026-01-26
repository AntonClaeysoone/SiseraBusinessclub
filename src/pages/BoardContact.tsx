import { motion } from 'framer-motion';
import '../App.css';

interface BoardMember {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  image: string;
}

const BoardContact = () => {
  const boardMembers: BoardMember[] = [
    {
      id: 1,
      name: 'Nail Kurum',
      title: 'Eventmanager',
      email: 'nail@sisera.be',
      phone: '+32 486 55 14 67',
      image: '/Nail.jpg'
    },
    {
      id: 2,
      name: 'Johannes Kurum',
      title: 'Sales',
      email: 'johannes@sisera.be',
      phone: '+32 476 35 13 83',
      image: '/Johannes.jpeg'
    },
    {
      id: 3,
      name: 'Sergey Avagyan',
      title: 'Sales',
      email: 'sergey.av@outlook.be',
      phone: '+32 486 08 86 06',
      image: '/Sergey.jpg'
    },
    {
      id: 4,
      name: 'Anton Claeysoone',
      title: 'IT, Website & Marketing',
      email: 'info@artograph.be',
      phone: '+32 497 94 12 10',
      image: '/Anton.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
            BOARD & CONTACT
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="luxury-divider mx-auto"
          />
        </div>
      </motion.div>

      {/* Board Members Grid */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {boardMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              {/* Photo */}
              <div className="w-full aspect-square overflow-hidden bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
                  {member.title}
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <a
                    href={`mailto:${member.email}`}
                    className="block text-gray-700 hover:text-gray-900 transition-colors break-words"
                  >
                    {member.email}
                  </a>
                  <p className="text-gray-700 break-words">
                    Telefoon: {member.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BoardContact;



