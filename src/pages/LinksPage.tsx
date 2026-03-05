import { LinkCard } from "../components/links/LinkCard";
import { ProfileHeader } from "../components/links/ProfileHeader";
import {
	contactLinks,
	featuredProjects,
	profileData,
	socialLinks,
} from "../data/linksData";
import styles from "./LinksPage.module.css";

export function LinksPage() {
	return (
		<main className={styles.container}>
			<div className={styles.content}>
				<ProfileHeader profile={profileData} />

				<nav className={styles.links} aria-label="Social and contact links">
					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Connect</h2>
						{socialLinks.map((link) => (
							<LinkCard key={link.id} link={link} />
						))}
					</section>

					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Contact</h2>
						{contactLinks.map((link) => (
							<LinkCard key={link.id} link={link} />
						))}
					</section>

					<section className={styles.section}>
						<h2 className={styles.sectionTitle}>Featured Projects</h2>
						{featuredProjects.map((link) => (
							<LinkCard key={link.id} link={link} />
						))}
					</section>
				</nav>

				<footer className={styles.footer}>
					<p>
						Made with 💜 by{" "}
						<a
							href="https://erracode.pages.dev/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Jesús Díaz
						</a>
					</p>
				</footer>
			</div>
		</main>
	);
}
