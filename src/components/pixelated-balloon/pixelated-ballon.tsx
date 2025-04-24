import styles from './pixelated-ballon.module.css';

const PixelBalloon = ({
  children,
  position = 'left',
}: {
  children: React.ReactNode;
  position?: 'left' | 'right';
}) => {
  const balloonClasses = `${styles.pixelBalloon} ${
    position === 'left' ? styles.fromLeft : ''
  }`;

  return (
    <div className={balloonClasses}>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
};

export default PixelBalloon;