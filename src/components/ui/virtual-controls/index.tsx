"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { touchInput } from "@/lib/input";
import styles from "./styles.module.css";

interface VirtualControlsProps {
	visible: boolean;
}

export function VirtualControls({ visible }: VirtualControlsProps) {
	const [isTouch, setIsTouch] = useState(false);
	const baseRef = useRef<HTMLDivElement>(null);
	const knobRef = useRef<HTMLDivElement>(null);
	const pointerIdRef = useRef<number | null>(null);
	const centerRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		const coarse = window.matchMedia("(pointer: coarse)").matches;
		setIsTouch(coarse || navigator.maxTouchPoints > 0);
	}, []);

	const updateJoystick = (clientX: number, clientY: number) => {
		const base = baseRef.current;
		const knob = knobRef.current;
		if (!base || !knob) return;

		const maxDist = base.offsetWidth / 2 - knob.offsetWidth / 2;
		if (maxDist <= 0) return;

		let dx = clientX - centerRef.current.x;
		let dy = clientY - centerRef.current.y;
		const dist = Math.hypot(dx, dy);

		if (dist > maxDist) {
			dx = (dx / dist) * maxDist;
			dy = (dy / dist) * maxDist;
		}

		knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
		touchInput.moveX = dx / maxDist;
		touchInput.moveZ = -dy / maxDist; // up = forward
	};

	const resetJoystick = () => {
		pointerIdRef.current = null;
		touchInput.moveX = 0;
		touchInput.moveZ = 0;
		if (knobRef.current) {
			knobRef.current.style.transform = "translate(-50%, -50%)";
		}
	};

	const handleStart = (e: PointerEvent<HTMLDivElement>) => {
		const base = baseRef.current;
		if (!base) return;
		const rect = base.getBoundingClientRect();
		centerRef.current = {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		};
		pointerIdRef.current = e.pointerId;
		base.setPointerCapture(e.pointerId);
		updateJoystick(e.clientX, e.clientY);
	};

	const handleMove = (e: PointerEvent<HTMLDivElement>) => {
		if (pointerIdRef.current !== e.pointerId) return;
		updateJoystick(e.clientX, e.clientY);
	};

	const handleEnd = (e: PointerEvent<HTMLDivElement>) => {
		if (pointerIdRef.current !== e.pointerId) return;
		resetJoystick();
	};

	if (!isTouch || !visible) return null;

	return (
		<div className={styles.container}>
			<div
				ref={baseRef}
				className={styles.joystickBase}
				onPointerDown={handleStart}
				onPointerMove={handleMove}
				onPointerUp={handleEnd}
				onPointerCancel={handleEnd}
			>
				<div ref={knobRef} className={styles.joystickKnob} />
			</div>

			<div className={styles.buttons}>
				<button
					type="button"
					className={`${styles.button} ${styles.jumpButton}`}
					onPointerDown={() => {
						touchInput.jump = true;
					}}
					onPointerUp={() => {
						touchInput.jump = false;
					}}
					onPointerCancel={() => {
						touchInput.jump = false;
					}}
				>
					JUMP
				</button>

				<button
					type="button"
					className={`${styles.button} ${styles.throwButton}`}
					onPointerDown={() => {
						touchInput.throwQueued = true;
					}}
				>
					AXE
				</button>
			</div>
		</div>
	);
}
