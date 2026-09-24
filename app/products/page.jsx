"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";

import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  deleteProduct,
} from "../../services/productService";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = useRef(0);

  const pageFromURL = Number(searchParams.get("page"));
  const limitFromURL = Number(searchParams.get("limit"));
  const searchFromURL = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [search, setSearch] = useState(searchFromURL);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromURL);
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [order, setOrder] = useState(
    searchParams.get("order") || "asc"
  );

  const [page, setPage] = useState(
    Number.isInteger(pageFromURL) && pageFromURL > 0
      ? pageFromURL
      : 1
  );

  const [limit, setLimit] = useState(
    [10, 20, 50].includes(limitFromURL) ? limitFromURL : 10
  );

  // User typing थांबवल्यावर 400ms ने search सुरू होईल.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // URL मध्ये page, limit, search, category आणि sort ठेवतो.
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (category) {
      params.set("category", category);
    }

    if (sort) {
      params.set("sort", sort);
      params.set("order", order);
    }

    router.replace(`/products?${params.toString()}`);
  }, [
    page,
    limit,
    debouncedSearch,
    category,
    sort,
    order,
    router,
  ]);

  // Login तपासतो आणि categories load करतो.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, [router]);

  // Products load करतो. जुन्या request चे results दुर्लक्ष होतात.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    let active = true;
    const currentRequest = ++requestId.current;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        let data;
        let result = [];
        let resultTotal = 0;

        if (debouncedSearch) {
          data = await searchProducts(debouncedSearch, 0, 0);
          result = data.products || [];

          if (category) {
            result = result.filter(
              (product) => product.category === category
            );
          }

          if (sort) {
            result.sort((a, b) => {
              let first = a[sort];
              let second = b[sort];

              if (sort === "title") {
                first = first.toLowerCase();
                second = second.toLowerCase();
              }

              if (first < second) return order === "asc" ? -1 : 1;
              if (first > second) return order === "asc" ? 1 : -1;
              return 0;
            });
          }

          resultTotal = result.length;

          const start = (page - 1) * limit;
          result = result.slice(start, start + limit);
        } else if (category) {
          data = await getProductsByCategory(
            category,
            limit,
            (page - 1) * limit
          );

          result = data.products || [];
          resultTotal = data.total || 0;
        } else {
          data = await getProducts(limit, (page - 1) * limit);

          result = data.products || [];
          resultTotal = data.total || 0;
        }

        // Request सुरू झाल्यानंतर नवीन request असेल तर जुना result दाखवू नको.
        if (!active || currentRequest !== requestId.current) return;

        setProducts(result);
        setTotal(resultTotal);
      } catch (err) {
        if (!active || currentRequest !== requestId.current) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products."
        );
      } finally {
        if (active && currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [
    page,
    limit,
    debouncedSearch,
    category,
    sort,
    order,
    retry,
  ]);

  function handleCategory(value) {
    setCategory(value);
    setPage(1);
  }

  function handleSort(value) {
    setSort(value);
    setPage(1);
  }

  function handleLimit(value) {
    setLimit(Number(value));
    setPage(1);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      window.alert(
        err?.message || "Failed to delete product."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-500">Manage your products</p>
          </div>

          <Link
            href="/products/new"
            className="rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white"
          >
            + Add Product
          </Link>
        </div>

        <div className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow md:grid-cols-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-lg border p-3"
          />

          <select
            value={category}
            onChange={(event) => handleCategory(event.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option
                key={item.slug || item}
                value={item.slug || item}
              >
                {item.name || item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => handleSort(event.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>

          <select
            value={order}
            onChange={(event) => {
              setOrder(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border p-3"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <select
            value={limit}
            onChange={(event) => handleLimit(event.target.value)}
            className="rounded-lg border p-3"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="mb-4 text-red-600">{error}</p>

            <button
              onClick={() => setRetry((value) => value + 1)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            No products found.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              onDelete={handleDelete}
            />

            <ProductCard
              products={products}
              onDelete={handleDelete}
            />

            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={handleLimit}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading products...</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}