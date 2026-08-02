import React from "react";
import { CategoryInterface } from "@/types";
import { useCategories } from "@/api/categoryServices";
import { ChevronDown, Plus } from "lucide-react";
import { Field } from "../ui/Field";
import { FormTextarea } from "../ui/FormTextarea";
import { FormInput } from "../ui/FormInput";
import { FormSelect } from "../ui/FormSelect";

interface FormErrors {
  menuName?: string;
  categoryId?: string;
  price?: string;
  stock?: string;
}

interface MenuFormProps {
  formData: any;
  formErrors: FormErrors;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisable: boolean;
}

const MenuForm = ({
  formData,
  formErrors,
  handleChange,
  handleFileChange,
  handleSubmit,
  isDisable,
}: MenuFormProps) => {
  const filters = { page: 1, pageSize: 100000 };
  const { categories } = useCategories(filters);

  return (
    <form onSubmit={handleSubmit} id="menu-form" className="space-y-5">
      <div className="mb-4 mt-4 flex justify-center">
        <div className="rounded-md border border-blue-500 bg-gray-50 p-4 shadow-md w-36">
          <label
            htmlFor="upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Plus className="text-blue-500" />
            <span className="text-gray-600 font-medium text-wrap text-center">
              Upload Gambar
            </span>
          </label>

          <input
            id="upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />

          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Menu Preview"
              className="mt-2 rounded-md w-full h-auto object-cover"
            />
          )}
        </div>
      </div>

      {/* Menu Name */}
      <Field label="Nama Menu" htmlFor="menuName" error={formErrors.menuName}>
        <FormInput
          id="menuName"
          name="menuName"
          placeholder="Contoh: Nasi Goreng Spesial"
          value={formData.menuName}
          onChange={handleChange}
          disabled={isDisable}
        />
      </Field>

      {/* Description */}
      <Field
        label="Deskripsi"
        htmlFor="menuDescription"
        hint={`${formData.menuDescription.length}/255 karakter`}
      >
        <FormTextarea
          id="menuDescription"
          name="menuDescription"
          placeholder="Deskripsi singkat menu"
          value={formData.menuDescription}
          onChange={handleChange}
          disabled={isDisable}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Category */}
        <Field
          label="Kategori"
          htmlFor="categoryId"
          error={formErrors.categoryId}
        >
          <div className="relative">
            <FormSelect
              id="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              name="categoryId"
              disabled={isDisable}
            >
              <option value="">Pilih Kategori</option>

              {categories?.data?.map((c: CategoryInterface) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </FormSelect>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        {/* Price */}
        <Field label="Harga" htmlFor="price" error={formErrors.price}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              Rp
            </span>

            <input
              name="price"
              id="price"
              type="number"
              inputMode="numeric"
              min={0}
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className={
                "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 pl-9 tabular-nums"
              }
              disabled={isDisable || formData.isCustomPrice}
            />
          </div>
        </Field>

        {/* Stock */}
        <Field label="Stok" htmlFor="stock" error={formErrors.stock}>
          <FormInput
            name="stock"
            id="stock"
            type="number"
            inputMode="numeric"
            min={0}
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            disabled={isDisable}
          />
        </Field>
      </div>

      {/* Custom Price */}
      <Field label="Harga Custom" htmlFor="isCustomPrice">
        <div className="flex items-center gap-3">
          <input
            id="isCustomPrice"
            name="isCustomPrice"
            type="checkbox"
            checked={formData.isCustomPrice || false}
            onChange={handleChange}
            disabled={isDisable}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />

          <label
            htmlFor="isCustomPrice"
            className="cursor-pointer text-sm text-foreground"
          >
            Harga ditentukan saat transaksi
          </label>
        </div>
      </Field>
    </form>
  );
};

export default MenuForm;
