import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils/formatting";
import { calculatePurchaseStatus } from "@/lib/utils/wishlist";
import { getPriorityColor, getNecessityColor } from "@/lib/utils/category-colors";
import { getPriorityLabel, getNecessityLabel } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { WishlistItem } from "@/types";

interface WishlistTableProps {
  wishlist: WishlistItem[];
  loading: boolean;
  balance: number;
  onEdit: (item: WishlistItem) => void;
  onDelete: (item: WishlistItem) => void;
}

export function WishlistTable({
  wishlist,
  loading,
  balance,
  onEdit,
  onDelete,
}: WishlistTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }
  const activeItems = wishlist.filter((item) => !item.is_purchased);
  if (activeItems.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No wishlist items yet. Start by adding items you want to purchase.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Priority</TableHead>
            <TableHead>Necessity</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[150px] text-right">Cost</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeItems.map((item) => {
            const { priority, necessity, cost, id, item_name } = item;
            const { purchaseScore, status, statusColor } = calculatePurchaseStatus(
              priority,
              necessity,
              cost,
              balance
            );
            return (
              <TableRow key={id}>
                <TableCell>
                  <Badge className={getPriorityColor(priority)}>{getPriorityLabel(priority)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getNecessityColor(necessity)}>
                    {getNecessityLabel(necessity)}
                  </Badge>
                </TableCell>
                <TableCell>{item_name}</TableCell>
                <TableCell className="text-right">{formatCurrency(cost)}</TableCell>
                <TableCell>{purchaseScore.toFixed(1)}</TableCell>
                <TableCell>
                  <Badge className={statusColor}>{status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
