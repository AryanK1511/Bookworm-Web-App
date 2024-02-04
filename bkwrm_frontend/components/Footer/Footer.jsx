import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import styles from "./Footer.module.css";

// ========== FOOTER COMPONENT ===========
const Footer = () => {
  return (
      <footer className={`${styles.footerBg} text-white py-4`}>
          <Container>
              <Row className="align-items-center justify-content-between">
                  <Col xs={12} md="auto" className="mb-2 mb-md-0 text-center text-md-left">
                      {/* Social Icons */}
                      <a href="https://github.com/AryanK1511" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
                          <GitHubIcon />
                      </a>
                      <a href="https://www.linkedin.com/in/aryan-khurana-239684229/" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
                          <LinkedInIcon />
                      </a>
                      <a href="https://twitter.com/AryanK1511" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
                          <XIcon />
                      </a>
                      <a href="https://www.youtube.com/channel/UCCrKswcxk_hCSXedUEOs7Fw" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
                          <YouTubeIcon />
                      </a>
                  </Col>

                  <Col xs={12} md="auto" className="mt-4 mt-md-0 text-center text-md-right">
                      {/* Copyright Text */}
                      <div className={styles.footerText}>
                          © 2024 Aryan Khurana. All rights reserved.
                      </div>
                  </Col>
              </Row>
          </Container>
      </footer>
  );
};

export default Footer;