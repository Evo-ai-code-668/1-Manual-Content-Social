
"use client"

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Save, FolderOpen, ChevronDown } from "lucide-react"

export default function FilterBar({
    isFilterOpen,
    setIsFilterOpen,
    currentFilters,
    updatePlatformFilter,
    platform,
    handleSavePreset,
    handleLoadPreset,
    filterPresets,
    filterValues,
}) {
    return (
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <div
                className="flex items-center justify-between bg-[#F0F4F8] rounded-lg border p-3 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                    <Filter className="h-5 w-5" />
                    Filter
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleSavePreset()
                        }}
                        className="h-8 bg-[#509485] hover:bg-[#3d7266] text-white border-[#509485]"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Preset
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleLoadPreset()
                        }}
                        className="h-8 bg-[#f7b928] hover:bg-[#d99e1f] text-white border-[#f7b928]"
                    >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Load Preset ({filterPresets.length})
                    </Button>
                    <ChevronDown
                        className={`h-5 w-5 text-slate-700 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            <CollapsibleContent>
                <Card className="mt-4">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Row 1 - Departments, Teams, Leader, Created By, Ideas, Niches, Type TM, Type NTM */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Departments</Label>
                                    <Select
                                        value={currentFilters.departments || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "departments", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.departments?.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Teams</Label>
                                    <Select
                                        value={currentFilters.teams || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "teams", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.teams?.map((team) => (
                                                <SelectItem key={team} value={team}>
                                                    {team}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Leader</Label>
                                    <Select
                                        value={currentFilters.leader || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "leader", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.leaders?.map((leader) => (
                                                <SelectItem key={leader} value={leader}>
                                                    {leader}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Created By</Label>
                                    <Select
                                        value={currentFilters.createdBy || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "createdBy", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.createdBy?.map((creator) => (
                                                <SelectItem key={creator} value={creator}>
                                                    {creator}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Ideas</Label>
                                    <Select
                                        value={currentFilters.ideas || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "ideas", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.ideas?.map((idea) => (
                                                <SelectItem key={idea} value={idea}>
                                                    {idea}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Niches</Label>
                                    <Select
                                        value={currentFilters.niches || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "niches", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.niches?.map((niche) => (
                                                <SelectItem key={niche} value={niche}>
                                                    {niche}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Type TM</Label>
                                    <Select
                                        value={currentFilters.typeTM || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "typeTM", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.typesTM?.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Type NTM</Label>
                                    <Select
                                        value={currentFilters.typeNTM || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "typeNTM", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.typesNTM?.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Row 2 - UserName Account, Status Account, Login App Clone, Status Content Folder, Status New, Status Reel, Status Square Product */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">UserName Account</Label>
                                    <Select
                                        value={currentFilters.usernameAccount || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "usernameAccount", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.usernameAccounts?.map((username) => (
                                                <SelectItem key={username} value={username}>
                                                    {username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status Account Social</Label>
                                    <Select
                                        value={currentFilters.statusAccount || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "statusAccount", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.statusAccounts?.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Login App Clone</Label>
                                    <Select
                                        value={currentFilters.loginAppClone || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "loginAppClone", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {filterValues.loginAppClones?.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status Content Folder</Label>
                                    <Select
                                        value={currentFilters.statusContentFolder || "all"} // Fixed typo in original code probably: was 'statusContentFolder' prop on update?
                                        onValueChange={(value) => updatePlatformFilter(platform, "statusContentFolder", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="Start">Start</SelectItem>
                                            <SelectItem value="Stop">Stop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status New (Square)</Label>
                                    <Select
                                        value={currentFilters.statusNewSquare || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "statusNewSquare", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="Start">Start</SelectItem>
                                            <SelectItem value="Stop">Stop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status Reel (Vertical)</Label>
                                    <Select
                                        value={currentFilters.statusReelVertical || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "statusReelVertical", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="Start">Start</SelectItem>
                                            <SelectItem value="Stop">Stop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Status Square Product</Label>
                                    <Select
                                        value={currentFilters.statusSquareProduct || "all"}
                                        onValueChange={(value) => updatePlatformFilter(platform, "statusSquareProduct", value)}
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="Start">Start</SelectItem>
                                            <SelectItem value="Stop">Stop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    )
}
