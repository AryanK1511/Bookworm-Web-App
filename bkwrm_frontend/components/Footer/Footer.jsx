import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import "./Footer.css";

// ========== FOOTER COMPONENT ===========
const Footer = () => {
    return (
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between md:flex-row text-sm">
          <div className="flex mb-2 md:mb-0 space-x-4">

            {/* Social Icons */}
            <a href="https://github.com/AryanK1511" target="_blank" className="footer-icon">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/aryan-khurana-239684229/" target="_blank" className="footer-icon">
              <LinkedInIcon />
            </a>
            <a href="https://twitter.com/AryanK1511" target="_blank" className="footer-icon">
              <XIcon />
            </a>
            <a href="https://www.youtube.com/channel/UCCrKswcxk_hCSXedUEOs7Fw" target="_blank" className="footer-icon">
              <YouTubeIcon />
            </a>
          </div>

          {/* Copyright Text */}
          <div className="text-center md:text-right footer-text mt-4 md:mt-0">
            © 2024 Aryan Khurana. All rights reserved.
          </div>

        </div>
      </footer>
    );
};

export default Footer;
