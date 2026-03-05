import type { ProfileData } from "../../data/linksData";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
	profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
	return (
		<header className={styles.header}>
			<img
				src={profile.avatar}
				alt={`${profile.name} avatar`}
				className={styles.avatar}
				width={96}
				height={96}
			/>
			<h1 className={styles.name}>{profile.name}</h1>
			<p className={styles.title}>{profile.title}</p>
			<p className={styles.location}>{profile.location}</p>
			<p className={styles.bio}>{profile.bio}</p>
		</header>
	);
}
