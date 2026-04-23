"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { AdminCategory, AdminProduct, AdminProductImage, AdminProductVariant } from "@/components/admin/types";

type ProductFormPageProps = {
  productId?: string;
};

type ImageDraft = AdminProductImage;
type VariantDraft = AdminProductVariant & { skuError?: string };

const emptyVariant = (): VariantDraft => ({
  id: `new_${crypto.randomUUID()}`,
  name: "",
  price: 0,
  stock: 0,
  sku: "",
});

const emptyImage = (): ImageDraft => ({
  id: `new_${crypto.randomUUID()}`,
  url: "",
  isPrimary: false,
  sortOrder: 0,
});

function SortableImageRow({
  image,
  onChange,
  onPrimary,
  onRemove,
}: {
  image: ImageDraft;
  onChange: (value: string) => void;
  onPrimary: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="grid gap-3 rounded-md border border-slate-200 bg-white p-3 md:grid-cols-[auto_64px_minmax(0,1fr)_120px_auto] md:items-center">
      <button
        type="button"
        aria-label="Drag image"
        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-500"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="relative size-16 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        {image.url ? <Image src={image.url} alt="" fill className="object-cover" sizes="64px" /> : null}
      </div>
      <input
        value={image.url}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Image URL"
        className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="radio" checked={image.isPrimary} onChange={onPrimary} className="size-4 accent-slate-900" />
        Primary
      </label>
      <button
        type="button"
        aria-label="Remove image"
        onClick={onRemove}
        className="inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function ProductFormPage({ productId }: ProductFormPageProps) {
  const router = useRouter();
  const isEditing = Boolean(productId);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([emptyVariant()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const categoriesResponse = await fetch("/api/admin/categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories ?? []);
      setCategoryId((current) => current || categoriesData.categories?.[0]?.id || "");

      if (productId) {
        const productResponse = await fetch(`/api/admin/products/${productId}`);
        if (!productResponse.ok) {
          toast.error("Product not found.");
          router.push("/admin/products");
          return;
        }
        const data = (await productResponse.json()) as { product: AdminProduct };
        const product = data.product;
        setName(product.name);
        setDescription(product.description);
        setCategoryId(product.categoryId);
        setIsActive(product.isActive);
        setImages(product.images);
        setVariants(product.variants.map((variant) => ({ ...variant })));
      }
    }

    load();
  }, [productId, router]);

  const hasSkuErrors = useMemo(() => variants.some((variant) => Boolean(variant.skuError)), [variants]);

  function updateImage(id: string, patch: Partial<ImageDraft>) {
    setImages((current) => current.map((image) => (image.id === id ? { ...image, ...patch } : image)));
  }

  function removeImage(id: string) {
    setImages((current) => {
      const next = current.filter((image) => image.id !== id);
      if (next.length && !next.some((image) => image.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  }

  function setPrimaryImage(id: string) {
    setImages((current) => current.map((image) => ({ ...image, isPrimary: image.id === id })));
  }

  function updateVariant(id: string, patch: Partial<VariantDraft>) {
    setVariants((current) => current.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));
  }

  function removeVariant(id: string) {
    setVariants((current) => (current.length === 1 ? current : current.filter((variant) => variant.id !== id)));
  }

  async function validateSku(variant: VariantDraft) {
    if (!variant.sku.trim()) {
      updateVariant(variant.id, { skuError: "SKU is required." });
      return;
    }

    const duplicateInForm = variants.some(
      (item) => item.id !== variant.id && item.sku.trim().toLowerCase() === variant.sku.trim().toLowerCase()
    );

    if (duplicateInForm) {
      updateVariant(variant.id, { skuError: "SKU is already used in this form." });
      return;
    }

    const params = new URLSearchParams({ sku: variant.sku, excludeVariantId: variant.id });
    const response = await fetch(`/api/admin/products/sku?${params.toString()}`);
    const data = await response.json();
    updateVariant(variant.id, { skuError: data.unique ? undefined : "SKU already exists." });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((current) => {
      const oldIndex = current.findIndex((image) => image.id === active.id);
      const newIndex = current.findIndex((image) => image.id === over.id);
      return arrayMove(current, oldIndex, newIndex).map((image, index) => ({ ...image, sortOrder: index }));
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!categoryId) {
      toast.error("Choose a category.");
      return;
    }

    if (hasSkuErrors || variants.some((variant) => !variant.sku.trim())) {
      toast.error("Fix variant SKUs before saving.");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      description,
      categoryId,
      isActive,
      images: images.map((image, index) => ({
        id: image.id.startsWith("new_") ? undefined : image.id,
        url: image.url,
        isPrimary: image.isPrimary,
        sortOrder: index,
      })),
      variants: variants.map((variant) => ({
        id: variant.id.startsWith("new_") ? undefined : variant.id,
        name: variant.name,
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku,
      })),
    };

    const response = await fetch(isEditing ? `/api/admin/products/${productId}` : "/api/admin/products", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      toast.error("Unable to save product.");
      return;
    }

    toast.success("Product saved.");
    router.push("/admin/products");
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Product details, imagery, and sellable variants.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Product name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Description
          <textarea
            value={description}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="size-4 accent-slate-900"
          />
          Active
        </label>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Images</h2>
          <button
            type="button"
            onClick={() =>
              setImages((current) => [...current, { ...emptyImage(), isPrimary: current.length === 0, sortOrder: current.length }])
            }
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="size-4" />
            Add image
          </button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((image) => image.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {images.map((image) => (
                <SortableImageRow
                  key={image.id}
                  image={image}
                  onChange={(url) => updateImage(image.id, { url })}
                  onPrimary={() => setPrimaryImage(image.id)}
                  onRemove={() => removeImage(image.id)}
                />
              ))}
            </div>
            
          </SortableContext>
        </DndContext>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Variants</h2>
          <button
            type="button"
            onClick={() => setVariants((current) => [...current, emptyVariant()])}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="size-4" />
            Add row
          </button>
        </div>
        <div className="grid gap-3">
          {variants.map((variant) => (
            <div key={variant.id} className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_140px_120px_1fr_auto] md:items-start">
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
                <input
                  value={variant.name}
                  onChange={(event) => updateVariant(variant.id, { name: event.target.value })}
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
                <input
                  type="number"
                  min="0"
                  value={variant.price}
                  onChange={(event) => updateVariant(variant.id, { price: Number(event.target.value) })}
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(event) => updateVariant(variant.id, { stock: Number(event.target.value) })}
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                SKU
                <input
                  value={variant.sku}
                  onChange={(event) => updateVariant(variant.id, { sku: event.target.value, skuError: undefined })}
                  onBlur={() => validateSku(variant)}
                  className={[
                    "h-10 rounded-md border px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                    variant.skuError ? "border-red-300" : "border-slate-200",
                  ].join(" ")}
                />
                {variant.skuError ? <span className="text-xs normal-case tracking-normal text-red-600">{variant.skuError}</span> : null}
              </label>
              <button
                type="button"
                aria-label="Remove variant"
                onClick={() => removeVariant(variant.id)}
                className="mt-5 inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
