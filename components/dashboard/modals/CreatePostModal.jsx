
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Play, Film, ImageIcon, Save, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreatePostModal({
    isOpen,
    onOpenChange,
    data,
    onUpdateData,
    onSave,
    posts,
}) {
    const { toast } = useToast()

    // Helpers
    const handlePostMediaUpload = (e) => {
        const files = Array.from(e.target.files)
        const existingFileSignatures = data.mediaFiles.map(
            (m) => `${m.file ? m.file.name + "-" + m.file.size : m.name + "-" + m.id}`,
        )

        const newFiles = files.filter((file) => {
            const signature = `${file.name}-${file.size}`
            return !existingFileSignatures.includes(signature)
        })

        if (newFiles.length < files.length) {
            const duplicateCount = files.length - newFiles.length
            toast({
                variant: "destructive",
                title: "⚠️ Duplicate Files Skipped",
                description: `${duplicateCount} duplicate file(s) detected and skipped.`,
            })
        }

        if (newFiles.length === 0) return

        const currentMediaCount = data.mediaFiles.length
        const mediaFilesToAdd = newFiles.map((file, index) => ({
            id: Date.now() + Math.random(),
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type.startsWith("video/") ? "video" : "image",
            order: currentMediaCount + index + 1,
        }))

        onUpdateData({
            mediaFiles: [...data.mediaFiles, ...mediaFilesToAdd].sort((a, b) => a.order - b.order),
        })

        toast({
            title: "📤 Files Uploaded",
            description: `${newFiles.length} file(s) uploaded successfully.`,
        })
    }

    const handleReorderMedia = (dragIndex, hoverIndex) => {
        const draggingItem = data.mediaFiles[dragIndex]
        const updatedMedia = [...data.mediaFiles]
        updatedMedia.splice(dragIndex, 1)
        updatedMedia.splice(hoverIndex, 0, draggingItem)

        // Reassign order numbers
        const reorderedMedia = updatedMedia.map((item, index) => ({
            ...item,
            order: index + 1,
        }))

        onUpdateData({ mediaFiles: reorderedMedia })
    }

    const handleRemovePostMedia = (mediaId) => {
        const removedMedia = data.mediaFiles.find((media) => media.id === mediaId)
        const updatedMedia = data.mediaFiles
            .filter((media) => media.id !== mediaId)
            .map((media, index) => ({
                ...media,
                order: index + 1,
            }))

        onUpdateData({ mediaFiles: updatedMedia })

        toast({
            title: "🗑️ Media Removed",
            description: `"${removedMedia?.name || 'File'}" has been removed.`,
        })
    }

    const nextPostNumber = (posts[`${data.ideaNicheId}-${data.folderType}`]?.length || 0) + 1

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Create Instagram Post - {data.folderName}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Post #{nextPostNumber}
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Caption Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="caption" className="text-sm font-semibold text-gray-700">
                                Caption
                            </Label>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-[#91bfb4] font-semibold">
                                    {(data.caption.match(/#\w+/g) || []).length} hashtags
                                </span>
                                <span className="text-gray-500">{data.caption.length} chars</span>
                                <span className="text-[#F7B928] font-semibold">
                                    {(data.caption.match(/https?:\/\/[^\s]+/g) || []).length} Links
                                </span>
                            </div>
                        </div>
                        <textarea
                            id="caption"
                            value={data.caption}
                            onChange={(e) => onUpdateData({ caption: e.target.value })}
                            placeholder="Write your Instagram caption here... Use hashtags (#) for better reach"
                            className="w-full min-h-[140px] p-4 border-2 rounded-lg mt-1 resize-y focus:ring-2 focus:ring-[#91bfb4] focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-400">
                            💡 Tip: Use relevant hashtags (starts with #) and @mentions to increase engagement
                        </p>
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold text-gray-700">Media Files (Images & Videos)</Label>
                            <span className="text-xs text-gray-500">
                                {data.mediaFiles.length} file{data.mediaFiles.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handlePostMediaUpload}
                            className="hidden"
                            id="post-media-upload"
                        />
                        <label
                            htmlFor="post-media-upload"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#91bfb4] hover:bg-[#91bfb4]/5 transition-all group"
                        >
                            <Upload className="h-10 w-10 text-gray-400 group-hover:text-[#91bfb4] transition-colors mb-3" />
                            <p className="text-sm font-medium text-gray-600 group-hover:text-[#91bfb4]">
                                Click to upload images or videos
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, MP4, MOV • Multiple files allowed</p>
                            <p className="text-xs-[#91bfb4] font-medium">⚠ Duplicate files will be automatically skipped</p>
                        </label>
                    </div>

                    {/* Media Preview with Ordering */}
                    {data.mediaFiles.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-700">Media Preview & Order</Label>
                                <span className="text-xs text-[#91bfb4] font-medium">Drag to reorder</span>
                            </div>

                            <div className="grid grid-cols-5 gap-3">
                                {data.mediaFiles
                                    .sort((a, b) => a.order - b.order)
                                    .map((media, index) => (
                                        <div
                                            key={media.id}
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData("dragIndex", index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                const dragIndex = Number.parseInt(e.dataTransfer.getData("dragIndex"))
                                                handleReorderMedia(dragIndex, index)
                                            }}
                                            className="relative group cursor-move border-2 border-gray-200 rounded-lg hover:border-[#91bfb4] transition-all"
                                        >
                                            {/* Order Number Badge */}
                                            <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-[#91bfb4] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                                {media.order}
                                            </div>

                                            {media.type === "video" ? (
                                                <div className="relative">
                                                    <video
                                                        src={media.url}
                                                        className="w-full h-28 object-cover rounded-md bg-black"
                                                        muted
                                                        playsInline
                                                        onMouseEnter={(e) => e.target.play()}
                                                        onMouseLeave={(e) => {
                                                            e.target.pause()
                                                            e.target.currentTime = 0
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="bg-black/60 rounded-full p-2">
                                                            <Play className="h-6 w-6 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-lg flex items-center gap-1">
                                                        <Film className="h-3 w-3" />
                                                        VIDEO
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <img
                                                        src={media.url || "/placeholder.svg"}
                                                        alt={`Media ${media.order}`}
                                                        className="w-full h-28 object-cover rounded-md"
                                                    />
                                                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-lg flex items-center gap-1">
                                                        <ImageIcon className="h-3 w-3" />
                                                        IMAGE
                                                    </div>
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemovePostMedia(media.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                                title="Remove media"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <p className="text-xs text-gray-500 italic flex items-center gap-1">
                                <GripVertical className="h-3 w-3" />
                                Media will be posted to Instagram in this exact order
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={!data.caption.trim() || data.mediaFiles.length === 0}
                        className="bg-[#91bfb4] hover:bg-[#7aaca4] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
