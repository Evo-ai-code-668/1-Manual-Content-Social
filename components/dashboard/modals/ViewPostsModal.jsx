
import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    FileImage,
    Play,
    FileText,
    Info,
    ChevronDown,
    ChevronRight,
    Trash2,
    Upload,
    X,
    ImageIcon,
    Instagram,
    FolderOpen,
    Clock,
    FileX,
    Film,
    User
} from "lucide-react"

export default function ViewPostsModal({
    isOpen,
    onOpenChange,
    data,
    onUpdatePosts,
    onDeleteRequest,
    onUploadMedia,
}) {
    // Local UI State
    const [selectedPostIndex, setSelectedPostIndex] = useState(0)
    const [selectedPostIds, setSelectedPostIds] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(10)
    const [viewGuideVisible, setViewGuideVisible] = useState(false)
    const [isCaptionCollapsed, setIsCaptionCollapsed] = useState(false)
    const [isMediaCollapsed, setIsMediaCollapsed] = useState(false)
    const [showAllMedia, setShowAllMedia] = useState({})
    const [statusFilter, setStatusFilter] = useState("all")
    const [deptFilter, setDeptFilter] = useState("all")
    const [userFilter, setUserFilter] = useState("all")
    // State for Edit Status confirmation popup
    const [statusEditConfirm, setStatusEditConfirm] = useState({ isOpen: false, targetStatus: null, message: null, type: null })
    // State for pending changes tracking (per post: { postId: { caption: string, mediaFiles: array } })
    const [pendingChanges, setPendingChanges] = useState({})
    // State for unsaved changes confirmation popup
    const [pendingChangeConfirm, setPendingChangeConfirm] = useState({ isOpen: false, targetIndex: null, message: null })

    const posts = data.posts || []

    useEffect(() => {
        if (isOpen) {
            setSelectedPostIndex(0)
            setSelectedPostIds([])
            setCurrentPage(1)
            setIsCaptionCollapsed(false)
            setIsMediaCollapsed(false)
            setShowAllMedia({})
            setStatusFilter("all")
            setDeptFilter("all")
            setUserFilter("all")
        }
    }, [isOpen])

    // Helpers - Memoized for performance
    const getStatusInfo = useCallback((status) => {
        switch (status?.toLowerCase()) {
            case "use": return { label: "Use", color: "bg-blue-100 text-blue-700 border-blue-200" }
            case "draft": return { label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
            case "posted": return { label: "Posted", color: "bg-green-100 text-green-700 border-green-200" }
            case "posting error": return { label: "Posting Error", color: "bg-red-100 text-red-700 border-red-200" }
            default: return { label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
        }
    }, [])

    const formatTimeUS = (timeStr) => {
        if (!timeStr) return ""
        const [hours, minutes] = timeStr.split(":")
        const date = new Date()
        date.setHours(parseInt(hours, 10))
        date.setMinutes(parseInt(minutes, 10))
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    // Memoized filtered posts - only recalculates when dependencies change
    const filteredPosts = useMemo(() => {
        let filtered = posts
        if (statusFilter !== "all") {
            filtered = filtered.filter((post) => (post.status?.toLowerCase() || "draft") === statusFilter.toLowerCase())
        }
        if (deptFilter !== "all") {
            filtered = filtered.filter((post) => post.createdBy?.department === deptFilter)
        }
        if (userFilter !== "all") {
            filtered = filtered.filter((post) => post.createdBy?.fullName === userFilter)
        }
        return filtered
    }, [posts, statusFilter, deptFilter, userFilter])

    // Memoized selected post - prevents recalculation on every render
    const selectedPost = useMemo(() => {
        const startIndex = (currentPage - 1) * postsPerPage
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)
        return paginatedPosts[selectedPostIndex] || null
    }, [filteredPosts, currentPage, postsPerPage, selectedPostIndex])

    // Memoized unique departments and users for filters
    const uniqueDepartments = useMemo(() => {
        const depts = new Set(posts.map(p => p.createdBy?.department).filter(Boolean))
        return Array.from(depts)
    }, [posts])

    const uniqueUsers = useMemo(() => {
        const users = new Set(posts.map(p => p.createdBy?.fullName).filter(Boolean))
        return Array.from(users)
    }, [posts])

    // Memoized pagination data
    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * postsPerPage
        return filteredPosts.slice(startIndex, startIndex + postsPerPage)
    }, [filteredPosts, currentPage, postsPerPage])

    const totalPages = useMemo(() => Math.ceil(filteredPosts.length / postsPerPage), [filteredPosts.length, postsPerPage])

    // Memoized event handlers
    // Show confirmation popup before bulk status edit
    const handleBulkStatusEdit = useCallback((newStatus) => {
        if (selectedPostIds.length === 0) return
        setStatusEditConfirm({
            isOpen: true,
            targetStatus: newStatus,
            message: `Are you sure you want to change status to "${newStatus}" for ${selectedPostIds.length} selected post(s)?`,
            type: 'confirm'
        })
    }, [selectedPostIds])

    // Execute the actual status change after confirmation
    const confirmStatusEdit = useCallback(() => {
        if (!statusEditConfirm.targetStatus) return
        const count = selectedPostIds.length
        selectedPostIds.forEach(postId => {
            onUpdatePosts(postId, { status: statusEditConfirm.targetStatus, statusChangedAt: new Date().toISOString() })
        })
        setSelectedPostIds([])
        // Show success message
        setStatusEditConfirm({
            isOpen: true,
            targetStatus: null,
            message: `Successfully changed status to "${statusEditConfirm.targetStatus}" for ${count} post(s)!`,
            type: 'success'
        })
        // Auto-close success message after 2 seconds
        setTimeout(() => {
            setStatusEditConfirm({ isOpen: false, targetStatus: null, message: null, type: null })
        }, 2000)
    }, [selectedPostIds, statusEditConfirm.targetStatus, onUpdatePosts])

    const handleReorderMediaInView = useCallback((postId, dragIndex, hoverIndex) => {
        const post = posts.find(p => p.id === postId)
        if (!post) return
        const newMedia = [...post.mediaFiles]
        const [reorderedItem] = newMedia.splice(dragIndex, 1)
        newMedia.splice(hoverIndex, 0, reorderedItem)
        const updatedMedia = newMedia.map((m, idx) => ({ ...m, order: idx + 1 }))
        onUpdatePosts(postId, { mediaFiles: updatedMedia })
    }, [posts, onUpdatePosts])

    const handlePostSelect = useCallback((index) => {
        setSelectedPostIndex(index)
    }, [])

    const isPostEditable = useCallback((status) => {
        const s = status?.toLowerCase()
        return s === "draft" || s === "posting error"
    }, [])

    const getStatusBadge = useCallback((status) => getStatusInfo(status), [getStatusInfo])

    // Check if a post has pending changes
    const hasPostPendingChanges = useCallback((postId) => {
        return pendingChanges[postId] !== undefined
    }, [pendingChanges])

    // Handle navigation with unsaved changes check
    const handleNavigateToPost = useCallback((targetIndex) => {
        const currentPost = filteredPosts[selectedPostIndex]
        if (currentPost && hasPostPendingChanges(currentPost.id)) {
            // Show confirmation popup
            setPendingChangeConfirm({
                isOpen: true,
                targetIndex,
                message: `You have unsaved changes for Post #${currentPost.postNumber}. Do you want to save before leaving?`
            })
        } else {
            setSelectedPostIndex(targetIndex)
        }
    }, [selectedPostIndex, filteredPosts, hasPostPendingChanges])

    // Save pending changes for a post
    const handleSavePostChanges = useCallback((postId) => {
        const changes = pendingChanges[postId]
        if (changes) {
            onUpdatePosts(postId, changes)
            // Remove from pending changes
            setPendingChanges(prev => {
                const newState = { ...prev }
                delete newState[postId]
                return newState
            })
        }
    }, [pendingChanges, onUpdatePosts])

    // Discard pending changes for a post
    const handleDiscardPostChanges = useCallback((postId) => {
        setPendingChanges(prev => {
            const newState = { ...prev }
            delete newState[postId]
            return newState
        })
    }, [])

    // Handle confirm navigation (save and navigate)
    const handleConfirmNavigationSave = useCallback(() => {
        const currentPost = filteredPosts[selectedPostIndex]
        if (currentPost) {
            handleSavePostChanges(currentPost.id)
        }
        setSelectedPostIndex(pendingChangeConfirm.targetIndex)
        setPendingChangeConfirm({ isOpen: false, targetIndex: null, message: null })
    }, [selectedPostIndex, filteredPosts, pendingChangeConfirm.targetIndex, handleSavePostChanges])

    // Handle confirm navigation (discard and navigate)
    const handleConfirmNavigationDiscard = useCallback(() => {
        const currentPost = filteredPosts[selectedPostIndex]
        if (currentPost) {
            handleDiscardPostChanges(currentPost.id)
        }
        setSelectedPostIndex(pendingChangeConfirm.targetIndex)
        setPendingChangeConfirm({ isOpen: false, targetIndex: null, message: null })
    }, [selectedPostIndex, filteredPosts, pendingChangeConfirm.targetIndex, handleDiscardPostChanges])

    // Track caption changes
    const handleCaptionChange = useCallback((postId, newCaption) => {
        setPendingChanges(prev => ({
            ...prev,
            [postId]: {
                ...(prev[postId] || {}),
                caption: newCaption
            }
        }))
    }, [])

    // Track media changes
    const handleMediaChange = useCallback((postId, newMediaFiles) => {
        setPendingChanges(prev => ({
            ...prev,
            [postId]: {
                ...(prev[postId] || {}),
                mediaFiles: newMediaFiles
            }
        }))
    }, [])

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setSelectedPostIds([])
                }
                onOpenChange(open)
            }}
        >
            <DialogContent className="max-w-[95vw] max-h-[98vh] p-0 overflow-hidden flex flex-col z-50 relative">
                {/* Status Edit Confirmation Popup - Inside Modal */}
                {statusEditConfirm.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => statusEditConfirm.type === 'success' ? setStatusEditConfirm({ isOpen: false, targetStatus: null, message: null, type: null }) : null}>
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            {statusEditConfirm.type === 'confirm' ? (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                                            <Info className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Confirm Status Change</h3>
                                        <p className="text-sm text-gray-600 mt-2">{statusEditConfirm.message}</p>
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStatusEditConfirm({ isOpen: false, targetStatus: null, message: null, type: null })}
                                            className="px-6"
                                        >
                                            No, Cancel
                                        </Button>
                                        <Button
                                            onClick={confirmStatusEdit}
                                            className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Yes, Confirm
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-700">Success!</h3>
                                    <p className="text-sm text-gray-600 mt-2">{statusEditConfirm.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Unsaved Changes Confirmation Popup - Inside Modal */}
                {pendingChangeConfirm.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100]">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
                                <p className="text-sm text-gray-600 mt-2">{pendingChangeConfirm.message}</p>
                            </div>
                            <div className="flex gap-2 justify-center flex-wrap">
                                <Button
                                    variant="outline"
                                    onClick={() => setPendingChangeConfirm({ isOpen: false, targetIndex: null, message: null })}
                                    className="px-4"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmNavigationDiscard}
                                    className="px-4 bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Discard
                                </Button>
                                <Button
                                    onClick={handleConfirmNavigationSave}
                                    className="px-4 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Save & Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="sticky top-0 z-10 bg-[#F0F4F8] border-b border-[#CBD5E1] shadow-md">
                    <div className="px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-[#0F172A]">{data.folderName}</DialogTitle>
                                <p className="text-sm text-[#64748B]"> {posts.length} posts in library</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-2 bg-white/60 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            {/* Display only the Type Post config matching folderType */}
                            {data.folderType === "new" && data.contentTypeConfigs?.new && (
                                <>
                                    <span className="font-bold text-gray-700 text-sm whitespace-nowrap">Schedule Auto Task Post</span>
                                    <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Type: New</span>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Time Range:</span>
                                        {(data.contentTypeConfigs.new.timeRanges || []).map((range, idx) => (
                                            <span key={idx} className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {formatTimeUS(range.from)} - {formatTimeUS(range.to)}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Day Of Weeks:</span>
                                        {(data.contentTypeConfigs.new.dayOfWeeks || []).map((day, idx, arr) => (
                                            <React.Fragment key={day}>
                                                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs font-medium">{day}</span>
                                                {idx < arr.length - 1 && <span className="text-gray-400">{">"}</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> US Timezone
                                    </span>
                                </>
                            )}

                            {/* Type: Reel - only show when folderType is reel */}
                            {data.folderType === "reel" && data.contentTypeConfigs?.reel && (
                                <>
                                    <span className="font-bold text-gray-700 text-sm whitespace-nowrap">Schedule Auto Task Post</span>
                                    <span className="font-semibold text-[#3B82F6] bg-[#DBEAFE] px-2 py-1 rounded">Type: Reel</span>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Time Range:</span>
                                        {(data.contentTypeConfigs.reel.timeRanges || []).map((range, idx) => (
                                            <span key={idx} className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {formatTimeUS(range.from)} - {formatTimeUS(range.to)}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Day Of Weeks:</span>
                                        {(data.contentTypeConfigs.reel.dayOfWeeks || []).map((day, idx, arr) => (
                                            <React.Fragment key={day}>
                                                <span className="text-[#3B82F6] bg-[#DBEAFE] px-1.5 py-0.5 rounded text-xs font-medium">{day}</span>
                                                {idx < arr.length - 1 && <span className="text-gray-400">{">"}</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> US Timezone
                                    </span>
                                </>
                            )}

                            {/* Type: Square Product - only show when folderType is squareProduct */}
                            {data.folderType === "squareProduct" && data.contentTypeConfigs?.squareProduct && (
                                <>
                                    <span className="font-bold text-gray-700 text-sm whitespace-nowrap">Schedule Auto Task Post</span>
                                    <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Type: Square Product</span>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Time Range:</span>
                                        {(data.contentTypeConfigs.squareProduct.timeRanges || []).map((range, idx) => (
                                            <span key={idx} className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {formatTimeUS(range.from)} - {formatTimeUS(range.to)}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-gray-500 text-xs">Day Of Weeks:</span>
                                        {(data.contentTypeConfigs.squareProduct.dayOfWeeks || []).map((day, idx, arr) => (
                                            <React.Fragment key={day}>
                                                <span className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-xs font-medium">{day}</span>
                                                {idx < arr.length - 1 && <span className="text-gray-400">{">"}</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> US Timezone
                                    </span>
                                </>
                            )}

                            {/* Fallback when no contentTypeConfigs or folderType doesn't match */}
                            {(!data.contentTypeConfigs ||
                                (data.folderType === "new" && !data.contentTypeConfigs?.new) ||
                                (data.folderType === "reel" && !data.contentTypeConfigs?.reel) ||
                                (data.folderType === "squareProduct" && !data.contentTypeConfigs?.squareProduct)) && (
                                    <span className="text-gray-500 text-xs">No schedule configured for this type</span>
                                )}
                        </div>
                    </div>
                </div>

                <div className="flex h-[calc(98vh-150px)]">
                    {/* Left Panel - Posts Library (45%) - Increased width to fit all dropdowns */}
                    <div className="w-[45%] min-w-[720px] bg-[#F8FAFC] border-r border-[#CBD5E1] flex flex-col shrink-0">
                        <div className="px-4 py-3 bg-white border-b border-[#CBD5E1]">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide whitespace-nowrap">
                                    Posts Library
                                </h3>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                {/* Left: Checkbox All + Trash */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Checkbox
                                        checked={posts.length > 0 && selectedPostIds.length === posts.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedPostIds(posts.map((p) => p.id))
                                            } else {
                                                setSelectedPostIds([])
                                            }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-shrink-0"
                                    />
                                    <span className="text-xs text-[#64748B] whitespace-nowrap">All</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={selectedPostIds.length === 0}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const rect = e.currentTarget.getBoundingClientRect()
                                            onDeleteRequest("bulk", null, null, { top: rect.bottom + 5, left: rect.left })
                                        }}
                                        className={`h-7 px-2 flex-shrink-0 flex items-center gap-1 ${selectedPostIds.length === 0 ? "opacity-40" : "opacity-100 hover:bg-red-50"
                                            }`}
                                    >
                                        <Trash2 className={`h-4 w-4 ${selectedPostIds.length > 0 ? "text-red-600" : "text-[#64748B]"}`} />
                                        {selectedPostIds.length > 0 && (
                                            <span className="text-xs font-bold text-red-600">({selectedPostIds.length})</span>
                                        )}
                                    </Button>
                                </div>
                                {/* Right: Filters */}
                                <div className="flex items-center gap-1 flex-wrap">
                                    <Select onValueChange={handleBulkStatusEdit} disabled={selectedPostIds.length === 0}>
                                        <SelectTrigger
                                            className={`w-[140px] h-7 text-xs flex-shrink-0 transition-opacity ${selectedPostIds.length === 0 ? "opacity-40" : "opacity-100"
                                                }`}
                                        >
                                            <SelectValue placeholder="Status Edit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Set to Draft</SelectItem>
                                            <SelectItem value="Use">Set to Use</SelectItem>
                                            <SelectItem value="Posted">Set to Posted</SelectItem>
                                            <SelectItem value="Posting Error">Set to Posting Error</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[140px] h-7 text-xs flex-shrink-0">
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Use">Use</SelectItem>
                                            <SelectItem value="Posted">Posted</SelectItem>
                                            <SelectItem value="Posting Error">Posting Error</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                                        <SelectTrigger className="w-[140px] h-7 text-xs flex-shrink-0">
                                            <SelectValue placeholder="All Dept" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Dept</SelectItem>
                                            {uniqueDepartments.map(dept => (
                                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={userFilter} onValueChange={setUserFilter}>
                                        <SelectTrigger className="w-[140px] h-7 text-xs flex-shrink-0">
                                            <SelectValue placeholder="All User" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All User</SelectItem>
                                            {uniqueUsers.map(user => (
                                                <SelectItem key={user} value={user}>{user}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredPosts.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center p-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-200 flex items-center justify-center">
                                            <FileImage className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">No posts found matching your criteria</p>
                                    </div>
                                </div>
                            ) : (
                                paginatedPosts
                                    .map((post, postIndex) => {
                                        const isSelected = selectedPostIndex === postIndex
                                        const isChecked = selectedPostIds.includes(post.id)
                                        return (
                                            <div
                                                key={post.id}
                                                onClick={() => handleNavigateToPost(postIndex)}
                                                className={`w-full rounded-lg border-2 transition-all cursor-pointer select-none ${isSelected
                                                    ? "border-2 ring-2 ring-blue-500"
                                                    : "border-[#E5E7EB] bg-white hover:border-[#CBD5E1] hover:shadow-sm"
                                                    }`}
                                            >
                                                <div
                                                    onClick={() => handleNavigateToPost(postIndex)}
                                                    className="flex items-center gap-3 p-3 border-b border-gray-100"
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedPostIds((prev) => [...prev, post.id])
                                                                // Auto-navigate to this post when checkbox is checked
                                                                handleNavigateToPost(postIndex)
                                                            } else {
                                                                setSelectedPostIds((prev) => prev.filter((id) => id !== post.id))
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(post.status).color
                                                            }`}
                                                    >
                                                        {getStatusBadge(post.status).label}
                                                    </span>
                                                    <div className="ml-auto px-3 py-1 bg-gradient-to-br from-[#91bfb4] to-[#6a9a8f] text-white rounded-full text-xs font-bold shadow">
                                                        #{post.postNumber}
                                                    </div>
                                                    {/* Update Button - Always visible, styled based on pending changes */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleSavePostChanges(post.id)
                                                        }}
                                                        disabled={!hasPostPendingChanges(post.id)}
                                                        className={`h-7 px-2 text-xs font-semibold ${hasPostPendingChanges(post.id)
                                                            ? "bg-green-500 text-white hover:bg-green-600 animate-pulse"
                                                            : "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"}`}
                                                    >
                                                        Update
                                                    </Button>
                                                    {/* CHANGE: Added confirmation dialog to individual trash icon */}
                                                    <div className="relative">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const rect = e.currentTarget.getBoundingClientRect()
                                                                onDeleteRequest("single", post.id, post.postNumber, { top: rect.bottom + 5, left: rect.left })
                                                            }}
                                                            className="h-7 w-7 p-0 flex-shrink-0 hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Row 2: Created/Updated info */}
                                                <div
                                                    onClick={() => setSelectedPostIndex(postIndex)}
                                                    className="flex items-center justify-between px-3 py-2 bg-[#F0F4F8] border-b border-[#CBD5E1] text-xs"
                                                >
                                                    <div className="text-[#334155] font-medium">
                                                        <span className="text-[#64748B]">Create:</span>{" "}
                                                        {post.createdAt
                                                            ? new Date(post.createdAt).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            }) +
                                                            " " +
                                                            new Date(post.createdAt).toLocaleTimeString("en-GB", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "DD/MM/YYYY HH:MM"}
                                                    </div>
                                                    <div className="text-[#3B82F6] font-medium">
                                                        <span className="text-[#64748B]">Updated:</span>{" "}
                                                        {post.statusChangedAt
                                                            ? new Date(post.statusChangedAt).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            }) +
                                                            " " +
                                                            new Date(post.statusChangedAt).toLocaleTimeString("en-GB", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "DD/MM/YYYY HH:MM"}
                                                    </div>
                                                </div>

                                                {/* Row 3: Department (left) + User (right) - separate row with border */}
                                                <div
                                                    onClick={() => setSelectedPostIndex(postIndex)}
                                                    className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#E5E7EB] text-xs"
                                                >
                                                    {/* Department - Left */}
                                                    <div className="flex items-center gap-1 text-[#334155] max-w-[50%] overflow-hidden">
                                                        <span className="text-[#64748B] flex-shrink-0">Dept:</span>
                                                        <span className="font-medium truncate" title={post.createdBy?.department || ""}>
                                                            {post.createdBy?.department || "—"}
                                                        </span>
                                                    </div>
                                                    {/* User - Right */}
                                                    <div className="flex items-center gap-1 text-[#334155] max-w-[45%] overflow-hidden">
                                                        <User className="h-3 w-3 text-[#3B82F6] flex-shrink-0" />
                                                        <span className="font-medium truncate" title={post.createdBy?.fullName || ""}>
                                                            {post.createdBy?.fullName || "—"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Row 2: Media Files */}
                                                <div className="w-full text-left">
                                                    <div className="p-3 border-b border-gray-100">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {post.mediaFiles.length > 0 ? (
                                                                <>
                                                                    {post.mediaFiles.slice(0, 4).map((media, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="relative w-12 h-12 rounded overflow-hidden border border-gray-200"
                                                                        >
                                                                            {media.type === "video" ? (
                                                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                                                    <Play className="h-5 w-5 text-white" />
                                                                                </div>
                                                                            ) : (
                                                                                <img
                                                                                    src={media.url || "/placeholder.svg"}
                                                                                    alt=""
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                    {post.mediaFiles.length > 4 && (
                                                                        <span className="text-xs text-gray-500 font-medium">
                                                                            +{post.mediaFiles.length - 4} more
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">No media files</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Row 3: Caption */}
                                                    <div className="p-3">
                                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                            {post.caption || <span className="italic text-gray-400">No caption</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                            )}
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-4 py-3 bg-white border-t border-[#CBD5E1] flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                                <span>
                                    {filteredPosts.length > 0
                                        ? `${(currentPage - 1) * postsPerPage + 1} to ${Math.min(currentPage * postsPerPage, filteredPosts.length)} of ${filteredPosts.length}`
                                        : "0"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage(Math.max(1, currentPage - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                    ◀
                                </button>
                                {Array.from({ length: totalPages || 1 }).map(
                                    (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-2 py-1 rounded ${currentPage === i + 1 ? "bg-[#3B82F6] text-white" : "hover:bg-[#EFF6FF]"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ),
                                )}
                                <button
                                    onClick={() =>
                                        setCurrentPage(Math.min(
                                            totalPages || 1,
                                            currentPage + 1,
                                        ),
                                        )
                                    }
                                    disabled={
                                        currentPage === totalPages ||
                                        filteredPosts.length === 0
                                    }
                                    className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                                >
                                    ▶
                                </button>
                                <span className="mx-1">│</span>
                                <Select
                                    value={postsPerPage.toString()}
                                    onValueChange={(val) => {
                                        setPostsPerPage(Number.parseInt(val));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[60px] h-7 text-xs">
                                        <SelectValue>{postsPerPage}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* Right Panel - Post Detail */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {posts.length > 0 &&
                            selectedPostIndex >= 0 &&
                            selectedPostIndex < posts.length ? (
                            (() => {
                                const post = posts[selectedPostIndex]
                                const isPostEditable = (status) => {
                                    const s = status?.toLowerCase()
                                    return s === "draft" || s === "posting error"
                                }
                                const statusInfo = getStatusInfo(post.status)

                                return (
                                    <div>
                                        {/* User Guide - Collapsible */}
                                        <div className="px-6 pt-4">
                                            <button
                                                onClick={() => setViewGuideVisible(!viewGuideVisible)}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-medium transition-all border border-blue-200 w-full justify-center shadow-sm"
                                            >
                                                {viewGuideVisible ? (
                                                    <>
                                                        <ChevronDown className="h-4 w-4" />
                                                        <span className="text-sm">Ẩn hướng dẫn sử dụng</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronRight className="h-4 w-4" />
                                                        <span className="text-sm">Hiển thị hướng dẫn sử dụng</span>
                                                    </>
                                                )}
                                            </button>

                                            {viewGuideVisible && (
                                                <div className="mt-3 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 rounded-lg border border-blue-200 shadow-sm">
                                                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                                        <Info className="h-5 w-5" />
                                                        Hướng dẫn sử dụng Popup "View"
                                                    </h4>

                                                    <div className="space-y-3 text-sm text-gray-700">
                                                        {/* Posts Library */}
                                                        <div className="bg-white/70 p-3 rounded-lg">
                                                            <p className="font-semibold text-slate-800 mb-1">📚 Posts Library:</p>
                                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                                <li><strong>Click vào card:</strong> Xem chi tiết và edit nội dung Post đó</li>
                                                                <li><strong>Checkbox:</strong> Chọn nhiều Posts cùng lúc để thao tác hàng loạt</li>
                                                                <li><strong>Edit Status:</strong> Chọn Posts → Click dropdown "Status Edit" → Chọn trạng thái mới → Xác nhận popup</li>
                                                                <li><strong>Nút Update:</strong> Khi edit Caption hoặc Media, nút sẽ chuyển màu xanh lá nhấp nháy. BẮT BUỘC click "Update" để lưu thay đổi</li>
                                                                <li><strong>Create Date:</strong> Thời gian tạo Post (cố định, không thay đổi)</li>
                                                                <li><strong>Updated Date:</strong> Hiển thị "DD/MM/YYYY HH:MM" khi chưa có thay đổi status. Sẽ cập nhật real-time khi status thay đổi</li>
                                                            </ul>
                                                        </div>

                                                        {/* Caption */}
                                                        <div className="bg-white/70 p-3 rounded-lg">
                                                            <p className="font-semibold text-blue-800 mb-1">✏️ Caption:</p>
                                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                                <li><strong>Draft/Posting Error:</strong> Có thể edit caption trực tiếp. Nhớ click "Update" để lưu!</li>
                                                                <li><strong>Use/Posted:</strong> Read Only, không edit được (hiển thị nhãn "Read Only")</li>
                                                                <li><strong>Chars:</strong> Tổng số ký tự trong caption (bao gồm cả khoảng trắng và emoji)</li>
                                                                <li><strong>Hashtag:</strong> Đếm số lượng hashtag (#) trong caption. Ví dụ: "#marketing #sale" = 2</li>
                                                                <li><strong>Links:</strong> Đếm số lượng URL http:// hoặc https:// trong caption</li>
                                                            </ul>
                                                        </div>

                                                        {/* Media Files */}
                                                        <div className="bg-white/70 p-3 rounded-lg">
                                                            <p className="font-semibold text-slate-800 mb-1">🖼️ Media Files:</p>
                                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                                <li><strong>Tải lên:</strong> Click "Tải thêm ảnh/video" (chỉ khi Draft/Posting Error), tối đa 10 files cùng lúc</li>
                                                                <li><strong>Định dạng hỗ trợ:</strong> Image (JPG, PNG) và Video (MP4, MOV)</li>
                                                                <li><strong>Lọc trùng:</strong> Hệ thống tự động phát hiện và bỏ qua file trùng lặp (so sánh tên + kích thước)</li>
                                                                <li><strong>Xóa media:</strong> Click nút X (góc trên phải) trên mỗi ảnh/video</li>
                                                                <li><strong>Sắp xếp vị trí:</strong> Kéo thả (drag & drop) để đổi vị trí thứ tự hiển thị</li>
                                                                <li><strong>Số thứ tự:</strong> Hiển thị 1, 2, 3... tương ứng thứ tự xuất hiện khi đăng bài</li>
                                                                <li><strong>Read Only:</strong> Use/Posted không thể thêm, xóa, hoặc sắp xếp lại media</li>
                                                            </ul>
                                                        </div>

                                                        {/* Carousel Social */}
                                                        <div className="bg-white/70 p-3 rounded-lg">
                                                            <p className="font-semibold text-indigo-800 mb-1">📱 Carousel Social (Trái → Phải):</p>
                                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                                <li><strong>Preview:</strong> Xem trước carousel đúng như sẽ hiển thị trên mạng xã hội</li>
                                                                <li><strong>Thứ tự slide:</strong> Media đầu tiên (vị trí 1) = slide đầu tiên user thấy khi xem bài</li>
                                                                <li><strong>Vuốt Trái → Phải:</strong> User trên social sẽ vuốt theo thứ tự 1 → 2 → 3 → ...</li>
                                                                <li><strong>Kiểm tra:</strong> Đảm bảo hình ảnh/video quan trọng nhất ở vị trí 1</li>
                                                                <li><strong>Số slides:</strong> Tổng số media sẽ xuất hiện trong carousel</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Caption Section */}
                                        <div className="px-6 pt-4">
                                            <button
                                                onClick={() => setIsCaptionCollapsed(!isCaptionCollapsed)}
                                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all border border-blue-200 shadow-sm"
                                            >
                                                <span className="flex items-center gap-3 font-semibold text-blue-900">
                                                    <FileText className="h-5 w-5" />
                                                    Caption
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow-sm">
                                                        Chars: {post.caption?.length || 0}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
                                                        Hashtag: {(post.caption?.match(/#\w+/g) || []).length}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full bg-violet-500 text-white text-xs font-bold shadow-sm">
                                                        Links: {(post.caption?.match(/https?:\/\/[^\s]+/g) || []).length}
                                                    </span>
                                                    {!isPostEditable(post.status) && (
                                                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-300">
                                                            Read Only
                                                        </span>
                                                    )}
                                                </span>
                                                <ChevronDown
                                                    className={`h-5 w-5 text-blue-700 transition-transform ${isCaptionCollapsed ? "" : "rotate-180"}`}
                                                />
                                            </button>

                                            <div
                                                className="transition-all duration-300 overflow-hidden"
                                                style={{ maxHeight: isCaptionCollapsed ? "180px" : "2000px" }}
                                            >
                                                <div className="mt-3 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                                                    {post.caption && post.caption.trim() ? (
                                                        <textarea
                                                            value={pendingChanges[post.id]?.caption !== undefined ? pendingChanges[post.id].caption : post.caption}
                                                            onChange={(e) => {
                                                                if (isPostEditable(post.status)) {
                                                                    handleCaptionChange(post.id, e.target.value)
                                                                }
                                                            }}
                                                            disabled={!isPostEditable(post.status)}
                                                            className={`w-full min-h-[150px] p-4 border-2 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPostEditable(post.status)
                                                                ? "bg-white border-gray-300 hover:border-blue-400"
                                                                : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-75"
                                                                }`}
                                                            placeholder={isPostEditable(post.status) ? "Nhập caption của bạn..." : "No caption"}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center py-8 text-gray-400 italic">
                                                            <FileX className="h-8 w-8 mr-2" />
                                                            No caption added yet...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Media Files Section */}
                                        <div className="px-6 pt-4">
                                            <button
                                                onClick={() => setIsMediaCollapsed(!isMediaCollapsed)}
                                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 rounded-lg transition-all border border-slate-200 shadow-sm"
                                            >
                                                <span className="flex items-center gap-3 font-semibold text-slate-900">
                                                    <ImageIcon className="h-5 w-5" />
                                                    Media Files
                                                    <span className="px-2.5 py-1 rounded-full bg-slate-500 text-white text-xs font-bold shadow-sm">
                                                        Image: {post.mediaFiles?.filter((m) => m.type === "image").length || 0}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full bg-gray-500 text-white text-xs font-bold shadow-sm">
                                                        Video: {post.mediaFiles?.filter((m) => m.type === "video").length || 0}
                                                    </span>
                                                    {!isPostEditable(post.status) && (
                                                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-300">
                                                            Read Only
                                                        </span>
                                                    )}
                                                </span>
                                                <ChevronDown
                                                    className={`h-5 w-5 text-[#3B82F6] transition-transform ${isMediaCollapsed ? "" : "rotate-180"}`}
                                                />
                                            </button>

                                            <div
                                                className="transition-all duration-300 overflow-hidden"
                                                style={{ maxHeight: isMediaCollapsed ? "220px" : "2000px" }}
                                            >
                                                <div className="mt-3 p-5 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
                                                    {isPostEditable(post.status) && (
                                                        <div>
                                                            <label
                                                                htmlFor={`upload-media-${post.id}`}
                                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg"
                                                            >
                                                                <Upload className="h-5 w-5" />
                                                                <span className="font-bold text-base">Tải thêm ảnh/video</span>
                                                            </label>
                                                            <input
                                                                id={`upload-media-${post.id}`}
                                                                type="file"
                                                                multiple
                                                                accept=".jpg,.jpeg,.png,.mp4,.mov"
                                                                onChange={(e) => {
                                                                    const files = Array.from(e.target.files || [])
                                                                    // Max 10 files
                                                                    if (files.length > 10) {
                                                                        alert('Tối đa 10 files cùng lúc!')
                                                                        e.target.value = ''
                                                                        return
                                                                    }
                                                                    // Validate file types
                                                                    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']
                                                                    const invalidFiles = files.filter(f => !allowedTypes.includes(f.type))
                                                                    if (invalidFiles.length > 0) {
                                                                        alert('Chỉ hỗ trợ: JPG, PNG, MP4, MOV')
                                                                        e.target.value = ''
                                                                        return
                                                                    }
                                                                    // Auto-remove duplicates by filename
                                                                    const existingNames = new Set(post.mediaFiles?.map(m => m.name) || [])
                                                                    const uniqueFiles = files.filter(f => !existingNames.has(f.name))
                                                                    if (uniqueFiles.length < files.length) {
                                                                        const duplicateCount = files.length - uniqueFiles.length
                                                                        alert(`Đã bỏ qua ${duplicateCount} file trùng lặp!`)
                                                                    }
                                                                    if (uniqueFiles.length > 0) {
                                                                        // Create a synthetic event with filtered files
                                                                        const dataTransfer = new DataTransfer()
                                                                        uniqueFiles.forEach(f => dataTransfer.items.add(f))
                                                                        const newEvent = { target: { files: dataTransfer.files } }
                                                                        onUploadMedia(post.id, newEvent)
                                                                    }
                                                                    e.target.value = ''
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                                                                Tối đa upload 10 files cùng lúc. - Hỗ trợ: JPG, PNG, MP4, MOV
                                                            </p>
                                                        </div>
                                                    )}

                                                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                                                        <>
                                                            <div className="grid grid-cols-4 gap-4">
                                                                {post.mediaFiles
                                                                    .slice(0, showAllMedia[post.id] ? undefined : 4)
                                                                    .map((media, index) => (
                                                                        <div
                                                                            key={media.id}
                                                                            draggable={isPostEditable(post.status)}
                                                                            onDragStart={(e) => {
                                                                                if (isPostEditable(post.status)) {
                                                                                    e.dataTransfer.setData("dragIndex", index)
                                                                                }
                                                                            }}
                                                                            onDragOver={(e) => {
                                                                                if (isPostEditable(post.status)) {
                                                                                    e.preventDefault()
                                                                                }
                                                                            }}
                                                                            onDrop={(e) => {
                                                                                if (isPostEditable(post.status)) {
                                                                                    e.preventDefault()
                                                                                    const dragIndex = Number.parseInt(e.dataTransfer.getData("dragIndex"))
                                                                                    handleReorderMediaInView(post.id, dragIndex, index)
                                                                                }
                                                                            }}
                                                                            className={`relative group rounded-xl overflow-hidden bg-gray-100 border-2 border-[#E5E7EB] hover:border-[#CBD5E1] transition-all duration-200 ${isPostEditable(post.status) ? "cursor-move" : "cursor-default"
                                                                                }`}
                                                                        >
                                                                            <div className="absolute top-2 left-2 z-10 w-7 h-7 bg-[#3B82F6] text-white rounded-md flex items-center justify-center text-xs font-bold shadow">
                                                                                {media.order}
                                                                            </div>

                                                                            <div
                                                                                className="aspect-square cursor-pointer"
                                                                                onClick={() => {
                                                                                    if (media.type === "video") {
                                                                                        const videoEl = document.getElementById(`video-${media.id}`)
                                                                                        if (videoEl) {
                                                                                            if (videoEl.paused) videoEl.play()
                                                                                            else videoEl.pause()
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {media.type === "video" ? (
                                                                                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                                                                                        <video
                                                                                            id={`video-${media.id}`}
                                                                                            src={media.url}
                                                                                            className="max-w-full max-h-full object-contain rounded-lg"
                                                                                        />
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                                            <div className="bg-white/90 rounded-full p-2 shadow-lg">
                                                                                                <Play className="h-6 w-6 text-[#3B82F6]" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <img
                                                                                        src={media.url || "/placeholder.svg"}
                                                                                        alt=""
                                                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                                                    />
                                                                                )}
                                                                            </div>

                                                                            {isPostEditable(post.status) && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const updatedMedia = post.mediaFiles
                                                                                            .filter((m) => m.id !== media.id)
                                                                                            .map((m, idx) => ({ ...m, order: idx + 1 }))
                                                                                        onUpdatePosts(post.id, { mediaFiles: updatedMedia })
                                                                                    }}
                                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-20"
                                                                                    title="Delete media"
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                            </div>

                                                            {post.mediaFiles.length > 4 && (
                                                                <button
                                                                    onClick={() => {
                                                                        setShowAllMedia((prev) => ({
                                                                            ...prev,
                                                                            [post.id]: !prev[post.id],
                                                                        }))
                                                                    }}
                                                                    className="w-full py-2 text-sm text-[#3B82F6] hover:text-[#1D4ED8] font-semibold bg-[#DBEAFE] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                                                                >
                                                                    {showAllMedia[post.id]
                                                                        ? "Ẩn bớt"
                                                                        : `Hiển thị thêm ${post.mediaFiles.length - 4} media`}
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-center py-8 border-2 border-dashed border-[#CBD5E1] rounded-lg">
                                                            <FileImage className="h-12 w-12 mx-auto text-[#CBD5E1] mb-2" />
                                                            <p className="text-sm text-[#64748B]">No media files</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Carousel Social - Post Data */}
                                        <div className="px-6 pt-4 pb-6">
                                            <div className="mt-4 bg-gradient-to-br from-[#EFF6FF] to-[#F0F4F8] rounded-xl border-2 border-[#CBD5E1]">
                                                <div className="px-5 py-3 bg-white/80 backdrop-blur-sm border-b border-[#CBD5E1] flex items-center gap-2">
                                                    <Instagram className="h-5 w-5 text-[#3B82F6]" />
                                                    <span className="text-sm font-semibold text-[#0F172A]">
                                                        Carousel Social{" "}
                                                        <span className="text-[#64748B] font-normal">(bắt đầu chọn từ Trái → Phải)</span>
                                                    </span>
                                                    <span className="ml-auto text-xs text-[#3B82F6] font-medium">
                                                        {post.mediaFiles?.length || 0} slides
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                                                        <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F0F4F8' }}>
                                                            <div className="flex items-center gap-2" style={{ minWidth: 'max-content' }}>
                                                                {post.mediaFiles
                                                                    .sort((a, b) => a.order - b.order)
                                                                    .map((media, index) => (
                                                                        <React.Fragment key={media.id}>
                                                                            {/* Media Item */}
                                                                            <div
                                                                                className="relative group rounded-xl overflow-hidden bg-gray-100 border-2 border-[#CBD5E1] hover:border-[#3B82F6] transition-all duration-200 flex-shrink-0"
                                                                                style={{
                                                                                    width:
                                                                                        media.aspectRatio === "vertical"
                                                                                            ? "120px"
                                                                                            : media.aspectRatio === "horizontal"
                                                                                                ? "200px"
                                                                                                : "140px",
                                                                                }}
                                                                            >
                                                                                {/* Number Badge */}
                                                                                <div className="absolute bottom-2 right-2 z-10 w-7 h-7 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                                                                    {index + 1}
                                                                                </div>
                                                                                {/* Media Display */}
                                                                                <div
                                                                                    className={
                                                                                        media.aspectRatio === "vertical"
                                                                                            ? "aspect-[9/16]"
                                                                                            : media.aspectRatio === "horizontal"
                                                                                                ? "aspect-[16/9]"
                                                                                                : "aspect-square"
                                                                                    }
                                                                                >
                                                                                    {media.type === "video" ? (
                                                                                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                                                                                            <video src={media.url} className="w-full h-full object-cover" />
                                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                                                <div className="bg-white/90 rounded-full p-2 shadow-lg">
                                                                                                    <Play className="h-5 w-5 text-[#3B82F6]" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <img
                                                                                            src={media.url || "/placeholder.svg"}
                                                                                            alt={`Slide ${index + 1}`}
                                                                                            className="w-full h-full object-cover"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {/* Arrow between items */}
                                                                            {index < post.mediaFiles.length - 1 && (
                                                                                <div className="flex-shrink-0 text-[#3B82F6] font-bold text-lg">
                                                                                    {">"}
                                                                                </div>
                                                                            )}
                                                                        </React.Fragment>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <FileImage className="h-12 w-12 mx-auto text-[#CBD5E1] mb-2" />
                                                            <p className="text-sm text-[#64748B]">No media to preview</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()
                        ) : (
                            // Empty State
                            <div className="flex-1 overflow-y-auto">
                                {/* User Guide */}
                                <div className="px-6 pt-4">
                                    <button
                                        onClick={() => setViewGuideVisible(!viewGuideVisible)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-medium transition-all border border-blue-200 w-full justify-center shadow-sm"
                                    >
                                        {viewGuideVisible ? (
                                            <>
                                                <ChevronDown className="h-4 w-4" />
                                                <span className="text-sm">Ẩn hướng dẫn sử dụng</span>
                                            </>
                                        ) : (
                                            <>
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="text-sm">Hiển thị hướng dẫn sử dụng</span>
                                            </>
                                        )}
                                    </button>

                                    {viewGuideVisible && (
                                        <div className="mt-3 bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                                            <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex items-center gap-2">
                                                <Info className="h-5 w-5 text-blue-600" />
                                                <h4 className="font-bold text-blue-900">
                                                    Hướng dẫn sử dụng Popup "View"
                                                </h4>
                                            </div>
                                            <div className="p-5">

                                                <div className="space-y-3 text-sm text-gray-700">
                                                    {/* Posts Library */}
                                                    <div className="bg-white/70 p-3 rounded-lg">
                                                        <p className="font-semibold text-slate-800 mb-1">📚 Posts Library:</p>
                                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                                            <li>Click vào từng card để xem chi tiết Post</li>
                                                            <li>Checkbox để chọn nhiều Posts cùng lúc</li>
                                                            <li>Nút "Status Edit" để thay đổi Status hàng loạt</li>
                                                        </ul>
                                                    </div>

                                                    {/* Caption */}
                                                    <div className="bg-white/70 p-3 rounded-lg">
                                                        <p className="font-semibold text-blue-800 mb-1">✏️ Caption:</p>
                                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                                            <li>
                                                                <strong>Draft/Posting Error:</strong> Có thể edit caption trực tiếp
                                                            </li>
                                                            <li>
                                                                <strong>Use/Posted:</strong> Read Only, không edit được
                                                            </li>
                                                            <li>Hiển thị: Chars (số ký tự) và Hashtag (số lượng #)</li>
                                                        </ul>
                                                    </div>

                                                    {/* Media Files */}
                                                    <div className="bg-white/70 p-3 rounded-lg">
                                                        <p className="font-semibold text-slate-800 mb-1">🖼️ Media Files:</p>
                                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                                            <li>
                                                                <strong>Tải thêm:</strong> Chỉ khi Draft/Posting Error (tối đa 10 files cùng lúc)
                                                            </li>
                                                            <li>
                                                                <strong>Xóa media:</strong> Click nút X trên mỗi ảnh/video
                                                            </li>
                                                            <li>
                                                                <strong>Sắp xếp:</strong> Kéo thả (drag & drop) để đổi vị trí
                                                            </li>
                                                            <li>
                                                                <strong>Read Only:</strong> Use/Posted không chỉnh sửa được
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Carousel Social */}
                                                    <div className="bg-white/70 p-3 rounded-lg">
                                                        <p className="font-semibold text-indigo-800 mb-1">📱 Carousel Social:</p>
                                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                                            <li>Xem preview các media theo thứ tự từ Trái → Phải</li>
                                                            <li>Số thứ tự hiển thị: 1 → 2 → 3 → ...</li>
                                                            <li>Giúp kiểm tra thứ tự hiển thị trước khi đăng</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Caption - Empty State */}
                                <div className="px-6 pt-4">
                                    <div className="rounded-xl border-2 border-[#E5E7EB] overflow-hidden">
                                        <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all border-b border-blue-200 shadow-sm flex items-center justify-between">
                                            <span className="flex items-center gap-3 font-semibold text-blue-900">
                                                <FileText className="h-5 w-5" />
                                                Caption
                                                <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow-sm">
                                                    Chars: 0
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
                                                    Hashtag: 0
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-violet-500 text-white text-xs font-bold shadow-sm">
                                                    Links: 0
                                                </span>
                                            </span>
                                            <ChevronDown className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-center py-8 text-gray-400 italic">
                                                <FileX className="h-8 w-8 mr-2" />
                                                No caption added yet...
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Media Files - Empty State */}
                                <div className="px-6 pt-4">
                                    <div className="rounded-xl border-2 border-[#E5E7EB] overflow-hidden">
                                        <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all border-b border-slate-200 shadow-sm flex items-center justify-between">
                                            <span className="flex items-center gap-3 font-semibold text-slate-900">
                                                <ImageIcon className="h-5 w-5" />
                                                Media Files
                                                <span className="px-2.5 py-1 rounded-full bg-slate-500 text-white text-xs font-bold shadow-sm">
                                                    Image: 0
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full bg-gray-500 text-white text-xs font-bold shadow-sm">
                                                    Video: 0
                                                </span>
                                            </span>
                                            <ChevronDown className="h-5 w-5 text-[#3B82F6]" />
                                        </div>
                                        <div className="p-6" style={{ minHeight: "220px" }}>
                                            <div>
                                                <label
                                                    htmlFor="upload-media-empty"
                                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Upload className="h-5 w-5" />
                                                    <span className="font-bold text-base">Tải thêm ảnh/video</span>
                                                    <input
                                                        id="upload-media-empty"
                                                        type="file"
                                                        multiple
                                                        accept="image/*,video/*"
                                                        onChange={() => {
                                                            console.log("[v0] Upload in empty state")
                                                        }}
                                                        className="hidden"
                                                        disabled
                                                    />
                                                </label>
                                                <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                                                    Tối đa upload 10 files cùng lúc. - Hỗ trợ: JPG, PNG, MP4, MOV
                                                </p>
                                            </div>

                                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                <FileImage className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                <p className="text-sm text-gray-400">No media files</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Carousel Social - Empty State */}
                                <div className="px-6 pt-4">
                                    <div className="mt-4 bg-gradient-to-br from-[#EFF6FF] to-[#F0F4F8] rounded-xl border-2 border-[#CBD5E1]">
                                        <div className="px-5 py-3 bg-white/80 backdrop-blur-sm border-b border-[#CBD5E1] flex items-center gap-2">
                                            <Instagram className="h-5 w-5 text-[#3B82F6]" />
                                            <span className="text-sm font-semibold text-[#0F172A]">
                                                Carousel Social{" "}
                                                <span className="text-[#64748B] font-normal">(bắt đầu chọn từ Trái → Phải)</span>
                                            </span>
                                            <span className="ml-auto text-xs text-[#3B82F6] font-medium">0 slides</span>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-center py-8">
                                                <FileImage className="h-12 w-12 mx-auto text-blue-300 mb-2" />
                                                <p className="text-sm text-purple-600">No media to preview</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    )
}
