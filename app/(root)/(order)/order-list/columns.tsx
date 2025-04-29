"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./RowActions";

export type Payment = {
  id: string;
  programCode: string;
  buyer: string;
  item: string;
  styleNo: string;
  orderQty: number;
  percentage: number;
  unitPrice: number;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "programCode", header: "Program Code" },
  { accessorKey: "buyer", header: "Buyer" },
  { accessorKey: "item", header: "Item" },
  { 
    accessorKey: "styleNo",
     header: "Style No",
     cell: ({ row }) => {
      const styleNo = row.getValue("styleNo") as string;
  
      const statusColor = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
      };
  
      return (
        <span
          className="text-red-600"
        >
          {styleNo}
        </span>
      );
    },
  },
  { accessorKey: "orderQty", header: "Order Qty" },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => `${row.getValue("percentage")}%`,
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => `$${row.getValue("unitPrice")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
  
      let badgeVariant: "default" | "success" | "destructive" | "secondary" = "default";
      let textColorClass = "";
      let bgColorClass = "";
  
      switch (status) {
        case "PENDING":
          badgeVariant = "secondary";
          bgColorClass = "bg-yellow-100";
          textColorClass = "text-yellow-800";
          break;
        case "IN_PROGRESS":
          badgeVariant = "default";
          bgColorClass = "bg-blue-100 hover:bg-blue-50";
          textColorClass = "text-blue-800";
          break;
        case "COMPLETED":
          badgeVariant = "success";
          bgColorClass = "bg-green-100";
          textColorClass = "text-green-800";
          break;
        case "CANCELLED":
          badgeVariant = "destructive";
          bgColorClass = "bg-red-100";
          textColorClass = "text-red-800";
          break;
        default:
          badgeVariant = "default";
          bgColorClass = "bg-gray-100";
          textColorClass = "text-gray-800";
          break;
      }
  
      return (
        <Badge
          className={`${bgColorClass} ${textColorClass}`}
          variant={badgeVariant}
        >
          {status}
        </Badge>
      );
    },
  },
  
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) =>
  //     new Date(row.getValue("createdAt")).toLocaleDateString("en-GB"),
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return <RowActions payment={payment} />;
    },
  },
];
