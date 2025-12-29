"use client"

import { CardFooter } from "@/components/ui/card"
import StatsOverview from "@/components/dashboard/StatsOverview"
import FilterBar from "@/components/dashboard/FilterBar"
import ContentGrid from "@/components/dashboard/ContentGrid"
import CreateFolderModal from "@/components/dashboard/modals/CreateFolderModal"
import EditFolderModal from "@/components/dashboard/modals/EditFolderModal"
import ViewPostsModal from "@/components/dashboard/modals/ViewPostsModal"
import CreatePostModal from "@/components/dashboard/modals/CreatePostModal"
import BulkCreateModal from "@/components/dashboard/modals/BulkCreateModal"
import DeleteConfirmationModal from "@/components/dashboard/modals/DeleteConfirmationModal"
import ViewAssignmentsModal from "@/components/dashboard/modals/ViewAssignmentsModal"
import BulkAssignModal from "@/components/dashboard/modals/BulkAssignModal"

import {
  socialPlatforms,
  platformConfig,
  statusConfig,
  autoSyncData,
  models,
  ideas,
  nichesByIdea,
  groupMockData,
  usernamesByGroup
} from "@/lib/constants"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Eye,
  Trash2,
  Upload,
  FolderOpen,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  CheckCircle,
  Lock,
  Clock,
  Save,
  ChevronsLeft,
  ChevronsRight,
  Check,
  User,
  Calendar,
  Pencil,
  FileImage,
  Play,
  GripVertical,
  ImageIcon,
  Instagram,
  FileText,
  Film,
  Info,
  FileX,
  Layers,
  StopCircle,
  PlayCircle,
  Shuffle,
} from "lucide-react"

// MultiSelect component removed - using native Select with manual toggle instead

// Social platforms and their usernames
// socialPlatforms moved to lib/constants

// Platform colors and icons
// platformConfig moved to lib/constants

// Status configuration
// statusConfig moved to lib/constants

// Auto-sync data based on idea and niche combinations
// autoSyncData moved to lib/constants

const allSocialPlatforms = Object.keys(socialPlatforms);

