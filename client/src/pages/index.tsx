import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <main className="flex flex-col gap-y-4">
        <h2 className="font-bold text-white text-2xl text-center">
          ISO List Demo
        </h2>

        <Link
          className="px-6 py-2 text text-center font-semibold text-zinc-900 transition-colors overflow-hidden rounded-xl bg-white hover:bg-zinc-200 hover:text-gray-700 focus:relative"
          href={`/countries`}
        >
          Countries
        </Link>

        <Link
          className="px-6 py-2 text text-center font-semibold text-zinc-900 transition-colors overflow-hidden rounded-xl bg-white hover:bg-zinc-200 hover:text-gray-700 focus:relative"
          href={`/currencies`}
        >
          Currencies
        </Link>
      </main>
    </div>
  );
}
