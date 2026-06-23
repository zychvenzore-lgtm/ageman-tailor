import { BookClient } from "@/components/scheduler/BookClient";

export default function BookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
          Bespoke Fitting Studio
        </h1>
        <p className="text-sm font-light text-[#0C0A09]/60 max-w-lg mx-auto">
          Schedule a private appointment with our master tailors. We will take your exact measurements and discuss custom cuts in our Yogyakarta or Surakarta studios.
        </p>
      </div>

      <BookClient />
    </div>
  );
}
