"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import * as z from "zod";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AdminCategory } from "@/components/admin/types";

// --- Types ---
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url("Invalid image URL"),
    isPrimary: z.boolean(),
    sortOrder: z.number(),
  })).min(1, "At least one image required"),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Name required"),
    price: z.number(),
    stock: z.number(),
    sku: z.string().min(1, "SKU required"),
    skuError: z.string().optional(),
  })).min(1, "At least one variant required"),
});
type ProductFormValues = z.infer<typeof productSchema>;

function emptyImage(): ProductFormValues["images"][number] {
  return {
    id: `new_${Math.random().toString(36).slice(2)}`,
    url: "",
    isPrimary: false,
    sortOrder: 0,
  };
}
function emptyVariant(): ProductFormValues["variants"][number] {
  return {
    id: `new_${Math.random().toString(36).slice(2)}`,
    name: "",
    price: 0,
    stock: 0,
    sku: "",
    skuError: undefined,
  };
}

function SortableImageRow({ image, onChange, onPrimary, onRemove }: {
  image: ProductFormValues["images"][number];
  onChange: (url: string) => void;
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
      <button type="button" aria-label="Drag image" className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-500" {...attributes} {...listeners}>
        <GripVertical className="size-4" />
      </button>
      <div className="relative size-16 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        {image.url ? <Image src={image.url} alt="" fill className="object-cover" sizes="64px" /> : null}
      </div>
      <input value={image.url} onChange={e => onChange(e.target.value)} placeholder="Image URL" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="radio" checked={image.isPrimary} onChange={onPrimary} className="size-4 accent-slate-900" /> Primary
      </label>
      <button type="button" aria-label="Remove image" onClick={onRemove} className="inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function ProductFormPage({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(productId);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      images: [emptyImage()],
      variants: [emptyVariant()],
    },
    mode: "onChange",
  });
  const { fields: imageFields, append: appendImage, remove: removeImage, move: moveImage } = useFieldArray({ control, name: "images" });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({ control, name: "variants" });
  const images = watch("images");
  const variants = watch("variants");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const categoriesResponse = await fetch("/api/admin/categories");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.categories ?? []);
      if (isEditing && productId) {
        const productResponse = await fetch(`/api/admin/products/${productId}`);
        if (!productResponse.ok) {
          toast.error("Product not found.");
          router.push("/admin/products");
          return;
        }
        const { product } = await productResponse.json();
        setValue("name", product.name);
        setValue("description", product.description || "");
        setValue("categoryId", product.categoryId);
        setValue("isActive", product.isActive);
        setValue("images", product.images.map((img: any, i: number) => ({ ...img, sortOrder: i })));
        setValue("variants", product.variants.map((variant: any) => ({ ...variant, skuError: undefined })));
      }
      setIsLoading(false);
    }
    load();
  }, [isEditing, productId, router, setValue]);

  // SKU validation
  async function validateSku(index: number) {
    const variant = variants[index];
    if (!variant.sku.trim()) {
      setValue(`variants.${index}.skuError`, "SKU is required.");
      return;
    }
    const duplicateInForm = variants.some((item: any, i: number) => i !== index && item.sku.trim().toLowerCase() === variant.sku.trim().toLowerCase());
    if (duplicateInForm) {
      setValue(`variants.${index}.skuError`, "SKU is already used in this form.");
      return;
    }
    try {
      const params = new URLSearchParams({ sku: variant.sku, excludeVariantId: variant.id });
      const response = await fetch(`/api/admin/products/sku?${params.toString()}`);
      const data = await response.json();
      setValue(`variants.${index}.skuError`, data.unique ? undefined : "SKU already exists.");
    } catch {
      // ignore
    }
  }

  function handleImageChange(index: number, url: string) {
    setValue(`images.${index}.url`, url);
  }
  function handleSetPrimaryImage(index: number) {
    setValue(
      "images",
      images.map((img: any, i: number) => ({ ...img, isPrimary: i === index }))
    );
  }
  function handleRemoveImage(index: number) {
    removeImage(index);
    setTimeout(() => {
      const current = watch("images");
      if (current.length > 0 && !current.some((img: any) => img.isPrimary)) {
        setValue(
          "images",
          current.map((img: any, i: number) => ({ ...img, isPrimary: i === 0 }))
        );
      }
    }, 0);
  }
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((image: any) => image.id === active.id);
    const newIndex = images.findIndex((image: any) => image.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      moveImage(oldIndex, newIndex);
      setTimeout(() => {
        const current = watch("images");
        setValue(
          "images",
          current.map((img: any, i: number) => ({ ...img, sortOrder: i }))
        );
      }, 0);
    }
  }

  async function onSubmit(data: ProductFormValues) {
    if (data.variants.some((v: any) => v.skuError)) {
      toast.error("Please fix SKU errors before saving.");
      return;
    }
    const payload = {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      isActive: data.isActive,
      images: data.images.map((image: any, index: number) => ({
        id: image.id.startsWith("new_") ? undefined : image.id,
        url: image.url,
        isPrimary: image.isPrimary,
        sortOrder: index,
      })),
      variants: data.variants.map((variant: any) => ({
        id: variant.id.startsWith("new_") ? undefined : variant.id,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        sku: variant.sku,
      })),
    };
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
    } catch {
      toast.error("Network error");
    }
  }

  if (isLoading) return null;

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{isEditing ? "Edit Product" : "Create Product"}</h1>
          <p className="mt-1 text-sm text-slate-500">Product details, imagery, and sellable variants.</p>
        </div>
        <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60">
          {isSubmitting ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="size-4" />}
          {isSubmitting ? "Saving..." : "Save product"}
        </button>
      </div>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Product name
            <input {...register("name")} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            {errors.name && <span className="text-xs text-red-500 normal-case">{errors.name.message}</span>}
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <select {...register("categoryId")} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs text-red-500 normal-case">{errors.categoryId.message}</span>}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Description
          <textarea {...register("description")} rows={4} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" {...register("isActive")} className="size-4 accent-slate-900" /> Active
        </label>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Images</h2>
          <button type="button" onClick={() => appendImage({ ...emptyImage(), isPrimary: images.length === 0, sortOrder: images.length })} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Plus className="size-4" /> Add image
          </button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={imageFields.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {imageFields.map((image, index) => (
                <SortableImageRow
                  key={image.id}
                  image={images[index]}
                  onChange={(url) => handleImageChange(index, url)}
                  onPrimary={() => handleSetPrimaryImage(index)}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Variants</h2>
          <button type="button" onClick={() => appendVariant(emptyVariant())} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Plus className="size-4" /> Add row
          </button>
        </div>
        {errors.variants?.root && <div className="text-sm text-red-600 normal-case">{errors.variants.root.message}</div>}
        <div className="grid gap-3">
          {variantFields.map((field, index) => {
            const variantError = errors.variants?.[index];
            const manualSkuError = variants[index]?.skuError;
            return (
              <div key={field.id} className="grid gap-3 rounded-md border border-slate-200 p-3 md:grid-cols-[1fr_140px_120px_1fr_auto] md:items-start">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                  <input {...register(`variants.${index}.name`)} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  {variantError?.name && <span className="text-xs normal-case tracking-normal text-red-600">{variantError.name.message}</span>}
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                  <input type="number" min="0" {...register(`variants.${index}.price`, { valueAsNumber: true })} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  {variantError?.price && <span className="text-xs normal-case tracking-normal text-red-600">{variantError.price.message}</span>}
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stock
                  <input type="number" min="0" {...register(`variants.${index}.stock`, { valueAsNumber: true })} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  {variantError?.stock && <span className="text-xs normal-case tracking-normal text-red-600">{variantError.stock.message}</span>}
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SKU
                  <input
                    {...register(`variants.${index}.sku`, {
                      onBlur: () => validateSku(index),
                      onChange: () => setValue(`variants.${index}.skuError`, undefined),
                    })}
                    className={["h-10 rounded-md border px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100", (variantError?.sku || manualSkuError) ? "border-red-300" : "border-slate-200"].join(" ")}
                  />
                  {(variantError?.sku || manualSkuError) ? <span className="text-xs normal-case tracking-normal text-red-600">{variantError?.sku?.message || manualSkuError}</span> : null}
                </label>
                <button type="button" aria-label="Remove variant" onClick={() => variantFields.length > 1 ? removeVariant(index) : null} className="mt-5 inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50" disabled={variantFields.length <= 1}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </form>
  );
}
