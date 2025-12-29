
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BulkCreateModal({
    isOpen,
    onOpenChange,
    data,
    onUpdateData,
    onCreate,
}) {
    const { toast } = useToast()

    const handleBulkCreate = () => {
        onCreate()
        toast({
            title: "📦 Bulk Posts Created",
            description: `${data.quantity} draft posts have been created for "${data.folderName}".`,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-purple-600" />
                        Bulk Create Posts
                    </DialogTitle>
                    <DialogDescription>
                        Create multiple posts at once for{" "}
                        <span className="font-semibold text-purple-600">{data.folderName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Posts</label>
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={data.quantity}
                            onChange={(e) =>
                                onUpdateData({ quantity: Number.parseInt(e.target.value) || 1 })
                            }
                            placeholder="Enter quantity (1-100)"
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                            All posts will be created with status <span className="font-semibold">Draft</span>
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                        <p className="text-sm font-medium text-blue-900">Quick Tips:</p>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>Each post will have a unique caption: "Draft 1", "Draft 2", etc.</li>
                            <li>Media files will be empty - you can upload them individually later</li>
                            <li>You can edit each post's caption and upload media after creation</li>
                            <li>Recommended: 5-20 posts per batch</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleBulkCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Posts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
