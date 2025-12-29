// Mock Authentication Context for Demo
// In production, this would be replaced with actual auth system

export const mockUsers = {
    admin: {
        userId: "admin_001",
        fullName: "System Admin",
        role: "admin",
        department: "System",
        leaderTeam: null,
        managedMembers: [] // Admin sees all
    },
    leader: {
        userId: "leader_001",
        fullName: "Safari Team Leader",
        role: "leader",
        department: "Wildlife Department",
        leaderTeam: "Safari Team",
        managedMembers: ["member_001", "member_002", "member_003"]
    },
    member1: {
        userId: "member_001",
        fullName: "John Doe",
        role: "member",
        department: "Wildlife Department",
        leaderTeam: "Safari Team",
        managedMembers: []
    },
    member2: {
        userId: "member_002",
        fullName: "Jane Smith",
        role: "member",
        department: "Marine Department",
        leaderTeam: "Deep Sea Team",
        managedMembers: []
    },
    member3: {
        userId: "member_003",
        fullName: "Desert Guide",
        role: "member",
        department: "Desert Department",
        leaderTeam: "Camel Team",
        managedMembers: []
    }
}

// Set current user - change this to test different roles
export const getCurrentUser = () => {
    return mockUsers.admin // Default to admin for demo
}

// Filter posts based on user role
export const filterPostsByRole = (posts, currentUser) => {
    if (!currentUser || !posts) return []

    // Admin sees all posts
    if (currentUser.role === "admin") {
        return posts
    }

    // Leader sees posts from managed members + their own posts
    if (currentUser.role === "leader") {
        return posts.filter(post => {
            if (!post.createdBy) return true // Show posts without creator (legacy)
            return (
                currentUser.managedMembers.includes(post.createdBy.userId) ||
                post.createdBy.userId === currentUser.userId
            )
        })
    }

    // Regular member sees only their own posts
    return posts.filter(post => {
        if (!post.createdBy) return false // Hide posts without creator for members
        return post.createdBy.userId === currentUser.userId
    })
}

// Get display name for creator
export const getCreatorDisplayName = (createdBy) => {
    if (!createdBy) return null
    return createdBy.fullName
}
