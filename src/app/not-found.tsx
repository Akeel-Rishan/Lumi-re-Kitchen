import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-content" tabIndex={-1}>
      <p className="eyebrow">Page not found</p>
      <h1>This page isn’t here.</h1>
      <p className="introduction">
        The link may have changed. You can return to our welcome page.
      </p>
      <Link className="action" href="/">
        Back to home
      </Link>
    </main>
  );
}
