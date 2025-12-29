
import { FolderOpen, Eye, Plus, Layers } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function FolderCard({
    title,
    number,
    folderPosts = [],
    ideaNicheId,
    folderType,
    handleViewPosts,
    handleOpenCreatePost,
    handleOpenBulkCreate,
    updatedAt
}) {
    const postsCount = folderPosts.length

    const statusCounts = {
        draft: folderPosts.filter((p) => p.status === "draft").length,
        Use: folderPosts.filter((p) => p.status === "Use").length,
        Posted: folderPosts.filter((p) => p.status === "Posted").length,
        "Posting Error": folderPosts.filter((p) => p.status === "Posting Error").length,
    }

    const autoStatus = statusCounts.Use >= 1 ? "Start" : "Stop"

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {number && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1e9df1] text-white text-xs font-bold">
                            {number}
                        </div>
                    )}
                    <FolderOpen className="h-4 w-4" />
                    {title}
                    <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${autoStatus === "Start" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                    >
                        {autoStatus}
                    </span>
                    {updatedAt && (
                        <div className="flex items-center gap-1 ml-2">
                            <span className="text-gray-400 font-medium">&gt;</span>
                            <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${autoStatus === "Start" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {updatedAt}
                            </span>
                        </div>
                    )}
                    <Badge variant="secondary" className="ml-auto bg-[#1e9df1] text-white hover:bg-[#1e9df1] hover:text-white">
                        {postsCount} Posts
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {folderPosts.slice(0, 6).map((post) => (
                        <div key={post.id} className="relative group">
                            <img
                                src={post.mediaFiles[0]?.url || "/placeholder.svg"}
                                alt="Post preview"
                                className="w-10 h-10 object-cover rounded border cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => handleViewPosts(ideaNicheId, folderType, title)}
                            />
                            {post.mediaFiles.length > 1 && (
                                <div className="absolute top-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded-bl">
                                    {post.mediaFiles.length}
                                </div>
                            )}
                        </div>
                    ))}
                    {postsCount > 6 && (
                        <div
                            className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleViewPosts(ideaNicheId, folderType, title)}
                        >
                            +{postsCount - 6}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-1">
                    <span className="inline-flex items-center justify-center px-1.5 py-1 bg-gray-50 rounded border border-gray-200 text-[10px] font-medium text-gray-700">
                        Draft ({statusCounts.draft})
                    </span>
                    <span className="inline-flex items-center justify-center px-1.5 py-1 bg-blue-50 rounded border border-blue-200 text-[10px] font-medium text-blue-700">
                        Use ({statusCounts.Use})
                    </span>
                    <span className="inline-flex items-center justify-center px-1.5 py-1 bg-green-50 rounded border border-green-200 text-[10px] font-medium text-green-700">
                        Posted ({statusCounts.Posted})
                    </span>
                    <span className="inline-flex items-center justify-center px-1.5 py-1 bg-red-50 rounded border border-red-200 text-[10px] font-medium text-red-700">
                        Error ({statusCounts["Posting Error"]})
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPosts(ideaNicheId, folderType, title)}
                        className="h-7 text-xs bg-[#F0F4F8] hover:bg-slate-200 text-slate-700 border-slate-300"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        View Post All ({postsCount})
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                                <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenCreatePost(ideaNicheId, folderType, title)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Single Post
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenBulkCreate(ideaNicheId, folderType, title)}>
                                <Layers className="h-4 w-4 mr-2" />
                                Bulk Create Posts
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
