"use client";

import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Rating</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">

              <td className="p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-14 w-14 rounded object-cover"
                />
              </td>

              <td className="p-4 font-medium">
                {product.title}
              </td>

              <td className="p-4">
                {product.category}
              </td>

              <td className="p-4">
                ${product.price}
              </td>

              <td className="p-4">
                ⭐ {product.rating}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                <div className="flex gap-2">

                  <Link
                    href={`/products/${product.id}`}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    View
                  </Link>

                  <Link
                    href={`/products/${product.id}/edit`}
                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}