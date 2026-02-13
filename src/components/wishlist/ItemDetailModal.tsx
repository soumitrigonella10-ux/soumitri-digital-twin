"use client";

import Image from "next/image";
import { X, ExternalLink, ShoppingBag, Trash2 } from "lucide-react";
import { WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemDetailModalProps {
  item: WishlistItem;
  isAuthenticated: boolean;
  onClose: () => void;
  onMarkPurchased?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSignInPrompt?: () => void;
}

export function ItemDetailModal({
  item,
  isAuthenticated,
  onClose,
  onMarkPurchased,
  onRemove,
  onSignInPrompt,
}: ItemDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{item.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {item.imageUrl && (
            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                quality={95}
                priority
              />
            </div>
          )}

          <div className="space-y-2">
            <div><strong>Category:</strong> {item.category}</div>
            {item.price && (
              <div><strong>Price:</strong> ₹{item.price}</div>
            )}
            <div><strong>Priority:</strong> {item.priority}</div>
            {isAuthenticated && (
              <div><strong>Added:</strong> {new Date(item.dateAdded).toLocaleDateString()}</div>
            )}
            {isAuthenticated && item.purchased && item.purchaseDate && (
              <div><strong>Purchased:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</div>
            )}
          </div>

          {item.notes && (
            <div>
              <strong>Notes:</strong>
              <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {item.websiteUrl && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(item.websiteUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
            )}

            {isAuthenticated ? (
              <>
                {!item.purchased && onMarkPurchased && (
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => onMarkPurchased(item.id)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Mark Purchased
                  </Button>
                )}
                {onRemove && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="default"
                className="flex-1"
                onClick={onSignInPrompt}
              >
                Sign In to Manage
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
