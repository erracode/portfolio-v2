"use client";

import type { CSSProperties } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/8bit/tooltip";
import { PixelButton } from "@/components/ui/pixel-button";
import { techBuffs } from "@/data/techBuffs";
import styles from "./buffs-bar.module.css";

interface BuffsBarProps {
  visible: boolean;
}

export function BuffsBar({ visible }: BuffsBarProps) {
  if (!visible) return null;

  return (
    <TooltipProvider delayDuration={500}>
      <div className={styles.bar} aria-label="Active skill buffs">
        {techBuffs.map((buff) => (
          <Tooltip key={buff.id}>
            <TooltipTrigger asChild>
              <PixelButton
                size="small"
                variant="default"
                className={styles.tile}
                style={{ "--buff-color": buff.color } as CSSProperties}
                aria-label={buff.title}
                icon={
                  buff.icon ? (
                    <img src={buff.icon} alt="" className={styles.tileIcon} />
                  ) : (
                    <span className={styles.tileFallback}>{buff.abbr}</span>
                  )
                }
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" className={styles.tooltip}>
              <div className={styles.tooltipTitle}>{buff.title}</div>
              <div className={styles.tooltipSubtitle}>{buff.subtitle}</div>
              <div className={styles.tooltipDesc}>{buff.description}</div>
              <div className={styles.tooltipEffect}>{buff.effect}</div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}