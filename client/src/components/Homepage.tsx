import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to WeKeyar Dashboard</h1>
        <p className="text-lg mb-8">
          Manage your business efficiently with our powerful tools.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100"
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100"
            >
              Signup
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;