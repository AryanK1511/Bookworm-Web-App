import React from "react";
import Link from "next/link";
import styles from "./HomePageBanner.module.css";

// ========== HOME PAGE BANNER COMPONENT ==========
const HomePageBanner = () => {
	return (
		<div className={`${styles.homePage} pb-16`}>
			{/* Title Section */}
			<div className="text-center mt-10 pt-16 pb-4">
				<h1
					className={`${styles.titleHeading} text-4xl font-bold mb-2`}
				>
					<span className={styles.orangeYellow}>B</span>
					<span className={styles.red}>o</span>
					<span className={styles.purple}>o</span>
					<span className={styles.pink}>k</span>
					<span className={styles.teal}>w</span>
					<span className={styles.orangeYellow}>o</span>
					<span className={styles.red}>r</span>
					<span className={styles.purple}>m</span>
				</h1>
				<p className="mb-4 text-xl">Explore, Track, Rate and Review</p>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-center space-x-4">
				<Link legacyBehavior href="/explore">
					<a className={`${styles.titleBtn} ${styles.btnVar1}`}>
						Get Started
					</a>
				</Link>
				<Link
					legacyBehavior
					href="https://github.com/AryanK1511/Bookworm-Web-App"
				>
					<a
						className={`${styles.titleBtn} ${styles.btnVar2}`}
						target="_blank"
					>
						GitHub Repo
					</a>
				</Link>
			</div>
		</div>
	);
};

export default HomePageBanner;
