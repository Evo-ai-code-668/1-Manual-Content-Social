
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { platformConfig } from "@/lib/constants"
import PaginationControls from "./PaginationControls"
import FolderItemCard from "./FolderItemCard"

export default function ContentGrid({
    platform,
    platformItems = [],
    currentItems = [],
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    selectedIds,
    handleSelectAll,
    handleBulkDelete,
    handleSelectItem,
    handleStatusFieldUpdate,
    handleEdit, // Wrapper function that calls setEditingItem, setIsEditModalOpen, handleOpenEdit
    handleViewAssignments,
    handleViewPosts,
    handleOpenCreatePost,
    handleOpenBulkCreate,
    posts
}) {
    const totalItems = platformItems.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    if (totalItems === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <PaginationControls
                            totalPages={1}
                            currentPage={1}
                            itemsPerPage={10}
                            totalItems={0}
                            onPageChange={() => { }}
                            onItemsPerPageChange={() => { }}
                            selectedCount={0}
                            onSelectAll={() => { }}
                            onDeleteSelected={() => { }}
                            allSelected={false}
                        />

                        <div className="flex items-center justify-between py-3 border-y">
                            <div className="flex items-center gap-4">
                                <Checkbox checked={false} disabled className="border-gray-300" />
                                <span className="text-sm text-gray-600">Select All (0 selected)</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 bg-transparent border-transparent hover:bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                            <span className="text-sm text-gray-600">Total: 0 items</span>
                        </div>

                        <div className="flex flex-col items-center justify-center py-20">
                            <div
                                className={`w-24 h-24 ${platformConfig[platform]?.bgColor || "bg-gray-100"} rounded-lg flex items-center justify-center mb-4`}
                            >
                                <div className="text-4xl">{platformConfig[platform]?.icon}</div>
                            </div>
                            <p className="text-gray-500 text-center">
                                No Works Folder Images yet for {platformConfig[platform]?.name || "this platform"}.
                                <br />
                                Press the "Create New" button to get started.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value)
                            setCurrentPage(1)
                        }}
                        selectedCount={selectedIds.length}
                        onSelectAll={handleSelectAll}
                        onDeleteSelected={handleBulkDelete}
                        allSelected={selectedIds.length === currentItems.length && currentItems.length > 0}
                    />

                    <div className="space-y-3">
                        {currentItems.map((item) => (
                            <FolderItemCard
                                key={item.id}
                                item={item}
                                selectedIds={selectedIds}
                                handleSelectItem={handleSelectItem}
                                handleStatusFieldUpdate={handleStatusFieldUpdate}
                                handleEdit={handleEdit}
                                handleViewAssignments={handleViewAssignments}
                                posts={posts}
                                handleViewPosts={handleViewPosts}
                                handleOpenCreatePost={handleOpenCreatePost}
                                handleOpenBulkCreate={handleOpenBulkCreate}
                                platform={platform}
                            />
                        ))}
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => {
                            setItemsPerPage(value)
                            setCurrentPage(1)
                        }}
                        selectedCount={selectedIds.length}
                        onSelectAll={handleSelectAll}
                        onDeleteSelected={handleBulkDelete}
                        allSelected={selectedIds.length === currentItems.length && currentItems.length > 0}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
