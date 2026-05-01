"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BadgeIndianRupee, Boxes, GripVertical, Hash, Package, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { AdminCategory, AdminProduct } from "@/components/admin/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { queryKeys } from "@/lib/query-keys";

type ProductFormPageProps = {
  productId?: string;
};

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

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

const emptyVariant = () => ({
  id: `new_${crypto.randomUUID()}`,
  name: "",
  price: 0,
  stock: 0,
  sku: "",
  skuError: undefined
});

const emptyImage = () => ({
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
  image: { id: string; url: string; isPrimary: boolean };
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
  const queryClient = useQueryClient();
  const [formHydratedFor, setFormHydratedFor] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
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

  const productFormQuery = useQuery({
    queryKey: queryKeys.admin.productForm(productId),
    queryFn: async () => {
      const categoriesResponse = await fetch("/api/admin/categories");
      if (!categoriesResponse.ok) throw new Error("Error loading product data.");
      const categoriesData = await categoriesResponse.json();
      const categories = (categoriesData.categories ?? []) as AdminCategory[];

      if (!productId) {
        return { categories, product: null };
      }

      const productResponse = await fetch(`/api/admin/products/${productId}`);
      if (!productResponse.ok) {
        throw new Error("Product not found.");
      }

      const data = (await productResponse.json()) as { product: AdminProduct };
      return { categories, product: data.product };
    },
  });

  const categories = productFormQuery.data?.categories ?? [];
  const product = productFormQuery.data?.product ?? null;
  const isLoading = productFormQuery.isLoading;

  useEffect(() => {
    if (!productFormQuery.data) return;

    const hydrateKey = productId ?? "new";
    if (formHydratedFor === hydrateKey) return;

    const defaultCatId = productFormQuery.data.categories?.[0]?.id || "";

    if (!productId) {
      setValue("categoryId", defaultCatId);
      setFormHydratedFor(hydrateKey);
      return;
    }

    if (!product) return;

    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("categoryId", product.categoryId);
    setValue("isActive", product.isActive);
    setValue("images", product.images.map((img) => ({ ...img })));
    setValue(
      "variants",
      product.variants.map((variant) => ({ ...variant, skuError: undefined }))
    );
    setFormHydratedFor(hydrateKey);
  }, [formHydratedFor, product, productFormQuery.data, productId, setValue]);

  useEffect(() => {
    if (productFormQuery.error) {
      toast.error(
        productFormQuery.error instanceof Error
          ? productFormQuery.error.message
          : "Error loading product data."
      );
      if (productId) router.push("/admin/products");
    }
  }, [productFormQuery.error, productId, router]);

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

  const validateSkuMutation = useMutation({
    mutationFn: async ({
      sku,
      excludeVariantId,
    }: {
      sku: string;
      excludeVariantId: string;
    }) => {
      const params = new URLSearchParams({ sku, excludeVariantId });
      const response = await fetch(`/api/admin/products/sku?${params.toString()}`);
      if (!response.ok) throw new Error("SKU validation failed.");
      return response.json() as Promise<{ unique?: boolean }>;
    },
  });

  const saveProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const payload = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        isActive: data.isActive,
        images: data.images.map((image, index) => ({
          id: image.id.startsWith("new_") ? undefined : image.id,
          url: image.url,
          isPrimary: image.isPrimary,
          sortOrder: index,
        })),
        variants: data.variants.map((variant) => ({
          id: variant.id.startsWith("new_") ? undefined : variant.id,
          name: variant.name,
          price: Number(variant.price),
          stock: Number(variant.stock),
          sku: variant.sku,
        })),
      };

      const response = await fetch(
        isEditing ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Unable to save product.");
      }
    },
    onSuccess: async () => {
      toast.success("Product saved.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      router.push("/admin/products");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Network error");
    },
  });

  async function validateSku(index: number) {
    const variant = variants[index];
    if (!variant.sku.trim()) {
      updateVariant(index, { ...variant, skuError: "SKU is required." });
      return;
    }

    const duplicateInForm = variants.some(
      (item, i) => i !== index && item.sku.trim().toLowerCase() === variant.sku.trim().toLowerCase()
    );

    if (duplicateInForm) {
      updateVariant(index, { ...variant, skuError: "SKU is already used in this form." });
      return;
    }

    try {
      const data = await validateSkuMutation.mutateAsync({
        sku: variant.sku,
        excludeVariantId: variant.id,
      });
      updateVariant(index, { ...variant, skuError: data.unique ? undefined : "SKU already exists." });
    } catch {
      // ignore
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
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

    saveProductMutation.mutate(data);
  }

  if (isLoading) return null;

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Product details, imagery, and sellable variants.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isSubmitting ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="size-4" />}
          {isSubmitting ? "Saving..." : "Save product"}
        </button>
      </div>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Product name
            <input
              {...register("name")}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.name && <span className="text-xs text-red-500 normal-case">{errors.name.message}</span>}
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Category
            <select
              {...register("categoryId")}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="text-xs text-red-500 normal-case">{errors.categoryId.message}</span>}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Description
          <textarea
            {...register("description")}
            rows={4}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            {...register("isActive")}
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
            onClick={() => appendImage({ ...emptyImage(), isPrimary: images.length === 0, sortOrder: images.length })}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="size-4" />
            Add image
          </button>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((image) => image.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {images.map((image, index) => (
                <SortableImageRow
                  key={image.id}
                  image={image}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Variants</h2>
            <p className="mt-1 text-sm text-slate-500">{variantFields.length} sellable option{variantFields.length === 1 ? "" : "s"}</p>
          </div>
          <button
            type="button"
            onClick={() => appendVariant(emptyVariant())}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
          >
            <Plus className="size-4" />
            Add variant
          </button>
        </div>
        {errors.variants?.root && <div className="text-sm text-red-600 normal-case">{errors.variants.root.message}</div>}
        <div className="grid gap-4">
          {variantFields.map((field, index) => {
            const variantError = errors.variants?.[index];
            const manualSkuError = variants[index]?.skuError;
            return (
              <div key={field.id} className="overflow-hidden rounded-md border border-slate-200 bg-slate-50/40">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Variant {index + 1}</p>
                      <p className="text-xs text-slate-500">{variants[index]?.sku || "No SKU yet"}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove variant"
                    onClick={() => variantFields.length > 1 ? removeVariant(index) : null}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={variantFields.length <= 1}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid min-w-0 items-start gap-4 p-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_160px_160px_minmax(240px,1fr)]">
                  <label className="grid min-w-0 gap-1.5 text-xs font-semibold uppercase text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Package className="size-3.5" />
                      Name
                    </span>
                    <input
                      {...register(`variants.${index}.name`)}
                      placeholder="Space Grey / Blue Switch"
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-normal normal-case text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="min-h-4 text-xs normal-case">&nbsp;</span>
                  </label>

                  <label className="grid min-w-0 gap-1.5 text-xs font-semibold uppercase text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <BadgeIndianRupee className="size-3.5" />
                      Price
                    </span>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        {...register(`variants.${index}.price`)}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white pl-7 pr-3 text-sm font-normal normal-case text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <span className="min-h-4 text-xs normal-case text-red-600">{variantError?.price?.message ?? "\u00a0"}</span>
                  </label>

                  <label className="grid min-w-0 gap-1.5 text-xs font-semibold uppercase text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Boxes className="size-3.5" />
                      Stock
                    </span>
                    <input
                      type="number"
                      min="0"
                      {...register(`variants.${index}.stock`)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-normal normal-case text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="min-h-4 text-xs normal-case text-red-600">{variantError?.stock?.message ?? "\u00a0"}</span>
                  </label>

                  <label className="grid min-w-0 gap-1.5 text-xs font-semibold uppercase text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="size-3.5" />
                      SKU
                    </span>
                    <input
                      {...register(`variants.${index}.sku`, {
                        onBlur: () => validateSku(index),
                        onChange: () => updateVariant(index, { ...variants[index], skuError: undefined })
                      })}
                      placeholder="SKU-001"
                      className={[
                        "h-10 w-full rounded-md border bg-white px-3 text-sm font-normal normal-case text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                        (variantError?.sku || manualSkuError) ? "border-red-300" : "border-slate-200",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "min-h-4 max-w-full break-words text-xs normal-case",
                        (variantError?.sku || manualSkuError) ? "text-red-600" : "text-green-600",
                      ].join(" ")}
                    >
                      {(variantError?.sku?.message || manualSkuError) ?? (variants[index]?.sku ? "SKU available" : "\u00a0")}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </form>
  );
}
