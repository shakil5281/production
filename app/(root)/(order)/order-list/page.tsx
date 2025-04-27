'use client';

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function ClientPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get<any[]>("/production-order");
        setPosts(res.data); // ✅ Don't slice, let TanStack handle pagination
      } catch (err) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <FullScreenLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold">All Order list</h2>
      <DataTable columns={columns} data={posts} />
    </div>
  );
}
