import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ViewAssignmentsModal({
    isOpen,
    onClose,
    folderName,
    folderId,
    assignments,
    onDeleteAssignment
}) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        View Assigned Managers - {folderName}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {assignments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No assignments yet</p>
                            <p className="text-sm mt-2">Use "List Assign Info Folder Content manager" to add assignments</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Leader Team</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Last Update</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell className="font-medium">{assignment.department}</TableCell>
                                        <TableCell>{assignment.leaderTeam}</TableCell>
                                        <TableCell>{assignment.member}</TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {formatDate(assignment.lastUpdate)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm(`Delete assignment for ${assignment.member}?`)) {
                                                        onDeleteAssignment(folderId, assignment.id)
                                                    }
                                                }}
                                                className="text-[#64748B] hover:text-red-600 hover:bg-[#EFF6FF]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
