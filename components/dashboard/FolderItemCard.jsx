
import { User, Calendar, StopCircle, PlayCircle, Pencil, Eye } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { platformConfig } from "@/lib/constants"
import FolderCard from "@/components/dashboard/FolderCard"
import { useToast } from "@/hooks/use-toast"

export default function FolderItemCard({
    item,
    selectedIds,
    handleSelectItem,
    handleStatusFieldUpdate,
    handleEdit,
    handleViewAssignments,
    posts,
    handleViewPosts,
    handleOpenCreatePost,
    handleOpenBulkCreate,
    platform
}) {
    const { toast } = useToast()
    const formatDateTime = (dateString) => {
        if (!dateString) return "DD/MM/YYYY HH:MM"
        // If it's already formatted as DD/MM/YYYY HH:MM (from handleStatusFieldUpdate), return as is
        if (dateString.includes("/") && dateString.includes(":")) return dateString

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) + " " + date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <Card
            className={`transition-all ${selectedIds.includes(item.id) ? "ring-2 ring-blue-500" : ""}`}
        >
            <CardHeader className={`${platformConfig[platform]?.bgColor} border-b py-4`}>
                {/* Row 1: No. + Folder Name + Idea/Niche/Type + Created/Updated + Edit */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                        />

                        <Badge variant="secondary" className="bg-[#509485] text-white hover:bg-[#3e7d71]">
                            No. {item.id}
                        </Badge>

                        <div className="flex items-center gap-2">
                            <div
                                className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-gray-200 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
                                title={item.folderName}
                            >
                                <span className="text-sm text-gray-700 font-medium">{item.folderName}</span>
                            </div>

                            <span className="text-xs text-gray-600 font-medium">Idea:</span>
                            <span className="text-sm font-medium text-blue-600">{item.idea}</span>

                            <span className="text-xs text-gray-600 font-medium">Niche:</span>
                            {item.niche.map((niche, index) => (
                                <span key={index} className="text-sm font-medium text-blue-700">
                                    {niche}
                                </span>
                            ))}

                            <span className="text-xs text-gray-600 font-medium">Type:</span>
                            <span
                                className={`text-sm font-semibold ${item.type === "TM" ? "text-red-600" : "text-blue-600"}`}
                            >
                                {item.type}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-gray-700">
                                <span className="font-medium">Created:</span> {item.createdBy}: {formatDateTime(item.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-gray-700">
                                <span className="font-medium">Updated:</span> {item.updatedBy}: {formatDateTime(item.updatedAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                            {/* View Assignments Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAssignments(item.id, item.folderName)}
                                className="flex items-center gap-1 bg-[#F0F4F8] text-[#334155] hover:bg-[#EFF6FF] border-[#CBD5E1]"
                                title="View Assigned Managers"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>

                            {/* Start/Stop Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newStatus = item.statusContentFolder === "Start" ? "Stop" : "Start"
                                    handleStatusFieldUpdate(item.id, "statusContentFolder", newStatus)
                                    toast({
                                        title: newStatus === "Start" ? "▶️ Status Started" : "⏹️ Status Stopped",
                                        description: `Folder "${item.folderName}" status changed to ${newStatus}.`,
                                    })
                                }}
                                className={`flex items-center gap-1 ${item.statusContentFolder === "Stop"
                                    ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-300"
                                    : "bg-green-50 text-green-600 hover:bg-green-100 border-green-300"
                                    }`}
                            >
                                {item.statusContentFolder === "Stop" ? (
                                    <StopCircle className="h-4 w-4" />
                                ) : (
                                    <PlayCircle className="h-4 w-4" />
                                )}
                                {item.statusContentFolder}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="flex items-center gap-1"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Row 2: Username info (LEFT) + Department/Team/Leader (RIGHT) */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    {/* Left side: Group + Username + Status + Login */}
                    <div className="flex gap-2 flex-wrap items-center">
                        {item.groupAccountSocial && (
                            <>
                                <span className="text-sm text-gray-600">Group:</span>
                                <span className="text-sm font-medium text-blue-700">{item.groupAccountSocial}</span>
                                <span className="text-sm text-gray-600">|</span>
                            </>
                        )}
                        <span className="text-sm text-gray-600">username account:</span>
                        <span className="text-sm font-medium text-blue-700">
                            {item.usernameSocial.startsWith("@") || item.usernameSocial.startsWith("r/")
                                ? item.usernameSocial
                                : `@${item.usernameSocial}`}
                        </span>
                        <span className="text-sm text-gray-600">| Status Account Social:</span>
                        <span className={`text-sm font-medium ${item.statusAccountSocial === 'Available New' ? 'text-green-600' :
                            item.statusAccountSocial === 'Checkpoint' ? 'text-orange-600' :
                                item.statusAccountSocial === 'InUseDevice' ? 'text-blue-600' :
                                    item.statusAccountSocial === 'LockedOnDevice' ? 'text-red-600' :
                                        item.statusAccountSocial === 'Dead' ? 'text-gray-600' :
                                            item.statusAccountSocial === 'NetworkError' ? 'text-purple-600' :
                                                item.statusAccountSocial === 'Spam' ? 'text-yellow-600' :
                                                    'text-slate-600'
                            }`}>
                            {item.statusAccountSocial}
                        </span>
                        <span className="text-sm text-gray-600">| Login App Clone:</span>
                        <span className={`text-sm font-medium ${item.loginAppClone === 'Active' ? 'text-green-600' :
                            item.loginAppClone === 'Dead' ? 'text-red-600' :
                                item.loginAppClone === 'LockedOnDevice' ? 'text-orange-600' :
                                    item.loginAppClone === 'LoginError' ? 'text-pink-600' :
                                        item.loginAppClone === 'NetworkError' ? 'text-purple-600' :
                                            item.loginAppClone === 'Spam' ? 'text-yellow-600' :
                                                item.loginAppClone === 'ErrorAppClone' ? 'text-rose-600' :
                                                    'text-slate-600'
                            }`}>
                            {item.loginAppClone}
                        </span>
                    </div>

                    {/* Right side: Department/Team/Leader */}
                    <div className="flex gap-2 flex-wrap items-center ml-4 flex-shrink-0">
                        <span className="text-sm text-gray-600 font-medium">Department:</span>
                        <span className="text-sm font-medium text-orange-700">{item.departmentWorks}</span>
                        <span className="text-sm text-gray-600 font-medium">Team:</span>
                        <span className="text-sm font-medium text-blue-700">{item.groupWork}</span>
                        <span className="text-sm text-gray-600 font-medium">Leader:</span>
                        <span className="text-sm font-medium text-green-700">{item.userWorks}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FolderCard
                        number={1}
                        title="New (Square)"
                        folderPosts={posts[`${item.id}-new`] || []}
                        ideaNicheId={item.id}
                        folderType="new"
                        handleViewPosts={handleViewPosts}
                        handleOpenCreatePost={handleOpenCreatePost}
                        handleOpenBulkCreate={handleOpenBulkCreate}
                        updatedAt={formatDateTime(item.newStatusChangedAt)}
                    />
                    <FolderCard
                        number={2}
                        title="Reel (Vertical)"
                        folderPosts={posts[`${item.id}-reel`] || []}
                        ideaNicheId={item.id}
                        folderType="reel"
                        handleViewPosts={handleViewPosts}
                        handleOpenCreatePost={handleOpenCreatePost}
                        handleOpenBulkCreate={handleOpenBulkCreate}
                        updatedAt={formatDateTime(item.reelStatusChangedAt)}
                    />
                    <FolderCard
                        number={3}
                        title="Square Product"
                        folderPosts={posts[`${item.id}-squareProduct`] || []}
                        ideaNicheId={item.id}
                        folderType="squareProduct"
                        handleViewPosts={handleViewPosts}
                        handleOpenCreatePost={handleOpenCreatePost}
                        handleOpenBulkCreate={handleOpenBulkCreate}
                        updatedAt={formatDateTime(item.squareProductStatusChangedAt)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
