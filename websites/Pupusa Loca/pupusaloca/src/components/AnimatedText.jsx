import BlurText from './BlurText'

function AnimatedText({
  text,
  as = 'span',
  animateBy = 'words',
  className = '',
  delay = 35,
  direction = 'bottom',
  stepDuration = 0.28,
  threshold = 0.1,
  rootMargin = '0px',
  style,
  ...rest
}) {
  return (
    <BlurText
      animateBy={animateBy}
      as={as}
      className={className}
      delay={delay}
      direction={direction}
      rootMargin={rootMargin}
      stepDuration={stepDuration}
      style={style}
      text={String(text ?? '')}
      threshold={threshold}
      {...rest}
    />
  )
}

export default AnimatedText
