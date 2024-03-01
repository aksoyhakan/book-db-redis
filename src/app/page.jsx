import { client } from "@/lib/db";
import Link from "next/link";

const getBooks = async () => {
  const result = await client.zRangeWithScores("books", 0, -1);

  const books = await Promise.all(
    result.map((b) => {
      return client.json.get(`books:${b.score}`);
    })
  );

  return books;
};

export default async function Home() {
  const books = await getBooks();

  return (
    <main>
      <nav className="flex justify-between">
        <h1 className="font-bold">Books on Redis!</h1>
        <Link href="/create" className="btn">
          Add a new book
        </Link>
      </nav>

      {books.map((book) => (
        <div key={book?.title} className="card">
          <h2>{book?.title}</h2>
          <p>By {book?.detail.author}</p>
          <p>{book?.detail.blurb}</p>
          <p>Rating: {book?.detail.rating}</p>
        </div>
      ))}
    </main>
  );
}
