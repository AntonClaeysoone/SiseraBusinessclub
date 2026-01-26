import { motion } from 'framer-motion';
import HeroSlideshow from '../components/HeroSlideshow';
import '../App.css';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSlideshow />
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8 px-4">
            WELKOM OP DE WEBSITE VAN DE SISERA BUSINESSCLUB
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="luxury-divider mx-auto mb-8 sm:mb-12"
          />

          <div className="about-content max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base sm:text-lg text-gray-700 leading-relaxed"
            >
              SISERA presenteert met trots de exclusieve SISERA Business Club – een unieke community waar passie voor vakmanschap en waardevolle connecties samenkomen. Deze club is opgericht om leden een gedeelde visie op ambacht en netwerken te bieden, gecombineerd met onvergetelijke ervaringen.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base sm:text-lg text-gray-700 leading-relaxed"
            >
              Gedurende het jaar organiseert SISERA exclusieve evenementen voor Business Clubleden, variërend van verfijnde diners en inspirerende gastsprekers tot informele netwerkbijeenkomsten. Het bijzondere aan deze club is de mix van leden uit diverse sectoren, die elkaar weten te inspireren op zowel creatief als zakelijk gebied.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-base sm:text-lg text-gray-700 leading-relaxed"
            >
              De SISERA Business Club is dé ontmoetingsplek waar stijl en succes hand in hand gaan. Een uniek platform waar ondernemers elkaar ontmoeten, inspireren en samen initiatieven ontwikkelen om waardevolle connecties te smeden. Deze ontmoetingen leiden tot verrijkende relaties met een onderscheidende business touch.
            </motion.p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;




