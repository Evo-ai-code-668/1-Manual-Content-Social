
export type SocialPlatform =
    | "instagram"
    | "threads"
    | "facebook"
    | "x"
    | "tiktok"
    | "pinterest"
    | "youtube"
    | "linkedin"
    | "medium"
    | "reddit"
    | "tumblr"
    | "quora"

export type PostStatus = "draft" | "posted" | "scheduled" | "error" | "use" | "posting error"

export type FolderStatus = "Active" | "Locker" | "Pending"

export type ContentStatus = "Start" | "Stop"

export type SocialAccountStatus = "Available New" | "InUseDevice" | "Dead" | "Checkpoint" | "Banned"

export type IdeaType = "NTM" | "TM"

export interface MediaFile {
    id: string
    url: string
    name: string
    type: "image" | "video"
    order: number
    file?: File // Optional, present during upload
}

export interface Post {
    id: string
    postNumber: number
    caption: string
    mediaFiles: MediaFile[]
    status: PostStatus
    statusChangedAt?: string
    createdAt: string
    createdBy: string
    updatedAt: string
    scheduledDate?: string
}

export interface ImageItem {
    id: string
    name: string
    url: string
}

export interface FolderImages {
    subject: ImageItem[]
    scene: ImageItem[]
    style: ImageItem[]
}

export interface IdeaNiche {
    id: string
    folderName: string
    model: string

    // Social Account Info
    accountSocial: SocialPlatform
    usernameSocial: string
    groupAccountSocial: string
    statusAccountSocial: SocialAccountStatus
    loginAppClone: "Active" | "Dead" | "N/A" | "NetworkError" | "Checkpoint"

    // Content Config
    statusContentFolder: ContentStatus
    statusNewSquare: ContentStatus
    statusReelVertical: ContentStatus
    statusSquareProduct: ContentStatus

    // Idea & Niche
    idea: string
    niche: string[]
    type: IdeaType

    // Workflow / Team
    departmentWorks: string
    groupWork: string
    userWorks: string
    status: FolderStatus

    // Audit
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string

    // Content
    images?: FolderImages
}

export interface FilterOptions {
    model: string
    departmentWorks: string
    groupWork: string
    userWorks: string
    idea: string
    niche: string
    status: string
    updatedBy: string
    departments: string
    teams: string
    leader: string
    createdBy: string
    contentFolder: string
    niches: string
    usernameAccount: string
    statusAccount: string
    loginAppClone: string
    startContent: string
    stopContent: string
    newDaily: string
    newWeekly: string
    newMonthly: string
    newQuarterly: string
    newYearly: string
    newSquare: string
    statusNewSquare: string
    reelVertical: string
    statusReelVertical: string
    squareProduct: string
    statusSquareProduct: string
    totalDraft: string
    totalUse: string
    totalPosted: string
    totalError: string
    typeTM: string
    typeNTM: string
}

export interface SocialPlatformConfig {
    color: string
    textColor: string
    bgColor: string
    icon: string
    name: string
}

export interface StatusConfigItem {
    color: string
    textColor: string
    bgColor: string
    icon: any // Luciano Icon component
    name: string
}
