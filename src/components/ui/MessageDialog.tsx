import PixelBalloon from '../pixelated-balloon/pixelated-balloon'
import styles from './MessageDialog.module.css'

export interface MessageDialogProps {
  message: string
  iconSrc?: string
}

export default function MessageDialog({ message, iconSrc = '/react-logo.png' }: MessageDialogProps) {
  return (
    <div className={styles.dialogContainer}>
      <img src={iconSrc} alt="Icon" className={styles.icon} />
      <PixelBalloon>{message}</PixelBalloon>
    </div>
  )
} 