import { useReducedMotion } from 'framer-motion';

// INITI EASE: Expensive, high-friction, deeply damped curve simulating physical permanence
export const INITI_EASE = [0.16, 1, 0.3, 1];

// Helper hook to retrieve context-aware animation variants
export const useMotionVariants = () => {
    const shouldReduceMotion = useReducedMotion();

    return {
        // Standard Scroll Reveal (Y-Axis)
        slideUpReveal: {
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 80 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.4, ease: INITI_EASE }
            }
        },

        // Scale-based Reveal (Scale strictly transforms; high performant GPU path)
        scaleReveal: {
            hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 1.4, ease: INITI_EASE }
            }
        },

        // Fast Parallax Stagger Logic
        staggerContainer: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                }
            }
        },

        // X-Axis Progress Lines
        expandX: {
            hidden: { scaleX: 0 },
            visible: {
                scaleX: 1,
                transition: { duration: 1.5, ease: INITI_EASE }
            }
        }
    };
};
