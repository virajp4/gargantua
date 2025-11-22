"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WishlistTable } from "@/components/dashboard/WishlistTable";
import { WishlistDialog } from "@/components/dialogs/WishlistDialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/DeleteConfirmationDialog";
import { createClient } from "@/lib/supabase/client";
import { createWishlistService } from "@/lib/services/wishlist";
import { WishlistItem } from "@/types";
import { WishlistFormData } from "@/lib/validations";

interface WishlistCardProps {
  balance: number;
}

export function WishlistCard({ balance }: WishlistCardProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<WishlistItem | null>(null);

  const supabase = createClient();
  const wishlistService = createWishlistService(supabase);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    const data = await wishlistService.fetchWishlist();
    setWishlist(data);
    setLoading(false);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (item: WishlistItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: WishlistFormData) => {
    if (editingItem) {
      const updated = await wishlistService.updateWishlistItem(editingItem.id, {
        item_name: data.itemName,
        cost: data.cost,
        priority: data.priority,
        necessity: data.necessity,
      });
      setWishlist((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } else {
      const newItem = await wishlistService.addWishlistItem({
        item_name: data.itemName,
        cost: data.cost,
        priority: data.priority,
        necessity: data.necessity,
      });
      setWishlist((prev) => [newItem, ...prev]);
    }
    setDialogOpen(false);
    setEditingItem(null);
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      await wishlistService.deleteWishlistItem(deletingItem.id);
      setWishlist((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  return (
    <>
      <Card className="flex flex-col gap-4 px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Wishlist</h2>
          <Button onClick={handleAddItem} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
        <WishlistTable
          wishlist={wishlist}
          loading={loading}
          balance={balance}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
      <WishlistDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        editData={editingItem}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Wishlist Item"
        description="Are you sure you want to delete this wishlist item? This action cannot be undone."
      />
    </>
  );
}
