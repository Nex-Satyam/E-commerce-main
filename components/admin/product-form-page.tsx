"use client";

import Image from "next/image";
<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> origin/main
import { useRouter } from "next/navigation";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
<<<<<<< HEAD
import type { AdminCategory, AdminProduct, AdminProductImage, AdminProductVariant } from "@/components/admin/types";
=======
import type { AdminCategory, AdminProduct } from "@/components/admin/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
>>>>>>> origin/main

type ProductFormPageProps = {
  productId?: string;
};

<<<<<<< HEAD
type ImageDraft = AdminProductImage;
type VariantDraft = AdminProductVariant & { skuError?: string };

const emptyVariant = (): VariantDraft => ({
=======
const variantSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  stock: z.coerce.number().min(0, "Stock must be >= 0"),
  sku: z.string().min(1, "SKU is required"),
  skuError: z.string().optional()
});

const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  isPrimary: z.boolean(),
  sortOrder: z.number()
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(imageSchema),
  variants: z.array(variantSchema).min(1, "At least one variant is required")
}).superRefine((data, ctx) => {
  const skus = data.variants.map(v => v.sku.trim().toLowerCase()).filter(Boolean);
  if (skus.length !== new Set(skus).size) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Duplicate SKUs found",
      path: ["variants"]
    });
  }
});

type ProductFormValues = z.infer<typeof productSchema>;

const emptyVariant = () => ({
>>>>>>> origin/main
  id: `new_${crypto.randomUUID()}`,
  name: "",
  price: 0,
  stock: 0,
  sku: "",
<<<<<<< HEAD
});

const emptyImage = (): ImageDraft => ({
=======
  skuError: undefined
});

