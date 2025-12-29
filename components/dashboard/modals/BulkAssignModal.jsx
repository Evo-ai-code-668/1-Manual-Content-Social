import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function BulkAssignModal({
    isOpen,
    onClose,
    selectedFolders, // Array of folder objects
    onAssign
}) {
    const [formData, setFormData] = useState({
        department: "",
        leaderTeam: "",
        member: ""
    })

    // Mock data - should come from constants or API
    const departments = ["Wildlife Department", "Marine Department", "Avian Department", "Forest Department", "Arctic Department", "Desert Department"]
    const leaderTeams = ["Safari Team Leader", "Deep Sea Leader", "Parrot Team Leader", "Woodland Leader", "Polar Leader", "Camel Team Leader"]
    const members = ["John Doe", "Jane Smith", "Mike Ocean", "Sarah Bird", "Forest Ranger", "Arctic Explorer", "Desert Guide"]

    const handleSubmit = () => {
        if (!formData.department || !formData.leaderTeam || !formData.member) {
            alert("Please fill in all fields")
            return
        }

        onAssign(formData)
        setFormData({ department: "", leaderTeam: "", member: "" })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Assign Info Folder Content Manager
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Selected Folders */}
                    <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Selected Folders ({selectedFolders.length})
                        </Label>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                            {selectedFolders.map((folder) => (
                                <div key={folder.id} className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-white">
                                        {folder.id}
                                    </Badge>
                                    <span className="text-sm text-gray-700">{folder.folderName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <Label htmlFor="department" className="text-sm font-semibold text-gray-700 mb-2 block">
                            Department <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                        >
                            <SelectTrigger id="department">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Leader Team */}
                    <div>
                        <Label htmlFor="leaderTeam" className="text-sm font-semibold text-gray-700 mb-2 block">
                            Leader Team <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.leaderTeam}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, leaderTeam: value }))}
                        >
                            <SelectTrigger id="leaderTeam">
                                <SelectValue placeholder="Select leader team" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaderTeams.map((leader) => (
                                    <SelectItem key={leader} value={leader}>
                                        {leader}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Member */}
                    <div>
                        <Label htmlFor="member" className="text-sm font-semibold text-gray-700 mb-2 block">
                            Member <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.member}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, member: value }))}
                        >
                            <SelectTrigger id="member">
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem key={member} value={member}>
                                        {member}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#3B82F6] hover:bg-[#1D4ED8] text-white"
                    >
                        Assign to {selectedFolders.length} folder{selectedFolders.length > 1 ? 's' : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
