const React = require('react');

const filterMotionProps = (props) => {
  const {
    initial,
    animate,
    exit,
    variants,
    transition,
    whileHover,
    whileTap,
    whileFocus,
    whileDrag,
    whileInView,
    viewport,
    onViewportEnter,
    onViewportLeave,
    ...domProps
  } = props;
  return domProps;
};

const MotionDiv = React.forwardRef((props, ref) => (
  <div ref={ref} {...filterMotionProps(props)} />
));
MotionDiv.displayName = 'motion.div';

const MotionButton = React.forwardRef((props, ref) => (
  <button ref={ref} {...filterMotionProps(props)} />
));
MotionButton.displayName = 'motion.button';

module.exports = {
  motion: {
    div: MotionDiv,
    button: MotionButton,
  },
  useScroll: () => ({
    scrollYProgress: {
      on: jest.fn(),
      set: jest.fn(),
      get: () => 0,
    },
  }),
  useTransform: (input, _inputRange, _outputRange) => input,
  useMotionValueEvent: jest.fn(),
};