export default function ImageManagement() {
  const [ideaNiches, setIdeaNiches] = useState([
    {
      id: "001",
      folderName: "African Safari Lions Collection",
      model: "Google.Labs",
      accountSocial: "instagram",
      usernameSocial: "@wildlife_explorer",
      groupAccountSocial: "Wildlife Influencers",
      statusAccountSocial: "Available New",
      loginAppClone: "Active",
      statusContentFolder: "Start",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Wild Cats",
      niche: ["African Safari"],
      type: "NTM",
      departmentWorks: "Wildlife Department",
      groupWork: "Safari Team",
      userWorks: "Wildlife Photography",
      status: "Active",
      createdBy: "John Doe",
      updatedBy: "Jane Smith",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      statusChangedAt: null, // Only updates when statusContentFolder changes
      // Per-card status timestamps (independent tracking for each FolderCard)
      newStatusChangedAt: null, // For "New (Square)" card
      reelStatusChangedAt: null, // For "Reel (Vertical)" card
      squareProductStatusChangedAt: null, // For "Square Product" card
      assignedManagers: [
        {
          id: "assign_001",
          department: "Wildlife Department",
          leaderTeam: "Safari Team Leader",
          member: "John Doe",
          lastUpdate: "2025-01-20T10:30:00",
          createdAt: "2025-01-15T09:00:00",
          createdBy: "Current User"
        }
      ],
      images: {
        subject: Array.from({ length: 15 }, (_, i) => ({
          id: `subject-${i + 1}`,
          name: `lion_${i + 1}.jpg`,
          url: `/placeholder.svg?height=200&width=200&query=lion${i + 1}`,
        })),
        scene: Array.from({ length: 8 }, (_, i) => ({
          id: `scene-${i + 1}`,
          name: `savanna_${i + 1}.jpg`,
          url: `/placeholder.svg?height=200&width=200&query=savanna${i + 1}`,
        })),
        style: Array.from({ length: 5 }, (_, i) => ({
          id: `style-${i + 1}`,
          name: `golden_hour_${i + 1}.jpg`,
          url: `/placeholder.svg?height=200&width=200&query=golden${i + 1}`,
        })),
      },
      contentTypeConfigs: {
        new: {
          dayOfWeeks: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          timeRanges: [
            { from: "09:00", to: "11:00" },
            { from: "19:00", to: "21:00" },
          ],
        },
        reel: {
          dayOfWeeks: ["Mon", "Wed", "Fri", "Sat"],
          timeRanges: [
            { from: "12:00", to: "14:00" },
            { from: "21:30", to: "23:30" },
          ],
        },
        squareProduct: {
          dayOfWeeks: ["Tue", "Thu", "Sat", "Sun"],
          timeRanges: [
            { from: "06:00", to: "08:00" },
            { from: "15:00", to: "17:00" },
          ],
        },
      },
    },
    {
      id: "002",
      folderName: "Deep Sea Whale Research",
      model: "Freepik",
      accountSocial: "tiktok",
      usernameSocial: "@wildlife_tiktok",
      groupAccountSocial: "Marine Research Group",
      statusAccountSocial: "Dead",
      loginAppClone: "N/A",
      statusContentFolder: "Stop",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Ocean Mammals",
      niche: ["Deep Sea Giants"],
      type: "TM",
      departmentWorks: "Marine Department",
      groupWork: "Deep Sea Research",
      userWorks: "Marine Biology",
      status: "Locker",
      createdBy: "Mike Ocean",
      updatedBy: "Current User",
      createdAt: "2024-01-10",
      updatedAt: "2025-01-05",
      statusChangedAt: null,
      newStatusChangedAt: null,
      reelStatusChangedAt: null,
      squareProductStatusChangedAt: null,
      assignedManagers: [],
    },
    {
      id: "003",
      folderName: "Tropical Parrot Paradise",
      model: "Google.Labs",
      accountSocial: "youtube",
      usernameSocial: "Wildlife Channel",
      groupAccountSocial: "Avian Team",
      statusAccountSocial: "Checkpoint",
      loginAppClone: "Active",
      statusContentFolder: "Start",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Tropical Birds",
      niche: ["Parrots", "Hummingbirds"],
      type: "TM",
      departmentWorks: "Avian Department",
      groupWork: "Parrot Team",
      userWorks: "Parrot Behavior",
      status: "Pending",
      createdBy: "Sarah Bird",
      updatedBy: "Current User",
      createdAt: "2024-01-12",
      updatedAt: "2025-01-03",
      statusChangedAt: null,
      newStatusChangedAt: null,
      reelStatusChangedAt: null,
      squareProductStatusChangedAt: null,
      assignedManagers: [],
    },
    {
      id: "004",
      folderName: "Enchanted Woodland Creatures",
      model: "Freepik",
      accountSocial: "instagram",
      usernameSocial: "@nature_shots",
      groupAccountSocial: "Forest Team",
      statusAccountSocial: "Available New",
      loginAppClone: "Dead",
      statusContentFolder: "Start",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Forest Animals",
      niche: ["Woodland Creatures"],
      type: "NTM",
      departmentWorks: "Forest Department",
      groupWork: "Woodland Team",
      userWorks: "Nature Documentary",
      status: "Active",
      createdBy: "Forest Ranger",
      updatedBy: "Current User",
      createdAt: "2024-01-08",
      updatedAt: "2025-01-02",
      statusChangedAt: null,
      newStatusChangedAt: null,
      reelStatusChangedAt: null,
      squareProductStatusChangedAt: null,
      assignedManagers: [],
    },
    {
      id: "005",
      folderName: "Majestic Polar Bear Expedition",
      model: "Google.Labs",
      accountSocial: "pinterest",
      usernameSocial: "Wildlife Boards",
      groupAccountSocial: "Polar Research",
      statusAccountSocial: "InUseDevice",
      loginAppClone: "NetworkError",
      statusContentFolder: "Stop",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Arctic Animals",
      niche: ["Polar Bears"],
      type: "TM",
      departmentWorks: "Arctic Department",
      groupWork: "Polar Research",
      userWorks: "Polar Bear Study",
      status: "Pending",
      createdBy: "Arctic Explorer",
      updatedBy: "Current User",
      createdAt: "2024-01-05",
      updatedAt: "2025-01-01",
      statusChangedAt: null,
      newStatusChangedAt: null,
      reelStatusChangedAt: null,
      squareProductStatusChangedAt: null,
      assignedManagers: [],
    },
    {
      id: "006",
      folderName: "Sahara Camel Caravan",
      model: "Freepik",
      accountSocial: "medium",
      usernameSocial: "Wildlife Stories",
      groupAccountSocial: "Desert Team",
      statusAccountSocial: "Available New",
      loginAppClone: "Active",
      statusContentFolder: "Start",
      // statusNewSquare, statusReelVertical, statusSquareProduct removed - calculated REALTIME
      idea: "Desert Animals",
      niche: ["Camels"],
      type: "NTM",
      departmentWorks: "Desert Department",
      groupWork: "Camel Team",
      userWorks: "Desert Adaptation",
      status: "Locker",
      createdBy: "Desert Guide",
      updatedBy: "Current User",
      createdAt: "2024-01-03",
      updatedAt: "2024-12-30",
      statusChangedAt: null,
      newStatusChangedAt: null,
      reelStatusChangedAt: null,
      squareProductStatusChangedAt: null,
      assignedManagers: [],
    },
  ])

  // Removed unused MultiSelect component and added missing state variables
  const [activeTab, setActiveTab] = useState("instagram")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Filter & UI States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [folderNameSearch, setFolderNameSearch] = useState("")
  const [filterPresets, setFilterPresets] = useState([])
  const [viewGuideVisible, setViewGuideVisible] = useState(false)
  const [platformFilters, setPlatformFilters] = useState({})
  const [platformPagination, setPlatformPagination] = useState({})

  // Selection & Modals
  const [selectedIds, setSelectedIds] = useState([])
  const [viewPostsModal, setViewPostsModal] = useState({
    isOpen: false,
    posts: [],
    folderName: "",
    ideaNicheId: "",
    folderType: "subject",
    currentImagePage: 1,
    viewMode: "grid",
    selectedImage: null,
    editingPostId: null,
    currentPage: 1,
    postsPerPage: 10,
    collapsedCaptions: {},
    collapsedMedia: {}
  })

  const [createPostModal, setCreatePostModal] = useState({
    isOpen: false,
    ideaNicheId: "",
    folderType: "subject",
    folderName: "",
    caption: "",
    mediaFiles: [],
    uploadProgress: 0,
    isUploading: false,
  })

  const [bulkCreateModal, setBulkCreateModal] = useState({
    isOpen: false,
    ideaNicheId: null,
    folderType: null,
    folderName: null,
    quantity: 5,
  })

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: null,
    postId: null,
    position: null,
    postNumber: null,
  })

  const [viewAssignmentsModal, setViewAssignmentsModal] = useState({
    isOpen: false,
    folderId: "",
    folderName: "",
    assignments: []
  })

  const [bulkAssignModal, setBulkAssignModal] = useState({
    isOpen: false,
    selectedFolderIds: []
  })

  const [posts, setPosts] = useState({
    // Folder 001 - Instagram - African Safari
    "001-subject": [
      {
        id: "p1",
        postNumber: 1,
        status: "Use",
        caption: "Lion in savanna",
        mediaFiles: [],
        createdAt: "2025-01-15T10:00:00",
        updatedAt: null, // Only updates when post status changes
        statusChangedAt: null, // Tracks status changes specifically
        createdBy: { userId: "member_001", fullName: "John Doe", department: "Wildlife Department", leaderTeam: "Safari Team" }
      },
      {
        id: "p2",
        postNumber: 2,
        status: "draft",
        caption: "Pride of lions",
        mediaFiles: [],
        createdAt: "2025-01-15T11:00:00",
        updatedAt: null,
        statusChangedAt: null,
        createdBy: { userId: "member_002", fullName: "Jane Smith", department: "Marine Department", leaderTeam: "Deep Sea Team" }
      },
    ],
    "001-scene": [
      {
        id: "p3",
        postNumber: 1,
        status: "Use",
        caption: "Savanna landscape",
        mediaFiles: [],
        createdAt: "2025-01-15T12:00:00",
        updatedAt: null,
        statusChangedAt: null,
        createdBy: { userId: "member_001", fullName: "John Doe", department: "Wildlife Department", leaderTeam: "Safari Team" }
      },
    ],
    "001-style": [
      {
        id: "p4",
        postNumber: 1,
        status: "draft",
        caption: "Golden hour style",
        mediaFiles: [],
        createdAt: "2025-01-15T13:00:00",
        updatedAt: null,
        statusChangedAt: null,
        createdBy: { userId: "member_003", fullName: "Desert Guide", department: "Desert Department", leaderTeam: "Camel Team" }
      },
    ],
    // Folder 002 - TikTok - Deep Sea
    "002-scene": [
      {
        id: "p5",
        postNumber: 1,
        status: "Use",
        caption: "Whale swimming",
        mediaFiles: [],
        createdAt: "2025-01-10T10:00:00",
        updatedAt: null,
        statusChangedAt: null,
        createdBy: { userId: "member_002", fullName: "Jane Smith", department: "Marine Department", leaderTeam: "Deep Sea Team" }
      },
      {
        id: "p6",
        postNumber: 2,
        status: "Posted",
        caption: "Deep sea exploration",
        mediaFiles: [],
        createdAt: "2025-01-10T11:00:00",
        updatedAt: null,
        statusChangedAt: null,
        createdBy: { userId: "leader_001", fullName: "Safari Team Leader", department: "Wildlife Department", leaderTeam: "Safari Team" }
      },
    ],
  })


  // Create modal form states
  const [selectedAccountSocial, setSelectedAccountSocial] = useState("")
  const [createSelectedGroupAccountSocial, setCreateSelectedGroupAccountSocial] = useState("")
  const [selectedUsernameSocial, setSelectedUsernameSocial] = useState("")
  const [selectedFolderName, setSelectedFolderName] = useState("")


  // Helper: Get Unique Filter Values
  const getPlatformUniqueFilterValues = (platform) => {
    const items = platform === 'all' ? ideaNiches : ideaNiches.filter(i => i.accountSocial === platform)
    const departments = new Set(items.map((item) => item.departmentWorks))
    const teams = new Set(items.map((item) => item.groupWork))
    const users = new Set(items.map((item) => item.userWorks))
    const ideas = new Set(items.map((item) => item.idea))
    const niches = new Set(items.flatMap((item) => item.niche))
    const createdBy = new Set(items.map((item) => item.createdBy))
    const updatedBy = new Set(items.map((item) => item.updatedBy))
    const models = new Set(items.map((item) => item.model))

    return {
      departments: Array.from(departments),
      teams: Array.from(teams),
      users: Array.from(users),
      ideas: Array.from(ideas),
      niches: Array.from(niches),
      createdBy: Array.from(createdBy),
      updatedBy: Array.from(updatedBy),
      models: Array.from(models),
    }
  }

  // Helper: Get Platform Overview Stats (REALTIME CALCULATED)
  const getPlatformOverview = useMemo(() => {
    return (platform) => {
      const platformItems = ideaNiches.filter((item) => item.accountSocial === platform)

      // Row 1: Basic Stats
      const totalDepartments = new Set(platformItems.map(i => i.departmentWorks)).size
      const totalTeams = new Set(platformItems.map(i => i.groupWork)).size
      const totalLeader = new Set(platformItems.map(i => i.userWorks)).size
      const totalCreatedBy = new Set(platformItems.map(i => i.createdBy)).size
      const totalContentFolder = platformItems.length
      const totalIdeas = new Set(platformItems.map(i => i.idea)).size
      const totalNiches = new Set(platformItems.flatMap(i => i.niche)).size
      const totalTypeTM = platformItems.filter(i => i.type === "TM").length
      const totalTypeNTM = platformItems.filter(i => i.type === "NTM").length

      // Row 2: Account Stats
      const totalUsernameAccount = new Set(platformItems.map(i => i.usernameSocial)).size
      const today = new Date().toISOString().split('T')[0]
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const totalNewDaily = platformItems.filter(i => i.createdAt === today).length
      const totalNewMonthly = platformItems.filter(i => i.createdAt.startsWith(currentMonth)).length

      // Row 3: Status Account Social
      const statusAccountAvailable = platformItems.filter(i => i.statusAccountSocial === "Available New").length
      const statusAccountCheckpoint = platformItems.filter(i => i.statusAccountSocial === "Checkpoint").length
      const statusAccountInUse = platformItems.filter(i => i.statusAccountSocial === "InUseDevice").length
      const statusAccountLocked = platformItems.filter(i => i.statusAccountSocial === "LockedOnDevice").length
      const statusAccountDead = platformItems.filter(i => i.statusAccountSocial === "Dead").length
      const statusAccountNetworkError = platformItems.filter(i => i.statusAccountSocial === "NetworkError").length
      const statusAccountSpam = platformItems.filter(i => i.statusAccountSocial === "Spam").length
      const statusAccountNA = platformItems.filter(i => i.statusAccountSocial === "N/A").length

      // Row 3: Login App Clone
      const loginAppCloneActive = platformItems.filter(i => i.loginAppClone === "Active").length
      const loginAppCloneDead = platformItems.filter(i => i.loginAppClone === "Dead").length
      const loginAppCloneLocked = platformItems.filter(i => i.loginAppClone === "LockedOnDevice").length
      const loginAppCloneLoginError = platformItems.filter(i => i.loginAppClone === "LoginError").length
      const loginAppCloneNetworkError = platformItems.filter(i => i.loginAppClone === "NetworkError").length
      const loginAppCloneSpam = platformItems.filter(i => i.loginAppClone === "Spam").length
      const loginAppCloneErrorAppClone = platformItems.filter(i => i.loginAppClone === "ErrorAppClone").length
      const loginAppCloneNA = platformItems.filter(i => i.loginAppClone === "N/A").length

      // Row 3: REALTIME CALCULATED - Status New/Reel/Square
      const newSquareStart = platformItems.filter(folder => {
        const folderPosts = posts[`${folder.id}-subject`] || []
        return folderPosts.filter(p => p.status === "Use").length >= 1
      }).length
      const newSquareStop = platformItems.length - newSquareStart

      const reelVerticalStart = platformItems.filter(folder => {
        const folderPosts = posts[`${folder.id}-scene`] || []
        return folderPosts.filter(p => p.status === "Use").length >= 1
      }).length
      const reelVerticalStop = platformItems.length - reelVerticalStart

      const squareProductStart = platformItems.filter(folder => {
        const folderPosts = posts[`${folder.id}-style`] || []
        return folderPosts.filter(p => p.status === "Use").length >= 1
      }).length
      const squareProductStop = platformItems.length - squareProductStart

      // Row 3: Post Status Stats (REALTIME CALCULATED)
      const allPlatformPosts = Object.entries(posts)
        .filter(([key]) => {
          const folderId = key.split('-')[0]
          return platformItems.some(item => item.id === folderId)
        })
        .flatMap(([_, postArray]) => postArray)

      const totalDraft = allPlatformPosts.filter(p => p.status?.toLowerCase() === "draft").length
      const totalUse = allPlatformPosts.filter(p => p.status === "Use").length
      const totalPosted = allPlatformPosts.filter(p => p.status === "Posted").length
      const totalError = allPlatformPosts.filter(p => p.status === "Posting Error").length

      // Row 3: Status Content Folder
      const totalStopContent = platformItems.filter(i => i.statusContentFolder === "Stop").length
      const totalStartContent = platformItems.filter(i => i.statusContentFolder === "Start").length

      // Legacy stats (for backward compatibility)
      const activeCount = platformItems.filter((item) => item.status === "Active").length
      const lockerCount = platformItems.filter((item) => item.status === "Locker").length
      const pendingCount = platformItems.filter((item) => item.status === "Pending").length

      return {
        // Row 1
        totalDepartments,
        totalTeams,
        totalLeader,
        totalCreatedBy,
        totalContentFolder,
        totalIdeas,
        totalNiches,
        totalTypeTM,
        totalTypeNTM,

        // Row 2
        totalUsernameAccount,
        totalNewDaily,
        totalNewMonthly,

        // Row 3: Status Account Social
        statusAccountAvailable,
        statusAccountCheckpoint,
        statusAccountInUse,
        statusAccountLocked,
        statusAccountDead,
        statusAccountNetworkError,
        statusAccountSpam,
        statusAccountNA,

        // Row 3: Login App Clone
        loginAppCloneActive,
        loginAppCloneDead,
        loginAppCloneLocked,
        loginAppCloneLoginError,
        loginAppCloneNetworkError,
        loginAppCloneSpam,
        loginAppCloneErrorAppClone,
        loginAppCloneNA,

        // Row 3: REALTIME - Status New/Reel/Square
        newSquareStart,
        newSquareStop,
        reelVerticalStart,
        reelVerticalStop,
        squareProductStart,
        squareProductStop,

        // Row 3: Post Status
        totalDraft,
        totalUse,
        totalPosted,
        totalError,

        // Row 3: Content Folder Status
        totalStopContent,
        totalStartContent,

        // Legacy
        total: platformItems.length,
        active: activeCount,
        locker: lockerCount,
        pending: pendingCount,
      }
    }
  }, [ideaNiches, posts]) // ← CRITICAL: Re-calculate when folders or posts change


  // Helper: Get Filtered Items
  const getFilteredItems = (platform) => {
    let items = ideaNiches.filter(item => item.accountSocial === platform)
    const filters = platformFilters[platform] || {}

    if (folderNameSearch) {
      items = items.filter(item => item.folderName.toLowerCase().includes(folderNameSearch.toLowerCase()))
    }

    // Apply other filters (simplified restoration)
    if (filters.status && filters.status !== 'all') {
      items = items.filter(item => item.status === filters.status)
    }
    if (filters.idea && filters.idea !== 'all') {
      items = items.filter(item => item.idea === filters.idea)
    }

    return items
  }

  // filter handlers
  const updatePlatformFilter = (platform, key, value) => {
    setPlatformFilters(prev => ({
      ...prev,
      [platform]: { ...(prev[platform] || {}), [key]: value }
    }))
  }

  const clearPlatformFilters = (platform) => {
    setPlatformFilters(prev => ({
      ...prev,
      [platform]: {}
    }))
  }

  const handleSavePreset = (name, platform) => {
    const filters = platformFilters[platform] || {}
    setFilterPresets(prev => [...prev, { name, filters, platform }])
  }

  const handleLoadPreset = (preset) => {
    setPlatformFilters(prev => ({
      ...prev,
      [preset.platform]: preset.filters
    }))
  }

  // Action Handlers
  const handleSelectAll = (checked, platform) => {
    if (checked) {
      const items = getFilteredItems(platform)
      setSelectedIds(items.map(i => i.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectItem = (id, checked) => {
    if (checked) setSelectedIds(prev => [...prev, id])
    else setSelectedIds(prev => prev.filter(pid => pid !== id))
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setDeleteConfirmation({
      isOpen: true,
      type: 'bulk',
      position: { top: window.scrollY + window.innerHeight / 2, left: window.innerWidth / 2 } // Centered fallback
    })
  }

  const handleConfirmDeleteAction = () => {
    if (deleteConfirmation.type === 'bulk') {
      setIdeaNiches(prev => prev.filter(i => !selectedIds.includes(i.id)))
      setSelectedIds([])
    } else if (deleteConfirmation.type === 'single' && deleteConfirmation.postId) {
      // Logic for single post delete if needed, though currently not main focus
      // Assuming removing from 'posts' state or similar if implemented
    }
    setDeleteConfirmation({ isOpen: false, type: null, postId: null, position: null })
  }

  const handleStatusFieldUpdate = (id, field, value) => {
    const now = new Date()
    const formattedDateTime = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) + " " + now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })

    setIdeaNiches(prev => prev.map(item =>
      item.id === id ? {
        ...item,
        [field]: value,
        updatedAt: formattedDateTime,
        updatedBy: "Current User",
        // Track status change time specifically for statusContentFolder
        ...(field === "statusContentFolder" ? { statusChangedAt: formattedDateTime } : {})
      } : item
    ))
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleUpdateItem = (updatedItem) => {
    setIdeaNiches((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setIsEditModalOpen(false)
    setEditingItem(null)
  }

  const handleViewPosts = (ideaNicheId, folderType, folderName) => {
    const key = `${ideaNicheId}-${folderType}`
    const folderPosts = posts[key] || []
    // Find the ideaNiche item to get contentTypeConfigs
    const ideaNiche = ideaNiches.find(item => item.id === ideaNicheId)
    setViewPostsModal({
      isOpen: true,
      posts: folderPosts,
      folderName,
      ideaNicheId,
      folderType,
      selectedPostIndex: 0,
      viewMode: "grid",
      editingPostId: null,
      currentPage: 1,
      postsPerPage: 10,
      collapsedCaptions: {},
      collapsedMedia: {},
      contentTypeConfigs: ideaNiche?.contentTypeConfigs || null
    })
  }

  const handleOpenBulkCreate = (ideaNicheId, folderType, folderName) => {
    setBulkCreateModal({
      isOpen: true,
      ideaNicheId,
      folderType,
      folderName,
      quantity: 5,
    })
  }


  const setCurrentPage = (platform, page) => {
    setPlatformPagination(prev => ({
      ...prev,
      [platform]: { ...(prev[platform] || { itemsPerPage: 10 }), currentPage: page }
    }))
  }

  const setItemsPerPage = (platform, items) => {
    setPlatformPagination(prev => ({
      ...prev,
      [platform]: { ...(prev[platform] || { currentPage: 1 }), itemsPerPage: items, currentPage: 1 }
    }))
  }

  const renderPlatformContent = (platform) => {
    const platformItems = getFilteredItems(platform)
    const { currentPage, itemsPerPage } = platformPagination[platform] || { currentPage: 1, itemsPerPage: 10 }
    const totalPages = Math.ceil(platformItems.length / itemsPerPage)
    const currentItems = platformItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const currentFilters = platformFilters[platform] || {
      model: "all",
      departmentWorks: "all",
      groupWork: "all",
      userWorks: "all",
      idea: "all",
      niche: "all",
      status: "all",
      updatedBy: "all",
      departments: "all",
      teams: "all",
      leader: "all",
      createdBy: "all",
      contentFolder: "all",
      niches: "all",
      usernameAccount: "all",
      statusAccount: "all",
      loginAppClone: "all",
      startContent: "all",
      stopContent: "all",
      newDaily: "all",
      newWeekly: "all",
      newMonthly: "all",
      newQuarterly: "all",
      newYearly: "all",
      newSquare: "all",
      reelVertical: "all",
      squareProduct: "all",
      totalDraft: "all",
      totalUse: "all",
      totalPosted: "all",
      totalError: "all",
      typeTM: "all",
      typeNTM: "all",
      statusNewSquare: "all", // Added
      statusReelVertical: "all", // Added
      statusSquareProduct: "all", // Added
    }
    const overview = getPlatformOverview(platform)
    const filterValues = getPlatformUniqueFilterValues(platform)

    return (
      <div className="space-y-6">
        {/* Overview Section */}
        <StatsOverview
          isOverviewOpen={isOverviewOpen}
          setIsOverviewOpen={setIsOverviewOpen}
          overview={overview}
        />

        {/* Filter Section */}
        <FilterBar
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          currentFilters={currentFilters}
          updatePlatformFilter={updatePlatformFilter}
          platform={platform}
          handleSavePreset={handleSavePreset}
          handleLoadPreset={handleLoadPreset}
          filterPresets={filterPresets}
          filterValues={filterValues}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                // Set selectedAccountSocial to the current platform tab, or leave it if it's 'all'
                setSelectedAccountSocial(platform === "all" ? "" : platform)
                setCreateSelectedGroupAccountSocial("") // Reset group on new creation
                setSelectedUsernameSocial("")
                setSelectedFolderName("")
                setIsCreateModalOpen(true)
              }}
              className="bg-[#509485] hover:bg-[#3e7d71]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New for {platformConfig[platform]?.name || "All Platforms"}
            </Button>

            {/* Bulk Assign Button */}
            <Button
              onClick={handleOpenBulkAssign}
              variant="outline"
              className="bg-[#DBEAFE] text-[#1D4ED8] hover:bg-[#3B82F6] hover:text-white border-[#3B82F6]"
              disabled={selectedIds.length === 0}
            >
              <User className="h-4 w-4 mr-2" />
              List Assign Info Folder Content manager
              {selectedIds.length > 0 && (
                <Badge className="ml-2 bg-[#3B82F6] text-white">
                  {selectedIds.length}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search folder name..."
                value={folderNameSearch}
                onChange={(e) => setFolderNameSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-[#F0F4F8] text-gray-700 border-gray-300">
              Search
            </Button>
          </div>
        </div>

        <ContentGrid
          platform={platform}
          platformItems={platformItems}
          currentItems={currentItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={(page) => setCurrentPage(platform, page)}
          setItemsPerPage={(items) => setItemsPerPage(platform, items)}
          selectedIds={selectedIds}
          handleSelectAll={(checked) => handleSelectAll(checked, platform)}
          handleBulkDelete={handleBulkDelete}
          handleSelectItem={handleSelectItem}
          handleStatusFieldUpdate={handleStatusFieldUpdate}
          handleEdit={handleOpenEdit}
          handleViewAssignments={handleViewAssignments}
          handleViewPosts={handleViewPosts}
          handleOpenCreatePost={handleOpenCreatePost}
          handleOpenBulkCreate={handleOpenBulkCreate}
          posts={posts}
        />
      </div>
    )
  }

  // Placeholder for platformStats - this needs to be calculated based on ideaNiches
  const platformStats = allSocialPlatforms.reduce((acc, platform) => {
    acc[platform] = ideaNiches.filter((item) => item.accountSocial === platform).length
    return acc
  }, {})

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K"
    }
    return count.toString()
  }

  // Moved the selectedPost and handleStatusChange related to post status
  const [selectedPost, setSelectedPost] = useState(null)

  const [selectedPostIds, setSelectedPostIds] = useState([])

  const [statusFilter, setStatusFilter] = useState("all")

  const handlePostStatusChangeForView = (postId, newStatus) => {
    const key = `${viewPostsModal.ideaNicheId}-${viewPostsModal.folderType}`
    const folderType = viewPostsModal.folderType
    const ideaNicheId = viewPostsModal.ideaNicheId
    const currentPosts = posts[key] || []

    // Calculate old "Use" count before change
    const oldUseCount = currentPosts.filter(p => p.status === "Use").length

    // Calculate new "Use" count after change
    const post = currentPosts.find(p => p.id === postId)
    const wasUse = post?.status === "Use"
    const willBeUse = newStatus === "Use"
    const newUseCount = oldUseCount + (willBeUse ? 1 : 0) - (wasUse ? 1 : 0)

    // Determine if folder status changes (Start <-> Stop)
    const oldFolderStatus = oldUseCount >= 1 ? "Start" : "Stop"
    const newFolderStatus = newUseCount >= 1 ? "Start" : "Stop"
    const folderStatusChanged = oldFolderStatus !== newFolderStatus

    const now = new Date().toISOString()

    setPosts((prev) => ({
      ...prev,
      [key]: prev[key].map((post) =>
        post.id === postId ? { ...post, status: newStatus, statusChangedAt: now } : post,
      ),
    }))

    // Update viewPostsModal to reflect changes
    setViewPostsModal((prev) => ({
      ...prev,
      posts: prev.posts.map((post) =>
        post.id === postId ? { ...post, status: newStatus, statusChangedAt: now } : post,
      ),
    }))

    // Update the selectedPost if it's the one being changed
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => ({ ...prev, status: newStatus, statusChangedAt: now }))
    }

    // Update per-card timestamp if folder status changed (Start <-> Stop)
    if (folderStatusChanged) {
      const formattedDateTime = new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric"
      }) + " " + new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit"
      })

      const timestampField = folderType === "new" ? "newStatusChangedAt"
        : folderType === "reel" ? "reelStatusChangedAt"
          : "squareProductStatusChangedAt"

      setIdeaNiches(prev => prev.map(item =>
        item.id === ideaNicheId
          ? { ...item, [timestampField]: formattedDateTime }
          : item
      ))
    }
  }

  const getFilteredPosts = () => {
    if (statusFilter === "all") {
      return viewPostsModal.posts
    }
    // Ensure comparison is case-insensitive for statusFilter and post.status
    return viewPostsModal.posts.filter((post) => {
      const postStatus = post.status?.toLowerCase() || "draft"
      return postStatus === statusFilter.toLowerCase()
    })
  }

  const handleBulkStatusEdit = (newStatus) => {
    selectedPostIds.forEach((postId) => {
      handlePostStatusChangeForView(postId, newStatus)
    })
    setSelectedPostIds([]) // Clear selection after bulk action
  }

  // Helper to toggle caption collapse in viewPostsModal
  const toggleCaptionCollapse = (postId) => {
    setViewPostsModal((prev) => ({
      ...prev,
      collapsedCaptions: {
        ...prev.collapsedCaptions,
        [postId]: !prev.collapsedCaptions[postId],
      },
    }))
  }

  // Helper to toggle media collapse in viewPostsModal
  const toggleMediaCollapse = (postId) => {
    setViewPostsModal((prev) => ({
      ...prev,
      collapsedMedia: {
        ...prev.collapsedMedia,
        [postId]: !prev.collapsedMedia[postId],
      },
    }))
  }

  // New state for caption and media collapse
  const [isCaptionCollapsed, setIsCaptionCollapsed] = useState(false)
  const [isMediaCollapsed, setIsMediaCollapsed] = useState(false) // Changed default to false for initial view

  // Status info getter for post header
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "use":
        return { label: "Use", color: "bg-blue-100 text-blue-700 border-blue-200" }
      case "draft":
        return { label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
      case "posted":
        return { label: "Posted", color: "bg-green-100 text-green-700 border-green-200" }
      case "posting error":
        return { label: "Posting Error", color: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: "Draft", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
    }
  }

  // Helper functions for content type scheduling configurations




  const handleCreateItem = (newItem) => {
    setIdeaNiches((prev) => [newItem, ...prev])
    setIsCreateModalOpen(false)
  }

  // Bulk create posts handler (added as per lint error)

  const handleUpdateBulkData = (updates) => {
    setBulkCreateModal((prev) => ({
      ...prev,
      ...updates
    }))
  }

  const handleBulkCreatePosts = () => {
    if (
      bulkCreateModal.ideaNicheId &&
      bulkCreateModal.folderType &&
      bulkCreateModal.folderName &&
      bulkCreateModal.quantity > 0
    ) {
      const key = `${bulkCreateModal.ideaNicheId}-${bulkCreateModal.folderType}`
      const currentPosts = posts[key] || []
      const newPosts = Array.from({ length: bulkCreateModal.quantity }, (_, i) => {
        const postNumber = currentPosts.length + i + 1
        const now = new Date()
        const formattedDateTime = now.toISOString()
        return {
          id: Date.now().toString() + i,
          postNumber,
          caption: `Draft ${postNumber}`, // Auto-generate unique caption for each post
          mediaFiles: [], // Empty media files for each post
          status: "draft",
          statusChangedAt: null, // Will be set when status changes
          createdAt: formattedDateTime,
          createdBy: {
            fullName: "Current User",
            department: "Content Team"
          },
          updatedAt: null, // Will be set when status changes
        }
      })

      setPosts((prev) => ({
        ...prev,
        [key]: [...currentPosts, ...newPosts],
      }))

      // Update viewPostsModal to reflect the new posts if it's open for the same folder
      if (
        viewPostsModal.isOpen &&
        viewPostsModal.ideaNicheId === bulkCreateModal.ideaNicheId &&
        viewPostsModal.folderType === bulkCreateModal.folderType
      ) {
        setViewPostsModal((prev) => ({
          ...prev,
          posts: [...prev.posts, ...newPosts],
        }))
      }

      setBulkCreateModal({
        isOpen: false,
        ideaNicheId: null,
        folderType: null,
        folderName: null,
        quantity: 5,
      })
    }
  }

  // State for showing all media files in the post detail view
  const [showAllMedia, setShowAllMedia] = useState({})

  // Assignment Handlers
  const handleViewAssignments = (folderId, folderName) => {
    const folder = ideaNiches.find(f => f.id === folderId)
    setViewAssignmentsModal({
      isOpen: true,
      folderId,
      folderName,
      assignments: folder?.assignedManagers || []
    })
  }

  const handleDeleteAssignment = (folderId, assignmentId) => {
    setIdeaNiches(prev => prev.map(folder =>
      folder.id === folderId
        ? {
          ...folder,
          assignedManagers: folder.assignedManagers.filter(a => a.id !== assignmentId)
        }
        : folder
    ))

    // Update modal state
    setViewAssignmentsModal(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== assignmentId)
    }))
  }

  const handleOpenBulkAssign = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one folder to assign")
      return
    }
    setBulkAssignModal({
      isOpen: true,
      selectedFolderIds: selectedIds
    })
  }

  const handleBulkAssign = (assignmentData) => {
    const newAssignment = {
      id: `assign_${Date.now()}`,
      department: assignmentData.department,
      leaderTeam: assignmentData.leaderTeam,
      member: assignmentData.member,
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: "Current User"
    }

    setIdeaNiches(prev => prev.map(folder =>
      bulkAssignModal.selectedFolderIds.includes(folder.id)
        ? {
          ...folder,
          assignedManagers: [...(folder.assignedManagers || []), newAssignment]
        }
        : folder
    ))

    setBulkAssignModal({ isOpen: false, selectedFolderIds: [] })
    setSelectedIds([]) // Clear selection after bulk assign
  }

  // ADDED: Handler to open Bulk Create modal


  // FIX: Declare handleOpenCreatePost as it was undeclared.
  // This function seems to be intended to open the main create modal.
  // Assuming it should be the same as setIsCreateModalOpen(true)

  const handleUpdateCreatePostData = (updates) => {
    setCreatePostModal((prev) => ({
      ...prev,
      ...updates
    }))
  }

  const handleOpenCreatePost = (ideaNicheId, folderType, folderName) => {
    setCreatePostModal({
      isOpen: true,
      ideaNicheId,
      folderType,
      folderName,
      caption: "",
      mediaFiles: [],
      uploadProgress: 0,
      isUploading: false,
    })
  }

  // FIX: Declare handleViewMediaUpload as it was undeclared.
  // This function should handle uploading media files to an existing post in the view modal.

  const handleUpdatePostInView = (postId, updates) => {
    const key = `${viewPostsModal.ideaNicheId}-${viewPostsModal.folderType}`
    const folderType = viewPostsModal.folderType
    const ideaNicheId = viewPostsModal.ideaNicheId
    const currentPosts = posts[key] || []

    // Check if status is being updated
    if (updates.status !== undefined) {
      const post = currentPosts.find(p => p.id === postId)
      const oldStatus = post?.status
      const newStatus = updates.status

      // Calculate old "Use" count before change
      const oldUseCount = currentPosts.filter(p => p.status === "Use").length

      // Calculate new "Use" count after change
      const wasUse = oldStatus === "Use"
      const willBeUse = newStatus === "Use"
      const newUseCount = oldUseCount + (willBeUse ? 1 : 0) - (wasUse ? 1 : 0)

      // Determine if folder status changes (Start <-> Stop)
      const oldFolderStatus = oldUseCount >= 1 ? "Start" : "Stop"
      const newFolderStatus = newUseCount >= 1 ? "Start" : "Stop"
      const folderStatusChanged = oldFolderStatus !== newFolderStatus

      // Update per-card timestamp if folder status changed
      if (folderStatusChanged) {
        const formattedDateTime = new Date().toLocaleDateString("en-GB", {
          day: "2-digit", month: "2-digit", year: "numeric"
        }) + " " + new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit", minute: "2-digit"
        })

        const timestampField = folderType === "new" ? "newStatusChangedAt"
          : folderType === "reel" ? "reelStatusChangedAt"
            : "squareProductStatusChangedAt"

        setIdeaNiches(prev => prev.map(item =>
          item.id === ideaNicheId
            ? { ...item, [timestampField]: formattedDateTime }
            : item
        ))
      }
    }

    setPosts((prev) => {
      const currentPosts = prev[key] || []
      const updatedPosts = currentPosts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p
      )
      return { ...prev, [key]: updatedPosts }
    })

    setViewPostsModal((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, ...updates } : p
      )
    }))
  }

  const handleViewMediaUpload = (postId, e) => {
    const files = Array.from(e.target.files)
    const key = `${viewPostsModal.ideaNicheId}-${viewPostsModal.folderType}`

    // Find the post to update
    const postIndex = viewPostsModal.posts.findIndex((p) => p.id === postId)
    if (postIndex === -1) return

    const currentPost = viewPostsModal.posts[postIndex]
    const existingFileSignatures = currentPost.mediaFiles.map(
      (m) => `${m.file ? m.file.name + "-" + m.file.size : m.name + "-" + m.id}`,
    ) // Include ID for existing URLs

    const newFiles = files.filter((file) => {
      const signature = `${file.name}-${file.size}`
      return !existingFileSignatures.includes(signature)
    })

    if (newFiles.length < files.length) {
      const duplicateCount = files.length - newFiles.length
      alert(`${duplicateCount} duplicate file(s) detected and skipped. Each file can only be uploaded once.`)
    }

    if (newFiles.length === 0) return

    const currentMediaCount = currentPost.mediaFiles.length
    const mediaFilesToAdd = newFiles.map((file, index) => ({
      id: Date.now() + Math.random(),
      file, // Keep the file object for upload
      url: URL.createObjectURL(file), // Temporary URL for preview
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      order: currentMediaCount + index + 1,
    }))

    const updatedPosts = viewPostsModal.posts.map((p, idx) => {
      if (idx === postIndex) {
        return {
          ...p,
          mediaFiles: [...p.mediaFiles, ...mediaFilesToAdd].sort((a, b) => a.order - b.order),
        }
      }
      return p
    })

    setPosts((prev) => ({
      ...prev,
      [key]: updatedPosts,
    }))

    setViewPostsModal((prev) => ({
      ...prev,
      posts: updatedPosts,
    }))
  }

  const handleDeletePost = (postId) => {
    const key = `${viewPostsModal.ideaNicheId}-${viewPostsModal.folderType}`
    setPosts((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((p) => p.id !== postId),
    }))
    setViewPostsModal((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    }))
  }

  const handleSavePost = () => {
    if (createPostModal.caption.trim() === "") {
      alert("Please enter a caption")
      return
    }

    const key = `${createPostModal.ideaNicheId}-${createPostModal.folderType}`
    const currentPosts = posts[key] || []
    const postNumber = currentPosts.length + 1

    const newPost = {
      id: Date.now().toString(),
      postNumber,
      caption: createPostModal.caption,
      mediaFiles: createPostModal.mediaFiles,
      status: "draft",
      statusChangedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: {
        fullName: "Current User",
        department: "Content Team"
      },
      updatedAt: new Date().toISOString(),
    }

    setPosts((prev) => ({
      ...prev,
      [key]: [...currentPosts, newPost],
    }))

    setCreatePostModal({
      isOpen: false,
      ideaNicheId: "",
      folderType: "subject",
      folderName: "",
      caption: "",
      mediaFiles: [],
      uploadProgress: 0,
      isUploading: false,
    })
  }

  useEffect(() => {
    console.log("[v0] isCreateModalOpen:", isCreateModalOpen)
  }, [isCreateModalOpen])

  useEffect(() => {
    console.log("[v0] createPostModal.isOpen:", createPostModal.isOpen)
  }, [createPostModal.isOpen])

  useEffect(() => {
    console.log("[v0] viewPostsModal.isOpen:", viewPostsModal.isOpen)
  }, [viewPostsModal.isOpen])

  useEffect(() => {
    console.log("[v0] bulkCreateModal.isOpen:", bulkCreateModal.isOpen)
  }, [bulkCreateModal.isOpen])

  useEffect(() => {
    console.log("[v0] isEditModalOpen:", isEditModalOpen)
  }, [isEditModalOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Manual Content Social</h1>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-6">
        {/* <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {allSocialPlatforms.map((platform) => {
              const isActive = activeTab === platform
              const count = platformStats[platform] || 0

              return (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? "bg-purple-50 border-purple-200 shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className={`text-3xl ${isActive ? "scale-110" : ""} transition-transform`}>
                    {socialPlatforms[platform]?.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {socialPlatforms[platform]?.name}
                  </span>
                  <div className="bg-black text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                    {count}
                  </div>
                </button>
              )
            })}
          </div>
        </div> */}

        {/* Social Platform Cards */}
        <div className="w-full mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {allSocialPlatforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all duration-200 ${activeTab === platform
                    ? "bg-blue-50 border-blue-500 shadow-md"
                    : "bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                >
                  <span className="text-3xl">{socialPlatforms[platform]?.icon}</span>
                  <span
                    className={`text-xs font-semibold text-center ${activeTab === platform ? "text-slate-900" : "text-slate-700"
                      }`}
                  >
                    {socialPlatforms[platform]?.name}
                  </span>
                  <div
                    className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold ${activeTab === platform ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                      }`}
                  >
                    {formatCount(platformStats[platform] || 0)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content for selected platform */}
          {allSocialPlatforms.map(
            (platform) => activeTab === platform && <div key={platform}>{renderPlatformContent(platform)}</div>,
          )}
        </div>

        {/* Old Tabs component removed, replaced by the card-based design above */}
        {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 bg-white border-2 border-gray-400 rounded-xl p-3 flex gap-4 overflow-x-auto shadow-sm">
            {allSocialPlatforms.map((platform) => (
              <TabsTrigger
                key={platform}
                value={platform}
                className="capitalize text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center justify-center gap-1 whitespace-nowrap flex-shrink-0 border-2 border-gray-300"
              >
                <span className="text-lg">{socialPlatforms[platform]?.icon}</span>
                <span className="hidden sm:inline text-center">{socialPlatforms[platform]?.name}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs bg-[#91bfb4] text-white"
                >
                  {formatCount(platformStats[platform] || 0)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {allSocialPlatforms.map((platform) => (
            <TabsContent key={platform} value={platform}>
              {renderPlatformContent(platform)}
            </TabsContent>
          ))}
        </Tabs> */}
      </div>{" "}
      {/* Close p-6 div BEFORE dialogs to prevent stacking context issues */}
      {/* ALL DIALOGS MOVED OUTSIDE p-6 CONTAINER FOR PROPER Z-INDEX STACKING */}
      {/* Create Modal */}
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCreateItem}
        activeTab={activeTab}
        ideaNiches={ideaNiches}
      />
      {/* Edit Modal */}
      <EditFolderModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        item={editingItem}
        onSave={handleUpdateItem}
        ideaNiches={ideaNiches}
      />
      <CreatePostModal
        isOpen={createPostModal.isOpen}
        onOpenChange={(open) => !open && setCreatePostModal({ ...createPostModal, isOpen: false })}
        data={createPostModal}
        onUpdateData={handleUpdateCreatePostData}
        onSave={handleSavePost}
        posts={posts}
      />
      <ViewPostsModal
        isOpen={viewPostsModal.isOpen}
        onOpenChange={(open) => setViewPostsModal({ ...viewPostsModal, isOpen: open })}
        data={viewPostsModal}
        onUpdatePosts={handleUpdatePostInView}
        onDeleteRequest={(type, postId, postNumber, position) =>
          setDeleteConfirmation({ isOpen: true, type, postId, postNumber, position })
        }
        onUploadMedia={handleViewMediaUpload}
      />
      <BulkCreateModal
        isOpen={bulkCreateModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkCreateModal({
              isOpen: false,
              ideaNicheId: null,
              folderType: null,
              folderName: null,
              quantity: 5,
            })
          }
        }}
        data={bulkCreateModal}
        onUpdateData={handleUpdateBulkData}
        onCreate={handleBulkCreatePosts}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmation({ isOpen: false, type: null, postId: null, position: null, postNumber: null })
          }
        }}
        data={deleteConfirmation}
        selectedCount={selectedIds.length}
        onConfirm={() => {
          handleConfirmDeleteAction()
        }}
        onCancel={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
      />

      {/* View Assignments Modal */}
      <ViewAssignmentsModal
        isOpen={viewAssignmentsModal.isOpen}
        onClose={() => setViewAssignmentsModal({ isOpen: false, folderId: "", folderName: "", assignments: [] })}
        folderName={viewAssignmentsModal.folderName}
        folderId={viewAssignmentsModal.folderId}
        assignments={viewAssignmentsModal.assignments}
        onDeleteAssignment={handleDeleteAssignment}
      />

      {/* Bulk Assign Modal */}
      <BulkAssignModal
        isOpen={bulkAssignModal.isOpen}
        onClose={() => setBulkAssignModal({ isOpen: false, selectedFolderIds: [] })}
        selectedFolders={ideaNiches.filter(f => bulkAssignModal.selectedFolderIds.includes(f.id))}
        onAssign={handleBulkAssign}
      />
    </div>
  )
}
