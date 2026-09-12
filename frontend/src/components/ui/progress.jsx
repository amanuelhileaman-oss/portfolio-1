import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/80",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "h-full w-full flex-1 bg-primary rounded-full transition-all",
        indicatorClassName
      )}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
