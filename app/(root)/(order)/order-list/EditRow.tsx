"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Validation Schema
const FormSchema = z.object({
  programCode: z.string().min(1, { message: "Program Code is required." }),
  buyer: z.string().min(1, { message: "Buyer is required." }),
  item: z.string().min(1, { message: "Item is required." }),
  styleNo: z.string().min(1, { message: "Style No is required." }),
  orderQty: z.number({ invalid_type_error: "Order Quantity must be a number." }).min(1),
  percentage: z.number({ invalid_type_error: "Percentage must be a number." }).min(0).max(100),
  unitPrice: z.number({ invalid_type_error: "Unit Price must be a number." }).min(0.01),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    errorMap: () => ({ message: "Invalid status value." }),
  }),
});

interface EditSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: any;
}

export const EditSheet = ({ open, setOpen, payment }: EditSheetProps) => {

const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      programCode: payment.programCode || "",
      buyer: payment.buyer || "",
      item: payment.item || "",
      styleNo: payment.styleNo || "",
      orderQty: payment.orderQty || 0,
      percentage: payment.percentage || 15,
      unitPrice: payment.unitPrice || 0,
      status: payment.status || "PENDING",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axiosInstance.patch(`/production-order/${payment.id}`, data);
      toast.success("Order updated successfully");
      setOpen(false);
      router.refresh(); // Refresh the page or data after successful update
    } catch (error: any) {
      toast.error("Failed to update order");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Order</SheetTitle>
          <SheetDescription>Update the order information and save.</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="programCode"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Program Code</FormLabel>
                      <FormControl className="col-span-2">
                        <Input placeholder="639" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buyer"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Buyer</FormLabel>
                      <FormControl className="col-span-2">
                        <Input placeholder="RUTA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Item</FormLabel>
                      <FormControl className="col-span-2">
                        <Input placeholder="Shirt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="styleNo"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Style No</FormLabel>
                      <FormControl className="col-span-2">
                        <Input placeholder="52H-9700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderQty"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Order Quantity</FormLabel>
                      <FormControl className="col-span-2">
                        <Input
                          type="number"
                          placeholder="3520"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Percentage</FormLabel>
                      <FormControl className="col-span-2">
                        <Input
                          type="number"
                          placeholder="15"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="2.04"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3  items-center">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="col-span-2">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Complete</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="flex justify-end">
                <SheetClose asChild>
                  <Button type="submit">Save Changes</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
