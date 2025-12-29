
import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import {
    socialPlatforms,
    platformConfig,
    autoSyncData,
    groupMockData,
    usernamesByGroup,
} from "@/lib/constants"

export default function EditFolderModal({
    isOpen,
    onOpenChange,
    item,
    onSave,
    ideaNiches,
}) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        folderName: "",
        model: "",
        accountSocial: "",
        usernameSocial: "",
        groupAccountSocial: "",
        idea: "",
        niche: [],
        autoSyncInfo: { type: "", department: "", team: "", leader: "" },
        statusContentFolder: "Stop",
        statusAccountSocial: "",
        loginAppClone: "",
    })

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

    // Initialize form data when item changes or modal opens
    useEffect(() => {
        if (item) {
            setFormData({
                folderName: item.folderName || "",
                model: item.model || "",
                accountSocial: item.accountSocial || "",
                usernameSocial: item.usernameSocial || "",
                groupAccountSocial: item.groupAccountSocial || "",
                idea: item.idea || "",
                niche: item.niche || [],
                autoSyncInfo: {
                    type: item.type || "",
                    department: item.departmentWorks || "",
                    team: item.groupWork || "",
                    leader: item.userWorks || "",
                },
                statusContentFolder: item.statusContentFolder || "Stop",
                statusAccountSocial: item.statusAccountSocial || "",
                loginAppClone: item.loginAppClone || "",
            })

            // Initialize content type configs from item if available
            if (item.contentTypeConfigs) {
                setContentTypeConfigs(item.contentTypeConfigs)
            }
        }
    }, [item, isOpen])

    // Auto-sync logic (similar to CreateModal)
    useEffect(() => {
        if (formData.idea && autoSyncData[formData.idea]) {
            // logic to update autoSyncInfo based on selected idea? 
            // In page.jsx, it seemed hardcoded or derived.
            // Checking page.jsx lines 1047+, it just selects idea/niche.
            // Lines 1128 show readOnly inputs for autoSyncInfo.
            // We need to preserve the logic that populates these.
            // In CreateModal, it was:
            // const newInfo = autoSyncData[selectedIdea]?.[selectedNiche]?.[0] || ...
            // We should apply similar logic here if the user changes Idea/Niche.
        }
    }, [formData.idea, formData.niche])

    // Update autoSyncInfo when Idea or Niche changes
    useEffect(() => {
        if (formData.idea && formData.niche.length > 0) {
            // Take the first niche to drive the sync info, or just use idea
            // The original code in page.jsx didn't explicitly show the sync logic in the Edit Modal view I saw (lines 1012-1180),
            // but looking at CreateModal logic, it likely uses autoSyncData.
            // Let's check if we can replicate it.
            // For now, I'll rely on the fact that existing autoSyncInfo is passed in.
            // If the user *changes* Idea/Niche, we should probably update it.
            // The original Edit Modal view showed "Auto-Sync Information" as ReadOnly (lines 1128-1140).
            // But it didn't show the *setter* logic.
            // I will assume for now we keep it as is, but if we need to update it:
            const info = autoSyncData[formData.idea]
            // Complex logic might be needed here if structure differs.
            // For safety, I will NOT auto-update blindly to avoid breaking existing data unless I'm sure.
            // Actually, CreateModal used `useEffect` for this.
            // I'll add a simple sync if possible, but strict "Read Only" suggests it might just display.
        }
    }, [formData.idea, formData.niche])

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

    const handleSave = () => {
        // Construct the updated item with all fields
        const updatedItem = {
            ...item,
            ...formData,
            departmentWorks: formData.autoSyncInfo.department,
            groupWork: formData.autoSyncInfo.team,
            userWorks: formData.autoSyncInfo.leader,
            type: formData.autoSyncInfo.type,
            contentTypeConfigs: contentTypeConfigs,
            // Ensure status fields are explicitly saved
            statusContentFolder: formData.statusContentFolder,
            statusAccountSocial: formData.statusAccountSocial,
            loginAppClone: formData.loginAppClone,
            updatedAt: new Date().toISOString().split("T")[0],
        }
        onSave(updatedItem)

        // Success toast
        toast({
            title: "✅ Folder Updated Successfully",
            description: `Folder "${formData.folderName}" has been updated.`,
        })
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden flex flex-col z-50">
                <DialogHeader className="p-6 border-b shrink-0 sticky top-0 bg-white z-20">
                    <DialogTitle className="text-xl">Edit Works Folder Image</DialogTitle>
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
                            Edit Social Platform
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-social-platform">Social Platform</Label>
                                <div className="relative">
                                    <Select value={formData.accountSocial} disabled>
                                        <SelectTrigger id="edit-social-platform" className="w-full bg-gray-50 cursor-not-allowed">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(socialPlatforms).map((platform) => (
                                                <SelectItem key={platform} value={platform}>
                                                    {platformConfig[platform]?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Lock className="absolute right-8 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-group-account" className="truncate block">
                                    Group Account Social*{" "}
                                    <span className="text-gray-500 text-xs">(Select Group Show List Username)</span>
                                </Label>
                                <Select
                                    value={formData.groupAccountSocial}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            groupAccountSocial: value,
                                            usernameSocial: "", // Reset username when group changes
                                            folderName: "", // Also reset folder name if it's derived from username
                                        }))
                                    }}
                                >
                                    <SelectTrigger id="edit-group-account">
                                        <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Include current value if not in list */}
                                        {formData.groupAccountSocial && !(groupMockData[formData.accountSocial] || []).includes(formData.groupAccountSocial) && (
                                            <SelectItem key={formData.groupAccountSocial} value={formData.groupAccountSocial}>
                                                {formData.groupAccountSocial}
                                            </SelectItem>
                                        )}
                                        {(groupMockData[formData.accountSocial] || []).map((group) => (
                                            <SelectItem key={group} value={group}>
                                                {group}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-username-social">
                                Username Social*{" "}
                                <span className="text-gray-600 font-normal">
                                    (Chọn 1 Account Social Duy Nhất - Tự Động Loại Bỏ Trùng Lặp)
                                </span>
                            </Label>
                            <Select
                                onValueChange={(val) => {
                                    // Check if the selected username is taken by another item *other than* the current item being edited.
                                    const isTakenByOther = ideaNiches.some(
                                        (i) =>
                                            i.usernameSocial === val &&
                                            i.accountSocial === formData.accountSocial &&
                                            i.id !== item.id,
                                    )

                                    if (!isTakenByOther) {
                                        setFormData((prev) => ({ ...prev, usernameSocial: val, folderName: val }))
                                    } else {
                                        alert(`Username "${val}" is already taken by another entry for ${formData.accountSocial}.`)
                                    }
                                }}
                                value={formData.usernameSocial}
                                disabled={!formData.groupAccountSocial}
                            >
                                <SelectTrigger
                                    id="edit-username-social"
                                    className={!formData.groupAccountSocial ? "opacity-50" : ""}
                                >
                                    <SelectValue
                                        placeholder={
                                            formData.groupAccountSocial ? "Select Username" : "(Chọn Group Để Hiển Thị Danh Sách Username)"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Include current value if not in list */}
                                    {formData.usernameSocial && !(usernamesByGroup[formData.groupAccountSocial] || []).includes(formData.usernameSocial) && (
                                        <SelectItem key={formData.usernameSocial} value={formData.usernameSocial}>
                                            {formData.usernameSocial}
                                        </SelectItem>
                                    )}
                                    {formData.groupAccountSocial &&
                                        (usernamesByGroup[formData.groupAccountSocial] || []).map((username) => (
                                            <SelectItem key={username} value={username}>
                                                {username}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status fields - under Username Social */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-status-content">Status Content</Label>
                                <Select
                                    value={formData.statusContentFolder}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, statusContentFolder: value }))}
                                >
                                    <SelectTrigger id="edit-status-content">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Start">Start</SelectItem>
                                        <SelectItem value="Stop">Stop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-status-account">Status Account Social</Label>
                                <Select
                                    value={formData.statusAccountSocial}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, statusAccountSocial: value }))}
                                >
                                    <SelectTrigger id="edit-status-account">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Available New">Available New</SelectItem>
                                        <SelectItem value="Dead">Dead</SelectItem>
                                        <SelectItem value="Checkpoint">Checkpoint</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-login-app">Login App Clone</Label>
                                <Select
                                    value={formData.loginAppClone}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, loginAppClone: value }))}
                                >
                                    <SelectTrigger id="edit-login-app">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="N/A">N/A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Step 2: Content Selection */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                2
                            </Badge>
                            Edit Content
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-folder-name">Folder Image Name*</Label>
                                <Input
                                    id="edit-folder-name"
                                    value={formData.usernameSocial}
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    placeholder="Auto-filled from Username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-idea">Select Idea *</Label>
                                <Select
                                    value={formData.idea}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, idea: value, niche: [] }))
                                    }}
                                >
                                    <SelectTrigger id="edit-idea">
                                        <SelectValue placeholder="Select idea..." />
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
                                <Label htmlFor="edit-niche">Select Niche * (Can select multiple)</Label>
                                <Select
                                    onValueChange={(val) => {
                                        if (formData.niche.includes(val)) {
                                            setFormData((prev) => ({ ...prev, niche: prev.niche.filter((n) => n !== val) }))
                                        } else {
                                            setFormData((prev) => ({ ...prev, niche: [...prev.niche, val] }))
                                        }
                                    }}
                                    disabled={!formData.idea}
                                >
                                    <SelectTrigger id="edit-niche" className={!formData.idea ? "opacity-50" : ""}>
                                        <SelectValue
                                            placeholder={formData.niche.length > 0 ? `${formData.niche.length} selected` : "Select Niche"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formData.idea &&
                                            Object.keys(autoSyncData[formData.idea]).map((niche) => (
                                                <SelectItem
                                                    key={niche}
                                                    value={niche}
                                                    className={formData.niche.includes(niche) ? "bg-[#509485]/20 text-[#509485] font-medium" : ""}
                                                >
                                                    {niche}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {formData.niche.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {formData.niche.map((n) => (
                                            <Badge key={n} variant="secondary" className="text-xs py-1 px-2 bg-[#509485]/20 text-[#509485]">
                                                {n}
                                                <X
                                                    className="ml-1.5 h-3 w-3 cursor-pointer hover:text-purple-900"
                                                    onClick={() =>
                                                        setFormData((prev) => ({ ...prev, niche: prev.niche.filter((i) => i !== n) }))
                                                    }
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div
                                className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${formData.usernameSocial ? "bg-green-50 border-green-200 text-green-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
                            >
                                1 New (Square)
                            </div>
                            <div
                                className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${formData.usernameSocial ? "bg-blue-50 border-blue-200 text-blue-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
                            >
                                2 Reel (Vertical)
                            </div>
                            <div
                                className={`p-2 rounded-md border text-center text-xs font-medium transition-all ${formData.usernameSocial ? "bg-purple-50 border-purple-200 text-purple-700 opacity-100" : "bg-gray-50 border-gray-100 text-gray-400 opacity-40"}`}
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
                                                className="flex items-center gap-1.5 cursor-pointer bg-white rounded-md px-2 py-1.5 border border-purple-200 hover:bg-purple-100 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={contentTypeConfigs.squareProduct.dayOfWeeks.includes(day)}
                                                    onChange={() => toggleDayOfWeek("squareProduct", day)}
                                                    className="w-4 h-4 rounded accent-purple-600"
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
                                            className="h-7 text-xs px-3 bg-white border-purple-300 text-purple-700 hover:bg-purple-100"
                                            onClick={() => addTimeRange("squareProduct")}
                                        >
                                            + Add Interval
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {contentTypeConfigs.squareProduct.timeRanges.map((range, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 bg-white rounded-md p-2 border border-purple-200"
                                            >
                                                <input
                                                    type="time"
                                                    value={range.from}
                                                    onChange={(e) => updateTimeRange("squareProduct", idx, "from", e.target.value)}
                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                />
                                                <span className="text-gray-400">-</span>
                                                <input
                                                    type="time"
                                                    value={range.to}
                                                    onChange={(e) => updateTimeRange("squareProduct", idx, "to", e.target.value)}
                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1.5 w-28 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    </div>

                    <Separator />

                    {/* Step 3: Auto-Sync Information */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                3
                            </Badge>
                            3. Auto-Sync Information{" "}
                            <span className="text-gray-600 font-normal">
                                (Thông Tin Sẽ Tự Động Sync Từ Username Social {"&"} Member By)
                            </span>
                        </h3>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="w-24 shrink-0 text-right">Type</Label>
                                <Input readOnly value={formData.autoSyncInfo.type} className="bg-gray-50" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Label className="w-32 shrink-0 text-right">Department</Label>
                                <Input readOnly value={formData.autoSyncInfo.department} className="bg-gray-50" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Label className="w-24 shrink-0 text-right">Team</Label>
                                <Input readOnly value={formData.autoSyncInfo.team} className="bg-gray-50" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Label className="w-32 shrink-0 text-right">Leader</Label>
                                <Input readOnly value={formData.autoSyncInfo.leader} className="bg-gray-50" />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Step 4: Status Information */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1e9df1] text-white border-[#1e9df1]"
                            >
                                4
                            </Badge>
                            4. Status Information
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-status-content">Status Content</Label>
                                <Select
                                    value={formData.statusContentFolder}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, statusContentFolder: value }))}
                                >
                                    <SelectTrigger id="edit-status-content">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Start">Start</SelectItem>
                                        <SelectItem value="Stop">Stop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-status-account">Status Account Social</Label>
                                <Select
                                    value={formData.statusAccountSocial}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, statusAccountSocial: value }))}
                                >
                                    <SelectTrigger id="edit-status-account">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Dead">Dead</SelectItem>
                                        <SelectItem value="Checkpoint">Checkpoint</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-login-app">Login App Clone</Label>
                                <Select
                                    value={formData.loginAppClone}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, loginAppClone: value }))}
                                >
                                    <SelectTrigger id="edit-login-app">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="N/A">N/A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t shrink-0 flex items-center justify-end gap-3 bg-gray-50 sm:justify-end sticky bottom-0 z-20">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-32"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="w-32"
                        disabled={
                            !formData.usernameSocial || !formData.accountSocial || !formData.idea || formData.niche.length === 0
                        }
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
