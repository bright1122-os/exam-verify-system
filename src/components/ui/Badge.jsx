import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

const statusIcons = {
  success: CheckCircle2,
  pending: Clock,
  error: XCircle,
  warning: AlertCircle,
};

const statusClasses = {
  success: 'badge-success',
  pending: 'badge-warning',
  error: 'badge-error',
  warning: 'badge-warning',
};

export const Badge = ({ status = 'success', children, showIcon = true }) => {
  const Icon = statusIcons[status];
  const classes = statusClasses[status];

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={classes}
    >
      {showIcon && Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.span>
  );
};
