"use client";

import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="grid gap-4 md:hidden">

      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl bg-white p-4 shadow"
        >

          <img
            src={product.thumbnail}
            alt={product.title}
            className="mb-4 h-48 w-full rounded-lg object-cover"
          />

          <h2 className="text-lg font-bold">
            {product.title}
          </h2>

          <p className="text-sm text-gray-500">
            {product.category}
          </p>

          <div className="mt-3 space-y-1">
            <p>Price: ${product.price}</p>
            <p>Rating: ⭐ {product.rating}</p>
            <p>Stock: {product.stock}</p>
          </div>

          <div className="mt-4 flex gap-2">

            <Link
              href={`/products/${product.id}`}
              className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
            >
              View
            </Link>

            <Link
              href={`/products/${product.id}/edit`}
              className="rounded bg-yellow-500 px-3 py-2 text-sm text-white"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(product.id)}
              className="rounded bg-red-500 px-3 py-2 text-sm text-white"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}