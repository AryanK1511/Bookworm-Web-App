import React from "react";
import Link from "next/link";

const ExplorePageBookCard = ({ book }) => {
    return (
        <div className="bg-dark rounded overflow-hidden shadow-lg">
            <img className="w-full h-72 object-cover" src={book.volumeInfo.imageLinks?.thumbnail || '/default_book_image_url'} alt={book.volumeInfo.title} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-white">{book.volumeInfo.title}</div>
                <p className="text-gray-400 text-base">
                    {book.volumeInfo.authors?.join(', ')}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <Link href={`/explore/${book.id}`} legacyBehavior>
                    <a className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Read more...</a>
                </Link>
                <button className="inline-block border border-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 hover:border-gray-400">Add to Reading List</button>
            </div>
        </div>
    );
};

export default ExplorePageBookCard;
