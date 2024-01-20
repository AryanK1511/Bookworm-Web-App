import "./globals.css";

export const metadata = {
  title: "Bookworm Web App",
  description: "Created by Aryan Khurana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
