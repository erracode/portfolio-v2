export interface LinkItem {
	id: string;
	title: string;
	url: string;
	icon: string;
	description?: string;
	type: "social" | "project" | "contact";
}

export interface ProfileData {
	name: string;
	title: string;
	bio: string;
	avatar: string;
	location: string;
}

export const profileData: ProfileData = {
	name: "Jesús Díaz",
	title: "Software Engineer",
	bio: "Full-stack developer passionate about building modern web applications with React, Next.js, and Node.js.",
	avatar: "/me.png",
	location: "Colombia 🇨🇴",
};

export const socialLinks: LinkItem[] = [
	{
		id: "github",
		title: "GitHub",
		url: "https://github.com/erracode",
		icon: "/github-logo.svg",
		description: "Check out my open source projects",
		type: "social",
	},
	{
		id: "linkedin",
		title: "LinkedIn",
		url: "https://www.linkedin.com/in/jesus-diaz-erracode/",
		icon: "/linkedin-logo.png",
		description: "Let's connect professionally",
		type: "social",
	},
];

export const contactLinks: LinkItem[] = [
	{
		id: "email",
		title: "Email Me",
		url: "mailto:jdiaz.97ma@gmail.com",
		icon: "/email-icon.svg",
		description: "jdiaz.97ma@gmail.com",
		type: "contact",
	},
];

export const featuredProjects: LinkItem[] = [
	{
		id: "point-party",
		title: "Point Party - Planning Poker",
		url: "https://story-point-poker-react.pages.dev/",
		icon: "/react-logo.png",
		description: "Free Planning Poker app for agile teams",
		type: "project",
	},
	{
		id: "enchanted-thoughts",
		title: "Enchanted Thoughts",
		url: "#",
		icon: "/nextjs-logo.png",
		description: "AI-powered holiday card generator",
		type: "project",
	},
	{
		id: "cinemark",
		title: "Cinemark Colombia",
		url: "#",
		icon: "/nextjs-logo.png",
		description: "Official website with ticket purchasing",
		type: "project",
	},
	{
		id: "portfolio",
		title: "Interactive 3D Portfolio",
		url: "https://erracode.pages.dev/",
		icon: "/react-logo.png",
		description: "Explore my full portfolio (3D experience)",
		type: "project",
	},
];

export const allLinks: LinkItem[] = [
	...socialLinks,
	...contactLinks,
	...featuredProjects,
];
