import { ProductFormPage } from "@/components/admin/product-form-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductFormPage productId={id} />;
}
