import type { LinkItem } from "../../data/linksData";
import styles from "./LinkCard.module.css";

interface LinkCardProps {
	link: LinkItem;
}

export function LinkCard({ link }: LinkCardProps) {
	const isExternal =
		link.url.startsWith("http") || link.url.startsWith("mailto");

	return (
		<a
			href={link.url}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			className={styles.card}
			aria-label={`${link.title}${link.description ? ` - ${link.description}` : ""}`}
		>
			<div className={styles.iconWrapper}>
				<img src={link.icon} alt="" className={styles.icon} loading="lazy" />
			</div>
			<div className={styles.content}>
				<span className={styles.title}>{link.title}</span>
				{link.description && (
					<span className={styles.description}>{link.description}</span>
				)}
			</div>
			<div className={styles.arrow}>→</div>
		</a>
	);
}
