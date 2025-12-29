
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange,
    selectedCount,
    onSelectAll,
    onDeleteSelected,
    allSelected,
}) {
    return (
        <div className="flex items-center justify-between border-2 border-gray-300 rounded-lg p-4 bg-gray-50/50">
            {/* Left side - Bulk actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
                    <span className="text-sm text-gray-600">Select All ({selectedCount} selected)</span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDeleteSelected}
                    className="text-red-600 hover:bg-transparent hover:text-red-700"
                    disabled={selectedCount === 0}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete ({selectedCount})
                </Button>

                <span className="text-sm text-gray-600">Total: {totalItems} items</span>
            </div>

            {/* Right side - Pagination */}
            <div className="flex items-center gap-3">
                {/* Range display */}
                <span className="text-sm text-gray-600 font-medium">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                    {/* Previous button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white border-gray-300 hover:bg-gray-100"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page number buttons */}
                    {(() => {
                        const pages = []
                        const maxVisiblePages = 5
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                        // Adjust start if we're near the end
                        if (endPage - startPage < maxVisiblePages - 1) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1)
                        }

                        // First page and ellipsis
                        if (startPage > 1) {
                            pages.push(
                                <Button
                                    key={1}
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    className={`h-8 w-8 ${currentPage === 1 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border-gray-300 hover:bg-gray-100"}`}
                                    onClick={() => onPageChange(1)}
                                >
                                    1
                                </Button>
                            )
                            if (startPage > 2) {
                                pages.push(
                                    <span key="start-ellipsis" className="px-1 text-gray-500">...</span>
                                )
                            }
                        }

                        // Page numbers
                        for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                                <Button
                                    key={i}
                                    variant={currentPage === i ? "default" : "outline"}
                                    size="icon"
                                    className={`h-8 w-8 ${currentPage === i ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border-gray-300 hover:bg-gray-100"}`}
                                    onClick={() => onPageChange(i)}
                                >
                                    {i}
                                </Button>
                            )
                        }

                        // Last page and ellipsis
                        if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                                pages.push(
                                    <span key="end-ellipsis" className="px-1 text-gray-500">...</span>
                                )
                            }
                            pages.push(
                                <Button
                                    key={totalPages}
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    className={`h-8 w-8 ${currentPage === totalPages ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border-gray-300 hover:bg-gray-100"}`}
                                    onClick={() => onPageChange(totalPages)}
                                >
                                    {totalPages}
                                </Button>
                            )
                        }

                        return pages
                    })()}

                    {/* Next button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-white border-gray-300 hover:bg-gray-100"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Items per page */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
                        <SelectTrigger className="w-16 h-8 bg-white border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
