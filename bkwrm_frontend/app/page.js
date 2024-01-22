import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page pb-16">
      {/* Title Section */}
      <div className="text-center mt-10 pt-16 pb-4">
        <h1 className="title-heading text-4xl font-bold mb-2">
          <span id="orange-yellow">B</span>
          <span id="red">o</span>
          <span id="purple">o</span>
          <span id="pink">k</span>
          <span id="teal">w</span>
          <span id="orange-yellow">o</span>
          <span id="red">r</span>
          <span id="purple">m</span>
        </h1>
        <p className="mb-4 text-xl">Explore, Track, Rate and Review</p>
      </div>
        
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Link legacyBehavior href="/register">
          <a className="title-btn" id="btn-var-1">
            Get Started
          </a>
        </Link>
        <Link legacyBehavior href="/learn-more">
          <a className="title-btn" id="btn-var-2">
            Learn More
          </a>
        </Link>
      </div>
    </div>
  );
}
