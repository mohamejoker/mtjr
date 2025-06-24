import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ className, size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <motion.div
      className={cn(
        'border-2 border-primary border-t-transparent rounded-full',
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

const LoadingDots = ({ className }) => {
  return (
    <div className={cn('flex space-x-1 space-x-reverse', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

const LoadingPulse = ({ className }) => {
  return (
    <motion.div
      className={cn('w-8 h-8 bg-primary rounded-full', className)}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

const LoadingPage = ({ message = 'جاري التحميل...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingDots, LoadingPulse, LoadingPage };