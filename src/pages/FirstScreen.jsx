import { motion } from "framer-motion";

export default function FirstScreen() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with better quality settings */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "crisp-edges",
          transform: "translateZ(0)", // Force hardware acceleration
        }}
      />

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/60 z-0"></div>

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-extrabold tracking-tight leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Movie Ticket Order App
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-200 font-medium mt-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Experience the magic of cinema—book your tickets in seconds
        </motion.p>
        <motion.button
          className="mt-8 bg-[#FF4D4D] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-medium flex items-center gap-2 mx-auto hover:bg-[#E64444] hover:scale-105 hover:shadow-lg transition-all duration-300"
          onClick={() => (window.location.href = "/home")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(255, 77, 77, 0.5)",
          }}
        >
          <img
            src="/icons/star.png"
            className="h-5 w-auto sm:h-6"
            alt="Star icon"
          />
          Explore Now
        </motion.button>
      </motion.div>
    </div>
  );
}
