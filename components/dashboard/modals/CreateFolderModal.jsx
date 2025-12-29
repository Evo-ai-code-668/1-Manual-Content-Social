
import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Lock, X, Check, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    socialPlatforms,
    platformConfig,
    autoSyncData,
    groupMockData,
    usernamesByGroup
} from "@/lib/constants"

export default function CreateFolderModal({
    isOpen,
    onOpenChange,
    onSave,
    activeTab,
    ideaNiches = []
}) {
    const { toast } = useToast()
    const [selectedUsernameSocial, setSelectedUsernameSocial] = useState("")
    const [selectedGroupAccountSocial, setSelectedGroupAccountSocial] = useState("")
    const [usernameSearch, setUsernameSearch] = useState("")
    const [selectedIdea, setSelectedIdea] = useState("")
    const [selectedNiche, setSelectedNiche] = useState([])
    const [autoSyncInfo, setAutoSyncInfo] = useState({ type: "", department: "", team: "", leader: "" })
    const [selectedAccountSocial, setSelectedAccountSocial] = useState("")
    const [selectedFolderName, setSelectedFolderName] = useState("")
    const [selectedStatusContent, setSelectedStatusContent] = useState("Start")
    const [validationErrors, setValidationErrors] = useState([])

    const [contentTypeConfigs, setContentTypeConfigs] = useState({
        new: {
            dayOfWeeks: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            timeRanges: [
                { from: "09:00", to: "11:00" },
                { from: "19:00", to: "21:00" },
            ],
        },
        reel: {
            dayOfWeeks: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            timeRanges: [
                { from: "12:00", to: "14:00" },
                { from: "21:30", to: "23:30" },
            ],
        },
        squareProduct: {
            dayOfWeeks: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            timeRanges: [
                { from: "06:00", to: "08:00" },
                { from: "15:00", to: "17:00" },
            ],
        },
    })

    // Auto-sync when idea and niche are selected for create modal
    useEffect(() => {
        if (selectedIdea && selectedNiche.length > 0) {
            const syncData = autoSyncData[selectedIdea]?.[selectedNiche[0]]
            if (syncData) {
                setAutoSyncInfo(syncData)
            }
        } else {
            setAutoSyncInfo({ type: "", department: "", team: "", leader: "" })
        }
    }, [selectedIdea, selectedNiche])

    // Reset username when social platform changes in create modal
    useEffect(() => {
        if (selectedAccountSocial) {
            setSelectedUsernameSocial("")
            setUsernameSearch("")
        }
    }, [selectedAccountSocial])

    // Reset states when modal is closed/opened (optional, or rely on parent unmounting? No, modal stays)
    useEffect(() => {
        if (isOpen) {
            // Initialize or reset if needed?
            // For now, keep state persistence or reset on successful save.
        }
    }, [isOpen])

    const getFilteredUsernames = () => {
        if (!selectedGroupAccountSocial) return []
        const baseList = usernamesByGroup[selectedGroupAccountSocial] || []
        return baseList.filter((u) => u.toLowerCase().includes(usernameSearch.toLowerCase()))
    }

    const isUsernameTaken = (username) => {
        return ideaNiches.some((item) => item.usernameSocial === username && item.accountSocial === activeTab)
    }

    const toggleDayOfWeek = (type, day) => {
        setContentTypeConfigs((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                dayOfWeeks: prev[type].dayOfWeeks.includes(day)
                    ? prev[type].dayOfWeeks.filter((d) => d !== day)
                    : [...prev[type].dayOfWeeks, day],
            },
        }))
    }

    const addTimeRange = (type) => {
        setContentTypeConfigs((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                timeRanges: [...prev[type].timeRanges, { from: "09:00", to: "12:00" }],
            },
        }))
    }

    const removeTimeRange = (type, index) => {
        setContentTypeConfigs((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                timeRanges: prev[type].timeRanges.filter((_, i) => i !== index),
            },
        }))
    }

    const updateTimeRange = (type, index, field, value) => {
        setContentTypeConfigs((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                timeRanges: prev[type].timeRanges.map((range, i) => (i === index ? { ...range, [field]: value } : range)),
            },
        }))
    }

    const handleCreateNew = () => {
        // Validation with specific field warnings
        const missingFields = []
        if (!selectedGroupAccountSocial) missingFields.push("Group Account Social")
        if (!selectedUsernameSocial) missingFields.push("Username Social")
        if (!selectedIdea) missingFields.push("Idea")
        if (selectedNiche.length === 0) missingFields.push("Niche")
        if (!selectedFolderName) missingFields.push("Folder Name")

        if (missingFields.length > 0) {
            setValidationErrors(missingFields)
            return
        }

        if (activeTab && selectedUsernameSocial && selectedIdea && selectedNiche.length > 0 && selectedFolderName) {
            const isTaken = isUsernameTaken(selectedUsernameSocial)

            if (isTaken) {
                setValidationErrors([`Username "${selectedUsernameSocial}" already exists for ${activeTab}. Please choose another username.`])
                return
            }

            // Clear validation errors on success
            setValidationErrors([])

            const newFolder = {
                id: String(ideaNiches.length + 1).padStart(3, "0"),
                folderName: selectedFolderName,
                accountSocial: selectedAccountSocial || activeTab,
                groupAccountSocial: selectedGroupAccountSocial,
                usernameSocial: selectedUsernameSocial,
                statusAccountSocial: "Available New",
                loginAppClone: "Active",
                statusContentFolder: selectedStatusContent, // Use state
                statusNewSquare: "Start",
                statusReelVertical: "Start",
                statusSquareProduct: "Start",
                idea: selectedIdea,
                niche: selectedNiche,
                type: autoSyncInfo.type,
                departmentWorks: autoSyncInfo.department,
                groupWork: autoSyncInfo.team,
                userWorks: autoSyncInfo.leader,
                status: "Pending",
                createdBy: "Current User",
                updatedBy: "Current User",
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
                images: {
                    new: [],
                    reel: [],
                    squareProduct: [],
                },
                contentTypeConfigs: { ...contentTypeConfigs },
            }

            onSave(newFolder)

            // Success toast
            toast({
                title: "✅ Folder Created Successfully",
                description: `Folder "${selectedFolderName}" has been created.`,
            })

            // Reset State
            setSelectedAccountSocial("")
            setSelectedUsernameSocial("")
            setSelectedGroupAccountSocial("")
            setSelectedIdea("")
            setSelectedNiche([])
            setUsernameSearch("")
            setAutoSyncInfo({ type: "", department: "", team: "", leader: "" })
            setSelectedFolderName("")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden flex flex-col z-50">
                <DialogHeader className="p-6 border-b shrink-0 sticky top-0 bg-white z-20">
                    <DialogTitle className="text-xl">Create Folder Content Manual</DialogTitle>

                    {/* Inline Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="mt-3 p-3 bg-[#cb5150]/10 border border-[#cb5150] rounded-lg">
                            <div className="flex items-center gap-2 text-[#cb5150] font-semibold text-sm mb-1">
                                <AlertCircle className="h-4 w-4" />
                                Required Fields Missing:
                            </div>
                            <ul className="text-[#cb5150] text-sm list-disc list-inside">
                                {validationErrors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Step 1: Social Platform Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                1
                            </Badge>
                            Select Social Platform
                        </h3>

                        <div className="flex gap-4">
                            <div className="space-y-2 w-[25%] min-w-0">
                                <Label htmlFor="social-platform" className="text-sm">
                                    Social Platform
                                </Label>
                                <div className="relative">
                                    <Select value={activeTab} disabled>
                                        <SelectTrigger id="social-platform" className="w-full bg-gray-50 cursor-not-allowed">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(socialPlatforms).map((platform) => (
                                                <SelectItem key={platform} value={platform} className="capitalize">
                                                    {platform}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Lock className="absolute right-8 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2 w-[25%] min-w-0">
                                <Label htmlFor="status-content" className="text-sm">
                                    Status Content
                                </Label>
                                <Select value={selectedStatusContent} onValueChange={setSelectedStatusContent}>
                                    <SelectTrigger id="status-content">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Start">
                                            <span className="text-green-600 font-medium">Start</span>
                                        </SelectItem>
                                        <SelectItem value="Stop">
                                            <span className="text-red-600 font-medium">Stop</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 w-[50%] min-w-0">
                                <Label htmlFor="group-account" className="text-sm truncate block">
                                    Group Account Social
                                </Label>
                                <Select onValueChange={setSelectedGroupAccountSocial} value={selectedGroupAccountSocial}>
                                    <SelectTrigger id="group-account" className="w-full">
                                        <SelectValue placeholder="Select Group To Show Username List" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(groupMockData[activeTab] || []).map((group) => (
                                            <SelectItem key={group} value={group}>
                                                {group}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username-social">
                                Username Social*{" "}
                                <span className="text-gray-600 font-normal">
                                    (Chọn 1 Account Social Duy Nhất - Tự Động Loại Bỏ Trùng Lặp)
                                </span>
                            </Label>

                            {selectedGroupAccountSocial ? (
                                <div className="border rounded-lg overflow-hidden flex flex-col max-h-[300px]">
                                    <div className="p-2 bg-gray-50 border-b flex items-center gap-2 shrink-0">
                                        <Search className="h-4 w-4 text-gray-400" />
                                        <input
                                            className="bg-transparent text-sm outline-none flex-1"
                                            placeholder="Search username..."
                                            value={usernameSearch}
                                            onChange={(e) => setUsernameSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="text-left p-2 font-medium text-gray-700 w-10 text-center">Select</th>
                                                    <th className="text-left p-2 font-medium text-gray-700">Username</th>
                                                    <th className="text-left p-2 font-medium text-gray-700">In Use & Not Use</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {getFilteredUsernames().map((username) => {
                                                    const taken = isUsernameTaken(username)
                                                    return (
                                                        <tr
                                                            key={username}
                                                            className={`hover:bg-gray-50 cursor-pointer ${taken ? "opacity-50 cursor-not-allowed bg-gray-50" : selectedUsernameSocial === username ? "bg-blue-50" : ""}`}
                                                            onClick={() => {
                                                                if (!taken) {
                                                                    setSelectedUsernameSocial(username)
                                                                    setSelectedFolderName(username)
                                                                }
                                                            }}
                                                        >
                                                            <td className="p-2 flex justify-center">
                                                                <div
                                                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedUsernameSocial === username ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                                                                >
                                                                    {selectedUsernameSocial === username && (
                                                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-2 font-medium">{username}</td>
                                                            <td className="p-2 text-xs">
                                                                {taken ? (
                                                                    <span className="text-red-600 font-semibold">Đã tồn tại</span>
                                                                ) : (
                                                                    <span className="text-green-600">Sẵn sàng</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-400 bg-gray-50">
                                    (Chọn Group Để Hiển Thị Danh Sách Username)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Select Content */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                2
                            </Badge>
                            Select Content
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="folder-name">Folder Image Name*</Label>
                                <Input
                                    id="folder-name"
                                    value={selectedUsernameSocial}
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    placeholder="Auto-filled from Username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idea">Select Idea *</Label>
                                <Select
                                    onValueChange={(val) => {
                                        setSelectedIdea(val)
                                        setSelectedNiche([])
                                    }}
                                    value={selectedIdea}
                                >
                                    <SelectTrigger id="idea">
                                        <SelectValue placeholder="Select Idea" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(autoSyncData).map((idea) => (
                                            <SelectItem key={idea} value={idea}>
                                                {idea}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="niche">Select Niche * (Can select multiple)</Label>
                                <Select
                                    onValueChange={(val) => {
                                        if (selectedNiche.includes(val)) {
                                            setSelectedNiche(selectedNiche.filter((n) => n !== val))
                                        } else {
                                            setSelectedNiche([...selectedNiche, val])
                                        }
                                    }}
                                    disabled={!selectedIdea}
                                >
                                    <SelectTrigger id="niche" className={!selectedIdea ? "opacity-50" : ""}>
                                        <SelectValue
                                            placeholder={selectedNiche.length > 0 ? `${selectedNiche.length} selected` : "Select Niche"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedIdea &&
                                            Object.keys(autoSyncData[selectedIdea]).map((niche) => (
                                                <SelectItem
                                                    key={niche}
                                                    value={niche}
                                                    className={selectedNiche.includes(niche) ? "bg-[#509485]/20 text-[#509485] font-medium" : ""}
                                                >
                                                    {niche}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {selectedNiche.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {selectedNiche.map((n) => (
                                            <Badge key={n} variant="secondary" className="text-xs py-1 px-2 bg-[#509485]/20 text-[#509485]">
                                                {n}
                                                <X
                                                    className="ml-1.5 h-3 w-3 cursor-pointer hover:text-purple-900"
                                                    onClick={() => setSelectedNiche(selectedNiche.filter((i) => i !== n))}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <div
                            className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${selectedUsernameSocial ? "bg-green-50 border-green-200 text-green-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
                        >
                            1 New (Square)
                        </div>
                        <div
                            className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${selectedUsernameSocial ? "bg-blue-50 border-blue-200 text-blue-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
                        >
                            2 Reel (Vertical)
                        </div>
                        <div
                            className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${selectedUsernameSocial ? "bg-orange-50 border-orange-200 text-orange-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
                        >
                            3 Square Product
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                        {/* New (Square) Config */}
                        <div className="border-2 border-green-200 rounded-xl p-4 space-y-4 bg-green-50/50">
                            <div className="flex items-center justify-between border-b border-green-200 pb-2">
                                <span className="text-sm font-bold text-green-700">Type Post: New</span>
                                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                    🕐 US Timezone
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-gray-700">Day Of Weeks:</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <label
                                            key={day}
                                            className="flex items-center gap-1.5 cursor-pointer bg-white rounded-md px-2 py-1.5 border border-green-200 hover:bg-green-100 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={contentTypeConfigs.new.dayOfWeeks.includes(day)}
                                                onChange={() => toggleDayOfWeek("new", day)}
                                                className="w-4 h-4 rounded accent-green-600"
                                            />
                                            <span className="text-xs font-medium">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700">Time Range:</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-3 bg-white border-green-300 text-green-700 hover:bg-green-100"
                                        onClick={() => addTimeRange("new")}
                                    >
                                        + Add Interval
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {contentTypeConfigs.new.timeRanges.map((range, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-white rounded-md p-2 border border-green-200"
                                        >
                                            <input
                                                type="time"
                                                value={range.from}
                                                onChange={(e) => updateTimeRange("new", idx, "from", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={range.to}
                                                onChange={(e) => updateTimeRange("new", idx, "to", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                            <X
                                                className="h-4 w-4 text-red-400 cursor-pointer hover:text-red-600 ml-auto"
                                                onClick={() => removeTimeRange("new", idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reel (Vertical) Config */}
                        <div className="border-2 border-blue-200 rounded-xl p-4 space-y-4 bg-blue-50/50">
                            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                                <span className="text-sm font-bold text-blue-700">Type Post: Reel</span>
                                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                    🕐 US Timezone
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-gray-700">Day Of Weeks:</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <label
                                            key={day}
                                            className="flex items-center gap-1.5 cursor-pointer bg-white rounded-md px-2 py-1.5 border border-blue-200 hover:bg-blue-100 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={contentTypeConfigs.reel.dayOfWeeks.includes(day)}
                                                onChange={() => toggleDayOfWeek("reel", day)}
                                                className="w-4 h-4 rounded accent-blue-600"
                                            />
                                            <span className="text-xs font-medium">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700">Time Range:</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-3 bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                                        onClick={() => addTimeRange("reel")}
                                    >
                                        + Add Interval
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {contentTypeConfigs.reel.timeRanges.map((range, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-white rounded-md p-2 border border-blue-200"
                                        >
                                            <input
                                                type="time"
                                                value={range.from}
                                                onChange={(e) => updateTimeRange("reel", idx, "from", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={range.to}
                                                onChange={(e) => updateTimeRange("reel", idx, "to", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <X
                                                className="h-4 w-4 text-red-400 cursor-pointer hover:text-red-600 ml-auto"
                                                onClick={() => removeTimeRange("reel", idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Square Product Config */}
                        <div className="border-2 border-orange-200 rounded-xl p-4 space-y-4 bg-orange-50/50">
                            <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                                <span className="text-sm font-bold text-orange-700">Type Post: Square Product</span>
                                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                    🕐 US Timezone
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-gray-700">Day Of Weeks:</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <label
                                            key={day}
                                            className="flex items-center gap-1.5 cursor-pointer bg-white rounded-md px-2 py-1.5 border border-orange-200 hover:bg-orange-100 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={contentTypeConfigs.squareProduct.dayOfWeeks.includes(day)}
                                                onChange={() => toggleDayOfWeek("squareProduct", day)}
                                                className="w-4 h-4 rounded accent-orange-600"
                                            />
                                            <span className="text-xs font-medium">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-700">Time Range:</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-3 bg-white border-orange-300 text-orange-700 hover:bg-orange-100"
                                        onClick={() => addTimeRange("squareProduct")}
                                    >
                                        + Add Interval
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {contentTypeConfigs.squareProduct.timeRanges.map((range, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-white rounded-md p-2 border border-orange-200"
                                        >
                                            <input
                                                type="time"
                                                value={range.from}
                                                onChange={(e) => updateTimeRange("squareProduct", idx, "from", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={range.to}
                                                onChange={(e) => updateTimeRange("squareProduct", idx, "to", e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            />
                                            <X
                                                className="h-4 w-4 text-red-400 cursor-pointer hover:text-red-600 ml-auto"
                                                onClick={() => removeTimeRange("squareProduct", idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Auto-Sync Information */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                3
                            </Badge>
                            Auto-Sync Information{" "}
                            <span className="text-gray-500 font-normal text-xs">
                                (Thông Tin Sẽ Tự Động Sync Từ Username Social & Member By)
                            </span>
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="auto-type">Type</Label>
                                <Input
                                    id="auto-type"
                                    value={autoSyncInfo.type}
                                    readOnly
                                    placeholder="NTM or TM"
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auto-department">Department</Label>
                                <Input
                                    id="auto-department"
                                    value={autoSyncInfo.department}
                                    readOnly
                                    placeholder="Wildlife Department"
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auto-team">Team</Label>
                                <Input
                                    id="auto-team"
                                    value={autoSyncInfo.team}
                                    readOnly
                                    placeholder="Safari Team"
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auto-leader">Leader</Label>
                                <Input
                                    id="auto-leader"
                                    value={autoSyncInfo.leader}
                                    readOnly
                                    placeholder="Wildlife Photography"
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t shrink-0 bg-white z-20">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateNew}
                        className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Create
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
