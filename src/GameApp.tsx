import React, { useState, useCallback } from "react";
import Game from "./components/Game";
import { ExperienceOverlay } from "./components/halls/experience-hall/experience-overlay";
import { portfolioItems } from "./data/portfolioData";
import "./index.css";
import { Link } from "react-router-dom";
import { ContactOverlay } from "./components/contact-overlay";
import { ProjectOverlay } from "./components/halls/project-hall/project-overlay";
import appStyles from "./components/ui/AppOverlay.module.css";
import MessageDialog from "./components/ui/MessageDialog";

function GameApp() {
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [selectedExperience, setSelectedExperience] = useState<string | null>(
		null,
	);
	const [contactOpen, setContactOpen] = useState(false);
	const [dialogQueue, setDialogQueue] = useState<string[]>([
		"Welcome to my portfolio website!",
		"Feel free to explore by clicking on objects.",
	]);
	const [dialogIndex, setDialogIndex] = useState(0);

	const isModalOpen = !!selectedProject || !!selectedExperience || contactOpen;

	const handleDialogTrigger = useCallback((msg: string) => {
		if (msg === "CONTACT_REQUEST") {
			setContactOpen(true);
		} else {
			setDialogQueue((prev) => [...prev, msg]);
		}
	}, []);

	return (
		<div className={appStyles.container}>
			{/* Skip link for accessibility */}
			<a href="#main-content" className="sr-only">
				Skip to main content
			</a>

			{/* Link to simple version */}
			<Link
				to="/links"
				className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
				aria-label="View simple link page (accessible version)"
			>
				📱 Simple View
			</Link>

			{/* 3D world */}
			<main id="main-content">
				<Game
					onProjectActivate={setSelectedProject}
					onExperienceActivate={setSelectedExperience}
					onDialog={handleDialogTrigger}
					paused={isModalOpen}
				/>
			</main>

			{/* Show welcome/dialog messages, click to advance */}
			{dialogIndex < dialogQueue.length && (
				<MessageDialog
					message={dialogQueue[dialogIndex] ?? ""}
					onNext={() => setDialogIndex((i) => i + 1)}
				/>
			)}

			{contactOpen && (
				<ContactOverlay
					isOpen={contactOpen}
					onClose={() => setContactOpen(false)}
				/>
			)}

			{selectedProject && (
				<div className={appStyles.panel}>
					<ProjectOverlay
						project={
							portfolioItems.find((item) => item.id === selectedProject) ?? null
						}
						onClose={() => setSelectedProject(null)}
					/>
				</div>
			)}

			{selectedExperience && (
				<div className={appStyles.panel}>
					<ExperienceOverlay
						experienceId={selectedExperience}
						onClose={() => setSelectedExperience(null)}
					/>
				</div>
			)}
		</div>
	);
}

export default GameApp;