const emptyImage = () => ({
>>>>>>> origin/main
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
<<<<<<< HEAD
  image: ImageDraft;
=======
  image: { id: string; url: string; isPrimary: boolean };
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      isActive: true,
      images: [],
      variants: [emptyVariant()],
    },
    mode: "onChange"
  });

  const { append: appendImage, remove: removeImage, move: moveImage, update: updateImage } = useFieldArray({
    control,
    name: "images",
    keyName: "_key"
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant, update: updateVariant } = useFieldArray({
    control,
    name: "variants",
    keyName: "_key"
  });

  const images = watch("images");
  const variants = watch("variants");

  useEffect(() => {
    async function load() {
      try {
        const categoriesResponse = await fetch("/api/admin/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories ?? []);
        const defaultCatId = categoriesData.categories?.[0]?.id || "";
        
        if (!productId) {
          setValue("categoryId", defaultCatId);
          setIsLoading(false);
          return;
        }

>>>>>>> origin/main
        const productResponse = await fetch(`/api/admin/products/${productId}`);
        if (!productResponse.ok) {
          toast.error("Product not found.");
          router.push("/admin/products");
          return;
        }
        const data = (await productResponse.json()) as { product: AdminProduct };
        const product = data.product;
<<<<<<< HEAD
        setName(product.name);
        setDescription(product.description);
        setCategoryId(product.categoryId);
        setIsActive(product.isActive);
        setImages(product.images);
        setVariants(product.variants.map((variant) => ({ ...variant })));
=======
        setValue("name", product.name);
        setValue("description", product.description || "");
        setValue("categoryId", product.categoryId);
        setValue("isActive", product.isActive);
        setValue("images", product.images.map(img => ({ ...img })));
        setValue("variants", product.variants.map(variant => ({ ...variant, skuError: undefined })));
      } catch (err) {
         toast.error("Error loading product data.");
      } finally {
        setIsLoading(false);
>>>>>>> origin/main
      }
    }

    load();
<<<<<<< HEAD
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
=======
  }, [productId, router, setValue]);

  function handleImageChange(index: number, url: string) {
    updateImage(index, { ...images[index], url });
  }

  function handleSetPrimaryImage(index: number) {
    const newImages = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    setValue("images", newImages);
  }

  function handleRemoveImage(index: number) {
    removeImage(index);
    // ensure one is primary if there are any left
    setTimeout(() => {
      const current = watch("images");
      if (current.length > 0 && !current.some(img => img.isPrimary)) {
        setValue("images", current.map((img, i) => ({ ...img, isPrimary: i === 0 })));
      }
    }, 0);
  }

  async function validateSku(index: number) {
    const variant = variants[index];
    if (!variant.sku.trim()) {
      updateVariant(index, { ...variant, skuError: "SKU is required." });
>>>>>>> origin/main
      return;
    }

    const duplicateInForm = variants.some(
<<<<<<< HEAD
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
=======
      (item, i) => i !== index && item.sku.trim().toLowerCase() === variant.sku.trim().toLowerCase()
    );

    if (duplicateInForm) {
      updateVariant(index, { ...variant, skuError: "SKU is already used in this form." });
      return;
    }

    try {
      const params = new URLSearchParams({ sku: variant.sku, excludeVariantId: variant.id });
      const response = await fetch(`/api/admin/products/sku?${params.toString()}`);
      const data = await response.json();
      updateVariant(index, { ...variant, skuError: data.unique ? undefined : "SKU already exists." });
    } catch(e) {
      // ignore
    }
>>>>>>> origin/main
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
<<<<<<< HEAD
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
=======
    
    const oldIndex = images.findIndex((image) => image.id === active.id);
    const newIndex = images.findIndex((image) => image.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
       moveImage(oldIndex, newIndex);
       setTimeout(() => {
         const current = watch("images");
         setValue("images", current.map((img, i) => ({ ...img, sortOrder: i })));
       }, 0);
    }
  }

  async function onSubmit(data: ProductFormValues) {
    if (data.variants.some(v => v.skuError)) {
      toast.error("Please fix SKU errors before saving.");
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      isActive: data.isActive,
      images: data.images.map((image, index) => ({
>>>>>>> origin/main
        id: image.id.startsWith("new_") ? undefined : image.id,
        url: image.url,
        isPrimary: image.isPrimary,
        sortOrder: index,
      })),
<<<<<<< HEAD
      variants: variants.map((variant) => ({
=======
      variants: data.variants.map((variant) => ({
>>>>>>> origin/main
        id: variant.id.startsWith("new_") ? undefined : variant.id,
        name: variant.name,
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku,
      })),
    };

<<<<<<< HEAD
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
=======
    try {
      const response = await fetch(isEditing ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error(err.error || "Unable to save product.");
        return;
      }

      toast.success("Product saved.");
      router.push("/admin/products");
    } catch(e) {
      toast.error("Network error");
    }
  }

  if (isLoading) return null;

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
>>>>>>> origin/main
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Product details, imagery, and sellable variants.</p>
        </div>
        <button
          type="submit"
<<<<<<< HEAD
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save product"}
=======
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isSubmitting ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="size-4" />}
          {isSubmitting ? "Saving..." : "Save product"}
>>>>>>> origin/main
        </button>
      </div>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Product name
            <input
<<<<<<< HEAD
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
=======
              {...register("name")}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.name && <span className="text-xs text-red-500 normal-case">{errors.name.message}</span>}
>>>>>>> origin/main
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <select
<<<<<<< HEAD
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
=======
              {...register("categoryId")}
>>>>>>> origin/main
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
<<<<<<< HEAD
=======
            {errors.categoryId && <span className="text-xs text-red-500 normal-case">{errors.categoryId.message}</span>}
>>>>>>> origin/main
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Description
          <textarea
<<<<<<< HEAD
            value={description}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
=======
            {...register("description")}
            rows={4}
>>>>>>> origin/main
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
<<<<<<< HEAD
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
=======
            {...register("isActive")}
>>>>>>> origin/main
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
<<<<<<< HEAD
            onClick={() =>
              setImages((current) => [...current, { ...emptyImage(), isPrimary: current.length === 0, sortOrder: current.length }])
            }
=======
            onClick={() => appendImage({ ...emptyImage(), isPrimary: images.length === 0, sortOrder: images.length })}
>>>>>>> origin/main
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="size-4" />
            Add image
          </button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
<<<<<<< HEAD
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
            
=======
          <SortableContext items={images.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {images.map((image: any, index: number) => (
                <SortableImageRow
                  key={image.id}
                  image={image}
                  onChange={(url) => handleImageChange(index, url)}
                  onPrimary={() => handleSetPrimaryImage(index)}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
>>>>>>> origin/main
          </SortableContext>
        </DndContext>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Variants</h2>
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => setVariants((current) => [...current, emptyVariant()])}
=======
            onClick={() => appendVariant(emptyVariant())}
>>>>>>> origin/main
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="size-4" />
            Add row
          </button>
        </div>
<<<<<<< HEAD
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
=======
        {errors.variants?.root && <div className="text-sm text-red-600 normal-case">{errors.variants.root.message}</div>}
        <div className="grid gap-3">
          {variantFields.map((field, index) => {
            const variantError = errors.variants?.[index];
            const manualSkuError = variants[index]?.skuError;
            return (
              <div key={field.id} className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_140px_120px_1fr_auto] md:items-start">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                  <input
                    {...register(`variants.${index}.name`)}
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                  <input
                    type="number"
                    min="0"
                    {...register(`variants.${index}.price`)}
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {variantError?.price && <span className="text-xs normal-case tracking-normal text-red-600">{variantError.price.message}</span>}
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stock
                  <input
                    type="number"
                    min="0"
                    {...register(`variants.${index}.stock`)}
                    className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {variantError?.stock && <span className="text-xs normal-case tracking-normal text-red-600">{variantError.stock.message}</span>}
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SKU
                  <input
                    {...register(`variants.${index}.sku`, {
                      onBlur: () => validateSku(index),
                      onChange: () => updateVariant(index, { ...variants[index], skuError: undefined })
                    })}
                    className={[
                      "h-10 rounded-md border px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                      (variantError?.sku || manualSkuError) ? "border-red-300" : "border-slate-200",
                    ].join(" ")}
                  />
                  {(variantError?.sku || manualSkuError) ? <span className="text-xs normal-case tracking-normal text-red-600">{variantError?.sku?.message || manualSkuError}</span> : null}
                </label>
                <button
                  type="button"
                  aria-label="Remove variant"
                  onClick={() => variantFields.length > 1 ? removeVariant(index) : null}
                  className="mt-5 inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  disabled={variantFields.length <= 1}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
>>>>>>> origin/main
        </div>
      </section>
    </form>
  );
}
