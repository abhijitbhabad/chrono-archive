import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import "./globals.css";

export const metadata = {
  title: "Chrono-Archive",
  description: "A Temporal Museum of Forgotten Digital Artifacts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}