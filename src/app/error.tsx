"use client";

import Link from "next/link";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main id="main-content" className="page-content" tabIndex={-1}>
      <p className="eyebrow">Something went wrong</p>
      <h1>We couldn’t load this page.</h1>
      <p className="introduction">
        Please try again, or return to the welcome page.
      </p>
      <div className="recovery-actions">
        <button className="action" onClick={() => retry()}>
          Try again
        </button>
        <Link className="action action-secondary" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
