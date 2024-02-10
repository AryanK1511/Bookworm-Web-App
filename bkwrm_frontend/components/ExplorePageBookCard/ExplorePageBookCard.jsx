import React, { useEffect } from "react";
import Link from "next/link";
import { addBookToReadingList } from "@/lib/readingList";
import { useRouter } from "next/router";
import styles from "./ExplorePageBookCard.module.css";

// ========== BOOK CARD COMPONENT COMPONENT ===========
const ExplorePageBookCard = ({ book }) => {
	const router = useRouter();

	// Define a state variable to track the result of the async operation
	const [isAddingBook, setIsAddingBook] = React.useState(false);

	// Add book to reading list
	const handleBookAddition = async () => {
		setIsAddingBook(true); // Set loading state

		try {
			// Call the add function
			const response = await addBookToReadingList(book);

			// Check if login is successful
			if (response.success) {
				// Redirect to the users reading list
				router.push("/reading-list");
			} else {
				console.error(
					"Addition of book to reading list failed:",
					response.message,
				);
				router.push("/explore");
			}
		} catch (error) {
			console.error("Error adding book to reading list:", error);
			setIsAddingBook(false); // Reset loading state on error
		}
	};

	useEffect(() => {
		setIsAddingBook(false); // Reset loading state when the component unmounts
	}, []);

	return (
		<div
			className={`${styles.bookCard} bg-dark rounded overflow-hidden shadow-lg`}
		>
			<img
				className="w-full h-72 object-cover"
				src={
					book.volumeInfo.imageLinks?.thumbnail ||
					"/default_book_image_url"
				}
				alt={book.volumeInfo.title}
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2 text-white">
					{book.volumeInfo.title}
				</div>
				<p className="text-gray-400 text-base">
					{book.volumeInfo.authors?.join(", ")}
				</p>
			</div>
			<div className={`${styles.buttonContainer} px-6 pt-4 pb-2`}>
				<button className={`${styles.btn} ${styles.btn1}`}>
					<Link href={`/explore/${book.id}`} legacyBehavior>
						<a>View</a>
					</Link>
				</button>
				<button
					onClick={handleBookAddition}
					className={`${styles.btn} ${styles.btn2}`}
					disabled={isAddingBook} // Disable the button during the async operation
				>
					{isAddingBook ? "Adding..." : "Add to Reading List"}
				</button>
			</div>
		</div>
	);
};

export default ExplorePageBookCard;
