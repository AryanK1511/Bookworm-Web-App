import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Bookworm Web App",
  description: "Created by Aryan Khurana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar user={null} />
        {children}
      </body>
    </html>
  );
}
