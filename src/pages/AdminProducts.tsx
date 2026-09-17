import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Boxes,
  Edit3,
  ImageIcon,
  ImagePlus,
  LoaderCircle,
  PackagePlus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../services/productService";

import type { ProductPayload } from "../services/productService";

import { uploadProductImage } from "../services/uploadService";

import type { Product } from "../types/product";

const emptyForm: ProductPayload = {
  name: "",
  description: "",
  price: 0,
  category: "",
  images: [],
  stock: 0,
  brand: "",
  ratings: 0,
  isFeatured: false,
};

const AdminProducts = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductPayload>(emptyForm);

  const [imageUrl, setImageUrl] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.category, product.brand].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [products, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: products.length,

      featured: products.filter((product) => product.isFeatured).length,

      outOfStock: products.filter((product) => product.stock === 0).length,

      lowStock: products.filter(
        (product) => product.stock > 0 && product.stock <= 5,
      ).length,
    };
  }, [products]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageUrl("");
    setSelectedImage(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      stock: product.stock,
      brand: product.brand,
      ratings: product.ratings,
      isFeatured: product.isFeatured,
    });

    setImageUrl(product.images[0] || "");

    setSelectedImage(null);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving || uploadingImage) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageUrl("");
    setSelectedImage(null);
    setError("");
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    if (name === "price" || name === "stock" || name === "ratings") {
      setFormData((current) => ({
        ...current,
        [name]: Number(value),
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image must be 5MB or smaller.");

      event.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImageUrl(previewUrl);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError("Please choose an image first.");
      return;
    }

    if (!token) {
      setError("Admin authentication is required.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const data = await uploadProductImage(selectedImage, token);

      setImageUrl(data.image.url);

      setFormData((current) => ({
        ...current,
        images: [data.image.url],
      }));

      setSelectedImage(null);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Unable to upload image.");
      } else {
        setError("Unable to upload image.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.brand.trim()
    ) {
      return "Please complete all required product fields.";
    }

    if (formData.description.trim().length < 10) {
      return "Description must be at least 10 characters.";
    }

    if (formData.price < 0) {
      return "Price cannot be negative.";
    }

    if (formData.stock < 0) {
      return "Stock cannot be negative.";
    }

    if ((formData.ratings ?? 0) < 0 || (formData.ratings ?? 0) > 5) {
      return "Rating must be between 0 and 5.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Admin authentication is required.");

      return;
    }

    if (uploadingImage) {
      setError("Please wait for the image upload to finish.");

      return;
    }

    if (selectedImage) {
      setError("You selected an image but have not uploaded it yet.");

      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload: ProductPayload = {
        ...formData,

        name: formData.name.trim(),

        description: formData.description.trim(),

        category: formData.category.trim(),

        brand: formData.brand.trim(),

        images: formData.images,
      };

      if (editingProduct) {
        const updated = await updateProduct(editingProduct._id, payload, token);

        setProducts((current) =>
          current.map((product) =>
            product._id === updated._id ? updated : product,
          ),
        );
      } else {
        const created = await createProduct(payload, token);

        setProducts((current) => [created, ...current]);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
      setImageUrl("");
      setSelectedImage(null);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Unable to save product.");
      } else {
        setError("Unable to save product.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product._id);
      setError("");

      await deleteProduct(product._id, token);

      setProducts((current) =>
        current.filter((item) => item._id !== product._id),
      );
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Unable to delete product.");
      } else {
        setError("Unable to delete product.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        text: "Out of stock",
        className: "bg-red-500/10 text-red-400",
      };
    }

    if (stock <= 5) {
      return {
        text: `Low stock (${stock})`,
        className: "bg-amber-500/10 text-amber-400",
      };
    }

    return {
      text: `${stock} in stock`,
      className: "bg-green-500/10 text-green-400",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 lg:min-h-screen">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-green-500" />

          <p className="mt-4 text-sm text-slate-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================
            HEADER
        ======================================= */}

        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
              Inventory
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Product Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base">
              Add products, upload images, update inventory and manage your
              SUMART catalogue.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-400 sm:w-fit"
          >
            <PackagePlus size={18} />
            Add Product
          </button>
        </div>

        {/* ======================================
            STATS
        ======================================= */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">Total Products</p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">{stats.total}</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">Featured</p>

            <p className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
              {stats.featured}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">Low Stock</p>

            <p className="mt-2 text-2xl font-bold text-amber-400 sm:text-3xl">
              {stats.lowStock}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">Out of Stock</p>

            <p className="mt-2 text-2xl font-bold text-red-400 sm:text-3xl">
              {stats.outOfStock}
            </p>
          </article>
        </section>

        {/* ======================================
            PAGE ERROR
        ======================================= */}

        {error && !showForm && (
          <div
            role="alert"
            className="mt-5 wrap-break-word rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-4 text-sm leading-6 text-red-300 sm:mt-6 sm:px-5"
          >
            {error}
          </div>
        )}

        {/* ======================================
            SEARCH
        ======================================= */}

        <div className="mt-6 flex min-h-12 min-w-0 items-center rounded-2xl border border-slate-800 bg-slate-900 px-3 transition focus-within:border-green-500 sm:mt-8 sm:px-4">
          <Search size={19} className="shrink-0 text-slate-500" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name, category or brand..."
            className="min-w-0 w-full bg-transparent px-3 py-3.5 text-base text-white outline-none placeholder:text-slate-600 sm:py-4 sm:text-sm"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 sm:text-sm">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{products.length}</span>{" "}
            products
          </p>

          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-green-400 transition hover:text-green-300"
            >
              Clear search
            </button>
          )}
        </div>

        {/* ======================================
            PRODUCT LIST
        ======================================= */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:mt-6">
          {filteredProducts.length === 0 ? (
            <div className="px-4 py-10 text-center sm:p-14">
              <Boxes
                size={40}
                className="mx-auto text-slate-700 sm:h-10.5 sm:w-10.5"
              />

              <h2 className="mt-4 text-lg font-bold sm:text-xl">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try changing your search or add a new product.
              </p>

              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-green-500/50 hover:text-green-400"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                return (
                  <article
                    key={product._id}
                    className="p-4 transition hover:bg-slate-800/40 sm:p-5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 lg:items-center">
                      {/* Image */}

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 sm:h-24 sm:w-24 sm:rounded-2xl">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={24} className="text-slate-600" />
                        )}
                      </div>

                      {/* Product information */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                          <h2 className="line-clamp-2 text-sm font-bold leading-5 text-white sm:text-lg">
                            {product.name}
                          </h2>

                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-green-400 sm:px-2.5 sm:text-[11px]">
                              <Star size={10} />
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                          {product.brand} • {product.category}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${stockStatus.className}`}
                          >
                            {stockStatus.text}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                            <Star size={13} className="text-amber-400" />

                            {product.ratings.toFixed(1)}
                          </span>
                        </div>

                        {/* Mobile price */}

                        <p className="mt-2.5 text-base font-bold text-white lg:hidden">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Desktop price */}

                      <div className="hidden shrink-0 lg:block lg:w-40">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Price
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Desktop actions */}

                      <div className="hidden shrink-0 items-center gap-2 lg:flex">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          {deletingId === product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>

                    {/* Mobile / tablet actions */}

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/70 pt-4 lg:hidden">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product._id}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === product._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ========================================
          CREATE / EDIT PRODUCT MODAL
      ========================================= */}

      {showForm && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-700 bg-slate-900 shadow-2xl sm:max-h-[92vh] sm:max-w-3xl sm:rounded-3xl">
            {/* Modal header */}

            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-xs">
                  Inventory
                </p>

                <h2 className="mt-1 truncate text-xl font-bold sm:text-2xl">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving || uploadingImage}
                aria-label="Close product form"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* Scrollable form */}

            <form
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
                {/* Form error */}

                {error && (
                  <div
                    role="alert"
                    className="wrap-break-word rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-4 text-sm leading-6 text-red-300 sm:px-5"
                  >
                    {error}
                  </div>
                )}

                {/* ==================================
                    BASIC INFORMATION
                =================================== */}

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div>
                    <label
                      htmlFor="product-name"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Product name *
                    </label>

                    <input
                      id="product-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Product name"
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-brand"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Brand *
                    </label>

                    <input
                      id="product-brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Brand"
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-category"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Category *
                    </label>

                    <input
                      id="product-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Electronics"
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-price"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Price (₦) *
                    </label>

                    <input
                      id="product-price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-stock"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Stock *
                    </label>

                    <input
                      id="product-stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-rating"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Rating
                    </label>

                    <input
                      id="product-rating"
                      name="ratings"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.ratings}
                      onChange={handleInputChange}
                      className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* ==================================
                    PRODUCT IMAGE
                =================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Product Image
                  </label>

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-4 sm:p-5">
                    <div className="grid gap-2.5 sm:flex sm:items-center sm:gap-4">
                      <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-green-500/50 hover:text-green-400">
                        <ImagePlus size={17} />
                        Choose Image
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={!selectedImage || uploadingImage}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                      >
                        {uploadingImage ? (
                          <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadCloud size={17} />
                            Upload Image
                          </>
                        )}
                      </button>
                    </div>

                    {selectedImage && (
                      <div className="mt-3 rounded-xl bg-slate-900 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          Selected
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {selectedImage.name}
                        </p>
                      </div>
                    )}

                    {formData.images.length > 0 && !selectedImage && (
                      <p className="mt-3 text-xs font-medium text-green-400">
                        Image uploaded successfully.
                      </p>
                    )}

                    {imageUrl && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:mt-5">
                        <img
                          src={imageUrl}
                          alt="Product preview"
                          className="h-48 w-full object-contain sm:h-56"
                        />
                      </div>
                    )}

                    <p className="mt-3 text-xs leading-5 text-slate-600 sm:mt-4">
                      JPG, PNG or WEBP. Maximum file size: 5MB.
                    </p>
                  </div>
                </div>

                {/* ==================================
                    DESCRIPTION
                =================================== */}

                <div>
                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Description *
                  </label>

                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe the product..."
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-base leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-green-500 sm:text-sm"
                  />
                </div>

                {/* ==================================
                    FEATURED
                =================================== */}

                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950 p-4 sm:items-center">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">Featured Product</p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      Show this product prominently in SUMART.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        isFeatured: event.target.checked,
                      }))
                    }
                    className="mt-0.5 h-5 w-5 shrink-0 accent-green-500 sm:mt-0"
                  />
                </label>
              </div>

              {/* ==================================
                  MODAL ACTIONS
              =================================== */}
              <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur sm:px-6">
                {selectedImage && !uploadingImage && (
                  <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
                    <p className="text-xs leading-5 text-amber-300">
                      You selected an image. Upload it before creating the
                      product.
                    </p>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving || uploadingImage}
                    className="min-h-12 w-full rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving || uploadingImage || Boolean(selectedImage)
                    }
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 sm:w-auto"
                  >
                    {saving && (
                      <LoaderCircle size={17} className="animate-spin" />
                    )}

                    {saving
                      ? "Saving..."
                      : selectedImage
                        ? "Upload Image First"
                        : editingProduct
                          ? "Save Changes"
                          : "Create Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
