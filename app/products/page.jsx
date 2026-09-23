"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || ""
  );

  const [order, setOrder] = useState(
    searchParams.get("order") || "asc"
  );

  const pageParam = Number(searchParams.get("page"));
  const limitParam = Number(searchParams.get("limit"));

  const [page, setPage] = useState(
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1
  );

  const [limit, setLimit] = useState(
    [10, 20, 50].includes(limitParam)
      ? limitParam
      : 10
  );

  const requestId = useRef(0);

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loadCategories();
  }, []);

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    loadProducts();
  }, [page, limit, search, category, sort, order]);


  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

 
  const loadProducts = async () => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");

    try {
      let data;
      let result = [];

      
      if (search.trim()) {
        data = await searchProducts(
          search.trim(),
          0,
          0
        );

        result = data.products || [];

      
        if (category) {
          result = result.filter(
            (product) =>
              product.category === category
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

            if (first < second) {
              return order === "asc" ? -1 : 1;
            }

            if (first > second) {
              return order === "asc" ? 1 : -1;
            }

            return 0;
          });
        }

       
        const start = (page - 1) * limit;
        const end = start + limit;

        result = result.slice(start, end);
      }

     
      else if (category) {
        data = await getProductsByCategory(
          category,
          limit,
          (page - 1) * limit
        );

        result = data.products || [];

      
        if (sort) {
          result.sort((a, b) => {
            let first = a[sort];
            let second = b[sort];

            if (sort === "title") {
              first = first.toLowerCase();
              second = second.toLowerCase();
            }

            if (first < second) {
              return order === "asc" ? -1 : 1;
            }

            if (first > second) {
              return order === "asc" ? 1 : -1;
            }

            return 0;
          });
        }
      }

      
      else {
        data = await getProducts(
          limit,
          (page - 1) * limit
        );

        result = data.products || [];

        if (sort) {
          result.sort((a, b) => {
            let first = a[sort];
            let second = b[sort];

            if (sort === "title") {
              first = first.toLowerCase();
              second = second.toLowerCase();
            }

            if (first < second) {
              return order === "asc" ? -1 : 1;
            }

            if (first > second) {
              return order === "asc" ? 1 : -1;
            }

            return 0;
          });
        }
      }

      if (currentRequest !== requestId.current) {
        return;
      }

      setProducts(result);

    } catch (error) {
      if (currentRequest !== requestId.current) {
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load products"
      );

    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  };

  const updateURL = (values = {}) => {
    const params = new URLSearchParams();

    const newPage = values.page ?? page;
    const newLimit = values.limit ?? limit;
    const newSearch = values.search ?? search;
    const newCategory = values.category ?? category;
    const newSort = values.sort ?? sort;
    const newOrder = values.order ?? order;

    params.set("page", newPage);
    params.set("limit", newLimit);

    if (newSearch) {
      params.set("search", newSearch);
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSort) {
      params.set("sort", newSort);
      params.set("order", newOrder);
    }

    router.push(
      `/products?${params.toString()}`
    );
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);

    updateURL({
      search: value,
      page: 1,
    });
  };

  const handleCategory = (value) => {
    setCategory(value);
    setPage(1);

    updateURL({
      category: value,
      page: 1,
    });
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(1);

    updateURL({
      sort: value,
      page: 1,
    });
  };

  const handleOrder = (value) => {
    setOrder(value);

    updateURL({
      order: value,
    });
  };

  const handlePage = (newPage) => {
    if (newPage < 1) return;

    setPage(newPage);

    updateURL({
      page: newPage,
    });
  };

  const handleLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1);

    updateURL({
      limit: newLimit,
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((current) =>
        current.filter(
          (product) => product.id !== id
        )
      );

    } catch (error) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="mx-auto max-w-7xl p-4 md:p-6">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Products
            </h1>

            <p className="text-gray-500">
              Manage your products
            </p>
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
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <select
            value={category}
            onChange={(e) =>
              handleCategory(e.target.value)
            }
            className="rounded-lg border p-3"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item.slug}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              handleSort(e.target.value)
            }
            className="rounded-lg border p-3"
          >
            <option value="">
              Sort By
            </option>

            <option value="price">
              Price
            </option>

            <option value="rating">
              Rating
            </option>

            <option value="title">
              Title
            </option>
          </select>

          <select
            value={order}
            onChange={(e) =>
              handleOrder(e.target.value)
            }
            className="rounded-lg border p-3"
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>

        </div>

        {loading && <Loader />}

        {!loading && error && (
          <div className="rounded-lg bg-white p-8 text-center shadow">

            <p className="mb-4 text-red-600">
              {error}
            </p>

            <button
              onClick={loadProducts}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Retry
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-lg bg-white p-10 text-center shadow">
              No products found.
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
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
                total={194}
                limit={limit}
                onPageChange={handlePage}
                onLimitChange={handleLimit}
              />
            </>
          )}

      </main>

    </div>
  );
}