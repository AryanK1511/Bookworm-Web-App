import React from 'react';
import Image from 'next/image';
import styles from './InfoBanner.module.css';

// =========== INFO BANNER COMPONENT ===========
const InfoBanner = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-16 mt-4">
          Enhance Your Reading Experience
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8 mb-24">
          {/* Explore Books Feature */}
          <div className="flex-1 text-center space-y-4">
            <div className="inline-block relative w-60 h-60">
              {/* Replace with your image path */}
              <Image src="/assets/images/img-1.png" layout="fill" objectFit="contain" alt="Explore Books" />
            </div>
            <h3 className="text-2xl font-semibold">Explore Books</h3>
            <p className={styles.pText}>
              Discover a vast selection of books from all around the world.
            </p>
          </div>

          {/* Share Thoughts Feature */}
          <div className="flex-1 text-center space-y-4">
            <div className="inline-block relative w-60 h-60">
              {/* Replace with your image path */}
              <Image src="/assets/images/img-2.png" layout="fill" objectFit="contain" alt="Share Thoughts" />
            </div>
            <h3 className="text-2xl font-semibold">Share Your Thoughts</h3>
            <p className={styles.pText}>
              Connect and share your reviews with a community of readers worldwide.
            </p>
          </div>

          {/* Create Reading Lists Feature */}
          <div className="flex-1 text-center space-y-4">
            <div className="inline-block relative w-60 h-60">
              {/* Replace with your image path */}
              <Image src="/assets/images/img-3.png" layout="fill" objectFit="contain" alt="Reading Lists" />
            </div>
            <h3 className="text-2xl font-semibold">Track Your Journey</h3>
            <p className={styles.pText}>
              Create personalized reading lists and keep track of your reading milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
