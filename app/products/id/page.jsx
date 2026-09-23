"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct } from "../../../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">

        <Link
          href="/products"
          className="mb-6 inline-block rounded bg-gray-600 px-4 py-2 text-white"
        >
          ← Back
        </Link>

        <img
          src={product.thumbnail}
          alt={product.title}
          className="mb-6 h-64 w-full rounded-lg object-cover"
        />

        <h1 className="text-3xl font-bold">
          {product.title}
        </h1>

        <p className="mt-2 text-gray-500">
          {product.category}
        </p>

        <div className="mt-6 space-y-3">
          <p>
            <strong>Price:</strong> ${product.price}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {product.rating}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>

          <p>
            <strong>Description:</strong> {product.description}
          </p>
        </div>

        <Link
          href={`/products/${product.id}/edit`}
          className="mt-6 inline-block rounded bg-yellow-500 px-5 py-2 text-white"
        >
          Edit Product
        </Link>

      </div>
    </div>
  );
}