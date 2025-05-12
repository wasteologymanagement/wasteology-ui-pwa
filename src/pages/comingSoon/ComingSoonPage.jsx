import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import comingSoonImage from '../../assets/coming-soon.svg'; // You'll need to add this image

const ComingSoonPage = () => {
  return (
    <Box className="min-h-screen bg-white">
      <Container maxWidth="lg" className="py-12 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <Typography 
              variant="h2" 
              className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4"
            >
              Coming Soon
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg"
            >
              We're working on something exciting! Our new feature will be ready soon.
            </Typography>

            <div className="flex justify-center md:justify-start mb-8">
              <CountdownCircleTimer
                isPlaying
                duration={86400}
                colors={['#10B981', '#34D399', '#6EE7B7']} // Green shades
                colorsTime={[86400, 43200, 0]}
                size={120}
                strokeWidth={8}
              >
                {({ remainingTime }) => {
                  const hours = Math.floor((remainingTime % 86400) / 3600);
                  const minutes = Math.floor((remainingTime % 3600) / 60);
                  const seconds = remainingTime % 60;

                  return (
                    <div className="text-center">
                      <Typography className="text-xl font-semibold text-gray-800">
                        {`${hours}:${minutes}:${seconds}`}
                      </Typography>
                      <Typography className="text-sm text-gray-600">Time Left</Typography>
                    </div>
                  );
                }}
              </CountdownCircleTimer>
            </div>

            <Button
              variant="contained"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Notify Me
            </Button>
          </motion.div>

          {/* Right side: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <img
              src={comingSoonImage}
              alt="Coming Soon Illustration"
              className="w-full max-w-md object-contain"
            />
          </motion.div>
        </div>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
