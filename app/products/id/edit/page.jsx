"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, updateProduct } from "../../../../services/productService";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        setForm({
          title: data.title || "",
          price: data.price || "",
          stock: data.stock || "",
          category: data.category || "",
          description: data.description || "",
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Enter valid price");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Enter valid stock");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateProduct(id, {
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        description: form.description,
      });

      router.push(`/products/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

        <h1 className="mb-6 text-2xl font-bold">
          Edit Product
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block font-medium">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Price
            </label>

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Stock
            </label>

            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Category
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}