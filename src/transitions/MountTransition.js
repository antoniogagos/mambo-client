import { motion } from 'framer-motion'
import React from 'react';

export const MountTransition = ({
  children,
  slide = 0,
  slideUp = 0,
}) => {
  return (
  <motion.div
    exit={{ opacity: 0, scale: 1, x: 0, y: '6%' }}
    initial={{ opacity: 1, scale: 0.9, x: 0, y: slideUp }}
    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
    transition={{
      duration: 0.2,
      ease: 'easeOut'
    }}>
    {children}
  </motion.div>)
}