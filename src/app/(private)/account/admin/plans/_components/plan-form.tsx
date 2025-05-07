"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { uplaodFileAndGetUrl } from "@/utils";
import { addNewPlan, editPlanById } from "@/actions/plans";
import { useRouter } from "next/navigation";

interface PlanFormProps {
  formType?: "add" | "edit";
  initialValues?: any;
}

function PlanForm({ formType, initialValues }: PlanFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<any[]>([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>(
    initialValues?.images || []
  );

  // Debug log to verify initial images are loaded correctly
  useEffect(() => {
    console.log("Initial images:", initialValues?.images);
  }, [initialValues]);

  const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    features: z.array(z.string()).nonempty("Features is required"),
    monthly_price: z.number(),
    quarterly_price: z.number(),
    half_yearly_price: z.number(),
    yearly_price: z.number(),
  });

  const form: any = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      features: initialValues?.features || [],
      monthly_price: initialValues?.monthly_price || 0,
      quarterly_price: initialValues?.quarterly_price || 0,
      half_yearly_price: initialValues?.half_yearly_price || 0,
      yearly_price: initialValues?.yearly_price || 0,
    },
  });

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      //save the selected media files to the supabase storage and then get the url
      let newMediaUrls = [];
      for (let file of selectedMediaFiles) {
        const responce = await uplaodFileAndGetUrl(file);
        if (!responce.success) {
          throw new Error(responce.message);
        } else {
          newMediaUrls.push(responce.data);
        }
      }

      // Include both existing and new images
      values.images = [...existingMediaUrls, ...newMediaUrls];
      
      // based on the formType call the appropriate server action
      let response = null;
      if (formType === "add") {
        response = await addNewPlan(values);
      } else {
        response = await editPlanById(initialValues.id, values);
      }

      if (response.success) {
        toast.success(response.message);
        router.push("/account/admin/plans");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const pricingFields = [
    "monthly_price",
    "quarterly_price",
    "half_yearly_price",
    "yearly_price",
  ];

  const onSelectedMediaFilesRemove = (index: number) => {
    const temp = [...selectedMediaFiles];
    temp.splice(index, 1);
    setSelectedMediaFiles(temp);
  };

  const onExistingMediaUrlsRemove = (index: number) => {
    const temp = [...existingMediaUrls];
    temp.splice(index, 1);
    setExistingMediaUrls(temp);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-7">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {formType === "add" ? "Create New Plan" : "Edit Plan"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Plan Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-container focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter plan name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-container min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter plan description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <fieldset className="p-6 border-2 border-gray-300 rounded-lg bg-gray-50">
            <legend className="px-2 text-sm font-medium text-gray-700 bg-white">
              Plan Features
            </legend>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  name={`features.${index}`}
                  key={field.id}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <div className="flex-1 relative">
                          <Input
                            className="input-container pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter feature"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => remove(index)}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-4 flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
              onClick={() => append("")}
            >
              <PlusCircle size={16} />
              <span>Add Feature</span>
            </Button>
          </fieldset>

          <fieldset className="p-6 border-2 border-gray-300 rounded-lg bg-gray-50">
            <legend className="px-2 text-sm font-medium text-gray-700 bg-white">
              Pricing Options
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pricingFields.map((item, index) => (
                <FormField
                  control={form.control}
                  name={item}
                  key={item}
                  render={({ field }) => (
                    <FormItem className="bg-white p-4 rounded-md shadow-sm">
                      <FormLabel className="text-xs font-semibold text-gray-600 uppercase">
                        {item.replace("_", " ").replace("_", " ")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="input-container pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? 0 : parseFloat(value)
                              );
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            <FormLabel className="text-sm font-medium text-gray-700">
              Plan Images
            </FormLabel>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
              <ImagePlus size={40} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-4">Upload plan images</p>
              <Input
                className="max-w-xs mx-auto"
                type="file"
                multiple
                onChange={(e: any) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedMediaFiles([
                      ...selectedMediaFiles,
                      ...Array.from(e.target.files),
                    ]);
                  }
                }}
              />
            </div>
            
            <div className="mt-4">
              {(existingMediaUrls.length > 0 || selectedMediaFiles.length > 0) && (
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Images ({existingMediaUrls.length + selectedMediaFiles.length})
                </h4>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingMediaUrls.map((url, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group border border-gray-200 rounded-md p-2 bg-white"
                  >
                    <img
                      src={`${url}?t=${Date.now()}`}
                      className="w-full h-24 object-contain"
                      alt={`Existing Preview ${index}`}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                      onClick={() => onExistingMediaUrlsRemove(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs text-gray-500 truncate mt-1">Existing image</p>
                  </div>
                ))}
                {selectedMediaFiles.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group border border-gray-200 rounded-md p-2 bg-white"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-24 object-contain"
                      alt={`New Preview ${index}`}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                      onClick={() => onSelectedMediaFilesRemove(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => router.push("/account/admin/plans")}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading
                ? "Processing..."
                : formType === "add"
                ? "Create Plan"
                : "Update Plan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PlanForm;
