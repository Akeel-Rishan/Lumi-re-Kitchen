import type { Metadata } from "next";
import { restaurant } from "@/config/restaurant";
import "./globals.css";

export const metadata: Metadata = {
  title: restaurant.name,
  description: `${restaurant.name}. ${restaurant.demoNotice}`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={restaurant.locale}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-shell">
          <header className="site-header">
            <span className="wordmark">{restaurant.name}</span>
            <span className="location">{restaurant.location}</span>
          </header>
          {children}
          <footer className="site-footer">
            <p className="disclosure">{restaurant.disclosure}</p>
            <p>{restaurant.demoNotice}</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
