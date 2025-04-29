"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { X } from "lucide-react"
import styles from "./styles.module.css"
import { cn } from "@/lib/utils"

export type OverlayPosition = "left" | "center" | "right"

export interface PixelOverlayProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  position?: OverlayPosition
  width?: string | number
  className?: string
  showCloseButton?: boolean
}

export function PixelOverlay({
  children,
  isOpen,
  onClose,
  position = "left",
  width = 320,
  className,
  showCloseButton = true,
}: PixelOverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Prevent scrolling when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Calculate actual width including scrollbar
  useEffect(() => {
    if (contentRef.current && typeof width === "number") {
      // Add extra width for the scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      if (scrollbarWidth > 0) {
        contentRef.current.style.width = `${width + scrollbarWidth}px`
      }
    }
  }, [isOpen, width])

  if (!isOpen) return null

  return (
    <div className={styles.overlayBackdrop} onClick={onClose}>
      <div className={cn(styles.overlayContainer, styles[`position-${position}`])}>
        <div className={styles.overlayContentWrapper}>
          <div
            ref={contentRef}
            className={cn(styles.overlayContent, className)}
            style={{ width: typeof width === "number" ? `${width}px` : width }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>

          {showCloseButton && (
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* Overlay Title */
interface PixelOverlayTitleProps {
  children: ReactNode
  className?: string
}

function PixelOverlayTitle({ children, className }: PixelOverlayTitleProps) {
  return <div className={cn(styles.overlayTitle, className)}>{children}</div>
}

/* Overlay Subtitle */
interface PixelOverlaySubtitleProps {
  children: ReactNode
  className?: string
}

function PixelOverlaySubtitle({ children, className }: PixelOverlaySubtitleProps) {
  return <div className={cn(styles.overlaySubtitle, className)}>{children}</div>
}

/* Overlay Header */
interface PixelOverlayHeaderProps {
  children: ReactNode
  className?: string
}

function PixelOverlayHeader({ children, className }: PixelOverlayHeaderProps) {
  return <div className={cn(styles.overlayHeader, className)}>{children}</div>
}

/* Overlay Content */
interface PixelOverlayContentProps {
  children: ReactNode
  className?: string
}

function PixelOverlayContent({ children, className }: PixelOverlayContentProps) {
  return <div className={cn(styles.overlayContentBody, className)}>{children}</div>
}

/* Overlay Footer */
interface PixelOverlayFooterProps {
  children: ReactNode
  className?: string
}

function PixelOverlayFooter({ children, className }: PixelOverlayFooterProps) {
  return <div className={cn(styles.overlayFooter, className)}>{children}</div>
}

/* Assign subcomponents to the main component */
PixelOverlay.Title = PixelOverlayTitle
PixelOverlay.Subtitle = PixelOverlaySubtitle
PixelOverlay.Header = PixelOverlayHeader
PixelOverlay.Content = PixelOverlayContent
PixelOverlay.Footer = PixelOverlayFooter
