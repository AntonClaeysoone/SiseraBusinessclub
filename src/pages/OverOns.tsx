import { motion } from 'framer-motion';

const OverOns = () => {
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
            OVER ONS
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="luxury-divider mx-auto"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* First Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
              SISERA is sinds 2007 een gevestigde naam in België als toonaangevende retailer in zowel menswear als womenswear. Met een zorgvuldig samengestelde selectie van meer dan 30 exclusieve topmerken, waaronder Fedeli, Jacob Cohën, Zegna, Moorer, Hogan, Tods en Stone Island, biedt SISERA de meest complete collecties.
            </p>
          </motion.section>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <img
              src="/BOSS_STORE.webp"
              alt="SISERA Store"
              className="w-full h-auto rounded-lg object-cover shadow-lg"
            />
          </motion.div>

          {/* Second Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
              Onze vijf stijlvolle winkels en de online store, bereikbaar via sisera.be, staan synoniem voor elegantie, exclusiviteit en persoonlijk advies. Dankzij onze toegewijde Personal Advisors, die altijd klaarstaan om aan uw unieke wensen te voldoen, maken we van winkelen een persoonlijke ervaring op maat.
            </p>
          </motion.section>

          {/* Second Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <img
              src="/BOSS_STORE2.jpg"
              alt="SISERA Store"
              className="w-full h-auto rounded-lg object-cover shadow-lg"
            />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16"
          >
            <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-xl sm:text-2xl">🏪</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5 Winkels</h3>
              <p className="text-sm sm:text-base text-gray-600">Stijlvolle locaties door België</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-xl sm:text-2xl">👔</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">30+ Merken</h3>
              <p className="text-sm sm:text-base text-gray-600">Exclusieve topmerken</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-xl sm:text-2xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Personal Advisors</h3>
              <p className="text-sm sm:text-base text-gray-600">Persoonlijk advies op maat</p>
            </div>
          </motion.div>

          {/* Third Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="bg-gray-50 rounded-lg p-6 sm:p-8 md:p-12"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              SISERA staat voor exclusiviteit en onderscheidt zich door een unieke, persoonlijke stijl te creëren die volledig aansluit bij elke klant. Het hart van ons bedrijf ligt in persoonlijke service en toewijding, waarbij we streven naar een buitengewone winkelervaring. Bij SISERA draait alles om het realiseren van dromen, met een sterke focus op luxe, oog voor detail en een warm, oprecht contact met elke klant.
            </p>
          </motion.section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8 sm:mt-12 md:mt-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ontdek SISERA
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Bezoek onze winkels of shop online op sisera.be
            </p>
            <motion.a
              href="https://sisera.be"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-gray-900 text-white rounded-full uppercase text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Bezoek Website
            </motion.a>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OverOns;





