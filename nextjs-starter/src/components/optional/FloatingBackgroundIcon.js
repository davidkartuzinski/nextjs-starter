// components/optional/FloatingBackgroundIcon.js

export default function FloatingBackgroundIcon({
  image = '/dots-1.svg',
  top,
  left,
  right,
  bottom,
  opacity = 0.2,
  zIndex = 0,
  size = 240,
  position = 'left', // new prop: 'left' or 'right'
}) {
  const style = {
    top,
    bottom,
    left: position === 'left' ? left ?? 0 : undefined,
    right: position === 'right' ? right ?? 0 : undefined,
    opacity,
    zIndex,
    backgroundImage: `url('${image}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${size}px`,
    backgroundPosition: `${position} top`,
  };

  return (
    <div
      className='absolute pointer-events-none h-full w-full'
      style={style}
    />
  );
}
