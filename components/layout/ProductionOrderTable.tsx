import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductionOrderTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch('/api/production-order');
      const data = await response.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <Table>
      <TableCaption>A list of production orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Program Code</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Style No</TableHead>
          <TableHead>Order Qty</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.programCode}</TableCell>
            <TableCell>{order.buyer}</TableCell>
            <TableCell>{order.item}</TableCell>
            <TableCell>{order.styleNo}</TableCell>
            <TableCell>{order.orderQty}</TableCell>
            <TableCell>{order.percentage}</TableCell>
            <TableCell>{order.unitPrice}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(order.updatedAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 