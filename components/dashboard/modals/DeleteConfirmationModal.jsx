
import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DeleteConfirmationModal({
    isOpen,
    onOpenChange,
    data,
    selectedCount,
    onConfirm,
    onCancel,
}) {
    const { toast } = useToast()

    const handleConfirmDelete = () => {
        onConfirm()
        toast({
            title: "🗑️ Deleted Successfully",
            description: data.type === "bulk"
                ? `${selectedCount} item(s) have been deleted.`
                : `Post #${data.postNumber} has been deleted.`,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{
                    top: data.position?.top,
                    left: data.position?.left,
                    transform: `translate(${data.position?.left ? "-100%" : "0%"}, ${data.position?.top ? "-100%" : "0%"})`,
                    display: isOpen ? "flex" : "none",
                    position: "absolute",
                    width: "auto",
                    height: "auto",
                }}
            >
                <DialogContent className="p-0 shadow-lg border-none" style={{ padding: "0px", width: "auto" }}>
                    <Card className="border-0 shadow-none">
                        <CardHeader className="p-4 pb-2 flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Confirm Deletion</CardTitle>
                            <button onClick={onCancel}>
                                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            {data.type === "bulk" ? (
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to delete {selectedCount} selected item(s)? This action cannot be undone.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to delete post #{data.postNumber}? This action cannot be undone.
                                </p>
                            )}
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                </DialogContent>
            </div>
        </Dialog>
    )
}
