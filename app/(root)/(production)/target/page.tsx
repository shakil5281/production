"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// ✅ Define the schema with zod
const FormSchema = z.object({
  data: z.string().min(1, {
    message: "Data is required.",
  }),
  line: z.string().min(1, {
    message: "Line is required.",
  }),
  style: z.string().min(1, {
    message: "Style name is required.",
  }),
  hour: z.string().min(1, {
    message: "Hour range is required. Example: 8:00 - 9:00",
  }),
  production: z
    .number({ invalid_type_error: "Production must be a number." })
    .min(1, { message: "Production is required." }),
})

export default function ProductionForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      data: "",
      line: "",
      style: "",
      hour: "",
      production: 0,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Production data submitted successfully.")
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Line</FormLabel>
              <FormControl>
                <Input placeholder="Line A / Line 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style Name</FormLabel>
              <FormControl>
                <Input placeholder="Style code or name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hour (e.g. 8:00 - 9:00)</FormLabel>
              <FormControl>
                <Input type="time" placeholder="8:00 - 9:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="production"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Production</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 300"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
