
"use client"

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

export default function StatsOverview({ isOverviewOpen, setIsOverviewOpen, overview }) {
    return (
        <Collapsible open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
            <div
                className="flex items-center justify-between bg-[#F0F4F8] rounded-lg border p-3 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setIsOverviewOpen(!isOverviewOpen)}
            >
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">Overview</h2>
                <ChevronDown
                    className={`h-5 w-5 text-slate-700 transition-transform duration-200 ${isOverviewOpen ? "rotate-180" : ""}`}
                />
            </div>

            <CollapsibleContent>
                <Card className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Row 1: Departments, Teams, Leader, Created By, Content Folder, Ideas, Niches, Type TM, Type NTM */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Departments</p>
                                    <p className="text-lg font-bold text-blue-700">{overview.totalDepartments || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Teams</p>
                                    <p className="text-lg font-bold text-green-700">{overview.totalTeams || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-purple-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Leader</p>
                                    <p className="text-lg font-bold text-purple-700">{overview.totalLeader || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Created By</p>
                                    <p className="text-lg font-bold text-indigo-700">{overview.totalCreatedBy || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-cyan-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Content Folder</p>
                                    <p className="text-lg font-bold text-cyan-700">{overview.totalContentFolder || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-yellow-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Ideas</p>
                                    <p className="text-lg font-bold text-yellow-700">{overview.totalIdeas || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-orange-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Niches</p>
                                    <p className="text-lg font-bold text-orange-700">{overview.totalNiches || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-red-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Type TM</p>
                                    <p className="text-lg font-bold text-red-700">{overview.totalTypeTM || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-pink-100 shadow-sm">
                                    <p className="text-xs text-gray-600">Type NTM</p>
                                    <p className="text-lg font-bold text-pink-700">{overview.totalTypeNTM || 0}</p>
                                </div>
                            </div>

                            {/* Row 2: UserName Account, New Daily, New Monthly */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
                                <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
                                    <p className="text-xs text-gray-600">UserName Account</p>
                                    <p className="text-lg font-bold text-slate-700">{overview.totalUsernameAccount || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-teal-100 shadow-sm">
                                    <p className="text-xs text-gray-600">New Daily</p>
                                    <p className="text-lg font-bold text-teal-700">{overview.totalNewDaily || 0}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-teal-100 shadow-sm">
                                    <p className="text-xs text-gray-600">New Monthly</p>
                                    <p className="text-lg font-bold text-teal-700">{overview.totalNewMonthly || 0}</p>
                                </div>
                            </div>

                            {/* Row 3 (previously Row 4): Status Account Social, Login App Clone, Status New (combined), Combined Status ID Posts + Start Content Folder */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {/* Status Account Social - All statuses vertically */}
                                <div className="bg-white rounded-lg p-3 border border-cyan-100 shadow-sm">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Status Account Social</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Available New:</p>
                                            <p className="text-sm font-bold text-green-600">{overview.statusAccountAvailable || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Checkpoint:</p>
                                            <p className="text-sm font-bold text-orange-600">{overview.statusAccountCheckpoint || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">InUseDevice:</p>
                                            <p className="text-sm font-bold text-blue-600">{overview.statusAccountInUse || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">LockedOnDevice:</p>
                                            <p className="text-sm font-bold text-red-600">{overview.statusAccountLocked || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Dead:</p>
                                            <p className="text-sm font-bold text-red-600">{overview.statusAccountDead || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">NetworkError:</p>
                                            <p className="text-sm font-bold text-purple-600">{overview.statusAccountNetworkError || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Spam:</p>
                                            <p className="text-sm font-bold text-yellow-600">{overview.statusAccountSpam || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">N/A:</p>
                                            <p className="text-sm font-bold text-gray-500">{overview.statusAccountNA || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Login App Clone - All statuses vertically */}
                                <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Login App Clone</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Active:</p>
                                            <p className="text-sm font-bold text-green-600">{overview.loginAppCloneActive || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Dead:</p>
                                            <p className="text-sm font-bold text-red-600">{overview.loginAppCloneDead || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">LockedOnDevice:</p>
                                            <p className="text-sm font-bold text-orange-600">{overview.loginAppCloneLocked || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">LoginError:</p>
                                            <p className="text-sm font-bold text-red-600">{overview.loginAppCloneLoginError || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">NetworkError:</p>
                                            <p className="text-sm font-bold text-purple-600">{overview.loginAppCloneNetworkError || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">Spam:</p>
                                            <p className="text-sm font-bold text-yellow-600">{overview.loginAppCloneSpam || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">ErrorAppClone:</p>
                                            <p className="text-sm font-bold text-pink-600">{overview.loginAppCloneErrorAppClone || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-600">N/A:</p>
                                            <p className="text-sm font-bold text-gray-500">{overview.loginAppCloneNA || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Combined Status Card for New, Reel, Square Product */}
                                <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                                    <div className="space-y-3">
                                        {/* Status New (Square) */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Status New (Square)</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Stop:</p>
                                                    <p className="text-sm font-bold text-red-600">{overview.newSquareStop || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Start:</p>
                                                    <p className="text-sm font-bold text-green-600">{overview.newSquareStart || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Status Reel (Vertical) */}
                                        <div className="border-t pt-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Status Reel (Vertical)</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Stop:</p>
                                                    <p className="text-sm font-bold text-red-600">{overview.reelVerticalStop || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Start:</p>
                                                    <p className="text-sm font-bold text-green-600">{overview.reelVerticalStart || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Status Square Product */}
                                        <div className="border-t pt-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-1">Status Square Product</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Stop:</p>
                                                    <p className="text-sm font-bold text-red-600">{overview.squareProductStop || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Start:</p>
                                                    <p className="text-sm font-bold text-green-600">{overview.squareProductStart || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm">
                                    <div className="space-y-3">
                                        {/* Status ID Posts */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Status ID Posts</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Total Draft:</p>
                                                    <p className="text-sm font-bold text-amber-600">{overview.totalDraft || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Total Use:</p>
                                                    <p className="text-sm font-bold text-blue-600">{overview.totalUse || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Total Posted:</p>
                                                    <p className="text-sm font-bold text-green-600">{overview.totalPosted || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Total Error:</p>
                                                    <p className="text-sm font-bold text-red-600">{overview.totalError || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Start Content Folder */}
                                        <div className="border-t pt-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Start Content Folder</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Stop:</p>
                                                    <p className="text-sm font-bold text-red-600">{overview.totalStopContent || 0}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-600">Start:</p>
                                                    <p className="text-sm font-bold text-green-600">{overview.totalStartContent || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    )
}
