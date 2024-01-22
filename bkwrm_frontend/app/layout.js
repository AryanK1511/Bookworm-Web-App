import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Bookworm Web App",
  description: "Created by Aryan Khurana",
};

export default function RootLayout({ children }) {
  const dummyUser = {
    "username": "JohDoe",
    "password_hash": "$pbkdf2-sha256$29000$j3Hu/R8jxHjv/d8bw3gPwQ$dq.RBSoKbZIMPYwHczuq1WuHmzc7LrMSEAyRaBGWics",
    "email": "jd@gmail.com",
    "date_joined": "2024-01-20 22:47:32.052894",
    "profile_picture": "/assets/images/default_profile_pic.jpg",
    "role": "user"
  }
  return (
    <html lang="en">
      <body>
        <Navbar user={dummyUser} />
        {children}
      </body>
    </html>
  );
}
