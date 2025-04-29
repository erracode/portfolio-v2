import type { HTMLAttributes, ReactNode } from "react"
import styles from "./index.module.css"
import { cn } from "@/lib/utils"

/* Main Card Component */
interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function PixelCard({ children, className, ...props }: PixelCardProps) {
  return (
    <div className={cn(styles.card, className)} {...props}>
      {children}
    </div>
  )
}

/* Card Header */
interface PixelCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

function PixelCardHeader({ children, className, ...props }: PixelCardHeaderProps) {
  return (
    <div className={cn(styles.header, className)} {...props}>
      {children}
    </div>
  )
}

/* Card Title */
interface PixelCardTitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

function PixelCardTitle({ children, className, ...props }: PixelCardTitleProps) {
  return (
    <div className={cn(styles.title, className)} {...props}>
      {children}
    </div>
  )
}

/* Card Subtitle */
interface PixelCardSubtitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

function PixelCardSubtitle({ children, className, ...props }: PixelCardSubtitleProps) {
  return (
    <div className={cn(styles.subtitle, className)} {...props}>
      {children}
    </div>
  )
}

/* Card Content */
interface PixelCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

function PixelCardContent({ children, className, ...props }: PixelCardContentProps) {
  return (
    <div className={cn(styles.content, className)} {...props}>
      {children}
    </div>
  )
}

/* Card Footer */
interface PixelCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

function PixelCardFooter({ children, className, ...props }: PixelCardFooterProps) {
  return (
    <div className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
}

/* Assign subcomponents to the main component */
PixelCard.Header = PixelCardHeader
PixelCard.Title = PixelCardTitle
PixelCard.Subtitle = PixelCardSubtitle
PixelCard.Content = PixelCardContent
PixelCard.Footer = PixelCardFooter
