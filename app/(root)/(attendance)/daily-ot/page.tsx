"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"



import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axiosInstance from "@/lib/axios"
import React, { useEffect, useState } from "react"
import DataTable from "./data-table"
import { useToast } from "@/hooks/use-toast"


const FormSchema = z.object({
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      const date = new Date(arg);
      // সময়কে 00:00:00 করা হচ্ছে
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return arg;
  },
    z.date({
      required_error: "A date of birth is required.",
    })),
  worker: z.number().min(1, {
    message: "Worker must be at least 1.",
  }),
  OT: z.number().default(0),
  designation: z.string()
});


export default function InputForm() {


  const [overTime, setOverTime] = useState<any>([])
  const [manpower, setManpower] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      worker: 1,
      OT: 0,
    },
  })


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {

      const response = await axiosInstance.post('/daily-overtime', data)
      GetDailyOverTime()
    } catch (err) {
      console.log(err)
    }
  }

  const GetDailyOverTime = async () => {
    try {
      const response = await axiosInstance.get('/daily-overtime')
      setOverTime(response?.data)
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    GetDailyOverTime()
  }, [])


  async function fetchManpower(date: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/manpower?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: any = await response.json();
      setManpower(data.data);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const [date, setDate] = React.useState<any>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time to 00:00:00
    return now;
  });


  if (date === undefined || date === null) {
    useEffect(() => {
      fetchManpower(new Date().toISOString())
    }, [date])

  } else {
    useEffect(() => {
      fetchManpower(date.toISOString())
    }, [date])
  }






  return (
    <div>
      <div className="grid grid-cols-3 gap-5 w-full">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


              {/* Date picker field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="helper">Helper</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Worker field */}
              <FormField
                control={form.control}
                name="worker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of workers"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OT field */}
              <FormField
                control={form.control}
                name="OT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OT (Overtime)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number OT hour"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <div className="col-span-2">
          <DataTable overTime={overTime} />
        </div>
      </div>
    </div>
  )
}
