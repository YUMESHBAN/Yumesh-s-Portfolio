import Link from "next/link";

export default function NotFound() {
  return (
    <section className="site-section flex min-h-screen items-center">
      <div className="site-container max-w-2xl text-center">
        <p className="site-eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">This page is not published.</h1>
        <p className="site-muted mt-4">Try the project index or return home.</p>
        <Link href="/" className="site-button-primary mt-8">
          Go home
        </Link>
      </div>
    </section>
  );
}
