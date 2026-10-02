import { restaurant } from "@/config/restaurant";

export default function Home() {
  return (
    <main id="main-content" className="page-content" tabIndex={-1}>
      <p className="eyebrow">Good food. Good company.</p>
      <h1 className="display-heading">{restaurant.name}</h1>
      <p className="introduction">{restaurant.introduction}</p>
      <p className="reservation-note">{restaurant.reservationNotice}</p>
    </main>
  );
}
