import { motion } from 'framer-motion';

export const Card = ({
  children,
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const Wrapper = hover ? motion.div : 'div';

  const hoverProps = hover ? {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Wrapper
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
};
