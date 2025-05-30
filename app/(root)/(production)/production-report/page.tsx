"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axios from "axios"
import axiosInstance from "@/lib/axios"
import { ProductionTable } from "./data-table"
import { ProductionTableSkeleton } from "./TableLoader"

// Define the schema
const FormSchema = z.object({
  lineNo: z.number({ invalid_type_error: "Line No must be a number." }).min(1, { message: "Line No is required." }),
  productionOrderId: z.string().nonempty("Production Order ID is required."),
  dailyProduction: z.number({ invalid_type_error: "Daily Production must be a number." }).min(1, {
    message: "Daily Production must be greater than 0.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
})

export default function ProductionReportForm() {
  const { toast } = useToast()
  const [orderOptions, setOrderOptions] = useState([])
  const [entries, setEntries] = useState<any>([])
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      lineNo: 1,
      productionOrderId: "",
      dailyProduction: 0,
    },
  })

  // Fetch production order data
  useEffect(() => {
    fetch("/api/production-order/status?status=IN_PROGRESS")
      .then((res) => res.json())
      .then((data) => {
        setOrderOptions(data)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch production orders."
        })
      })
  }, [])

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await axiosInstance.post('/production-report', data)
      DailyProductionReport(new Date().toISOString())
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  const DailyProductionReport = async (date: any) => {
    try {
      const data = await axiosInstance.get(`/production-report?date=${date}`)
      setEntries(data?.data)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    DailyProductionReport(new Date().toISOString())
  }, [])

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="">
        {/* Form Section */}
        <div className="p-6 rounded-md">
          <h1 className="text-2xl font-bold mb-4">Production Report Form</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-4 gap-4">

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lineNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Line No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter line number"
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
                name="productionOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Order ID</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a production order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orderOptions.map((order: any) => (
                          <SelectItem key={order.id} value={order.id}>
                            {order.styleNo} {/* Customize if needed */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyProduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Production</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter daily production"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>

        {/* Data Table Section */}
        <div className="p-6 col-span-2">
          <h1 className="text-2xl font-bold mb-4 text-center">Daily Production Report</h1>
          <div className="">
            {
              loading ? <ProductionTableSkeleton /> :
                <ProductionTable entries={entries} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
