
import { CheckCircle, Lock, Clock } from "lucide-react"

// Social platforms and their usernames
export const socialPlatforms = {
    instagram: {
        icon: "📷",
        name: "Instagram",
    },
    threads: {
        icon: "🧵",
        name: "Threads",
    },
    facebook: {
        icon: "👥",
        name: "Facebook",
    },
    x: {
        icon: "🐦",
        name: "X",
    },
    tiktok: {
        icon: "🎵",
        name: "TikTok",
    },
    pinterest: {
        icon: "📌",
        name: "Pinterest",
    },
    youtube: {
        icon: "📺",
        name: "YouTube",
    },
    linkedin: {
        icon: "💼",
        name: "LinkedIn",
    },
    medium: {
        icon: "✍️",
        name: "Medium",
    },
    reddit: {
        icon: "🤖",
        name: "Reddit",
    },
    tumblr: {
        icon: "🎨",
        name: "Tumblr",
    },
    quora: {
        icon: "❓",
        name: "Quora",
    },
}

// Platform colors and icons
export const platformConfig = {
    instagram: {
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        textColor: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: "📷",
        name: "Instagram",
    },
    threads: {
        color: "bg-black",
        textColor: "text-gray-800",
        bgColor: "bg-gray-50",
        icon: "🧵",
        name: "Threads",
    },
    facebook: {
        color: "bg-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: "👥",
        name: "Facebook",
    },
    x: {
        color: "bg-black",
        textColor: "text-gray-800",
        bgColor: "bg-gray-50",
        icon: "🐦",
        name: "X",
    },
    tiktok: {
        color: "bg-black",
        textColor: "text-gray-800",
        bgColor: "bg-gray-50",
        icon: "🎵",
        name: "TikTok",
    },
    youtube: {
        color: "bg-red-600",
        textColor: "text-red-600",
        bgColor: "bg-red-50",
        icon: "📺",
        name: "YouTube",
    },
    linkedin: {
        color: "bg-blue-700",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        icon: "💼",
        name: "LinkedIn",
    },
    pinterest: {
        color: "bg-red-500",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        icon: "📌",
        name: "Pinterest",
    },
    medium: {
        color: "bg-gray-800",
        textColor: "text-gray-800",
        bgColor: "bg-gray-50",
        icon: "✍️",
        name: "Medium",
    },
    reddit: {
        color: "bg-orange-500",
        textColor: "text-orange-500",
        bgColor: "bg-orange-50",
        icon: "🤖",
        name: "Reddit",
    },
    tumblr: {
        color: "bg-indigo-600",
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        icon: "🎨",
        name: "Tumblr",
    },
    quora: {
        color: "bg-red-700",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        icon: "❓",
        name: "Quora",
    },
}

// Status configuration
export const statusConfig = {
    Active: {
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        icon: CheckCircle,
        name: "Active",
    },
    Locker: {
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        icon: Lock,
        name: "Locker",
    },
    Pending: {
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        icon: Clock,
        name: "Pending",
    },
}

// Auto-sync data based on idea and niche combinations
export const autoSyncData = {
    "Wild Cats": {
        "African Safari": {
            type: "NTM",
            department: "Wildlife Department",
            team: "Safari Team",
            leader: "Wildlife Photography",
        },
        "Asian Tigers": {
            type: "TM",
            department: "Conservation Department",
            team: "Tiger Protection",
            leader: "Tiger Research",
        },
        "Mountain Lions": {
            type: "NTM",
            department: "Mountain Department",
            team: "Predator Team",
            leader: "Mountain Wildlife",
        },
    },
    "Ocean Mammals": {
        "Deep Sea Giants": {
            type: "TM",
            department: "Marine Department",
            team: "Deep Sea Research",
            leader: "Marine Biology",
        },
        "Coastal Dolphins": {
            type: "NTM",
            department: "Coastal Department",
            team: "Dolphin Study",
            leader: "Dolphin Behavior",
        },
        "Arctic Seals": {
            type: "TM",
            department: "Arctic Department",
            team: "Seal Conservation",
            leader: "Arctic Marine Life",
        },
    },
    "Forest Animals": {
        "Woodland Creatures": {
            type: "NTM",
            department: "Forest Department",
            team: "Woodland Team",
            leader: "Nature Documentary",
        },
        "Rainforest Species": {
            type: "TM",
            department: "Tropical Department",
            team: "Rainforest Research",
            leader: "Biodiversity Study",
        },
        "Mountain Wildlife": {
            type: "NTM",
            department: "Mountain Department",
            team: "Alpine Team",
            leader: "Mountain Ecology",
        },
    },
    "Arctic Animals": {
        "Polar Bears": {
            type: "TM",
            department: "Arctic Department",
            team: "Polar Research",
            leader: "Polar Bear Study",
        },
        "Arctic Foxes": {
            type: "NTM",
            department: "Arctic Department",
            team: "Fox Team",
            leader: "Arctic Adaptation",
        },
        Penguins: {
            type: "TM",
            department: "Antarctic Department",
            team: "Penguin Colony",
            leader: "Penguin Behavior",
        },
    },
    "Desert Animals": {
        Camels: {
            type: "NTM",
            department: "Desert Department",
            team: "Camel Team",
            leader: "Desert Adaptation",
        },
        "Desert Reptiles": {
            type: "TM",
            department: "Reptile Department",
            team: "Desert Reptile",
            leader: "Reptile Research",
        },
        "Nocturnal Hunters": {
            type: "NTM",
            department: "Desert Department",
            team: "Night Team",
            leader: "Nocturnal Study",
        },
    },
    "Tropical Birds": {
        Parrots: {
            type: "TM",
            department: "Avian Department",
            team: "Parrot Team",
            leader: "Parrot Behavior",
        },
        Hummingbirds: {
            type: "NTM",
            department: "Avian Department",
            team: "Hummingbird Study",
            leader: "Flight Mechanics",
        },
        "Birds of Paradise": {
            type: "TM",
            department: "Tropical Department",
            team: "Paradise Team",
            leader: "Mating Displays",
        },
    },
    Reptiles: {
        Snakes: { type: "TM", department: "Reptile Department", team: "Snake Team", leader: "Venom Research" },
        Lizards: {
            type: "NTM",
            department: "Reptile Department",
            team: "Lizard Study",
            leader: "Thermoregulation",
        },
        Turtles: {
            type: "TM",
            department: "Marine Department",
            team: "Turtle Conservation",
            leader: "Sea Turtle Migration",
        },
    },
    "Farm Animals": {
        Cattle: {
            type: "NTM",
            department: "Agriculture Department",
            team: "Livestock Team",
            leader: "Cattle Management",
        },
        Poultry: {
            type: "TM",
            department: "Agriculture Department",
            team: "Poultry Team",
            leader: "Egg Production",
        },
        "Sheep & Goats": {
            type: "NTM",
            department: "Agriculture Department",
            team: "Small Livestock",
            leader: "Wool & Milk",
        },
    },
    Insects: {
        Butterflies: {
            type: "TM",
            department: "Entomology Department",
            team: "Butterfly Team",
            leader: "Pollination Study",
        },
        Beetles: {
            type: "NTM",
            department: "Entomology Department",
            team: "Beetle Research",
            leader: "Decomposition",
        },
        Bees: {
            type: "TM",
            department: "Entomology Department",
            team: "Bee Conservation",
            leader: "Hive Management",
        },
    },
    Primates: {
        "Great Apes": {
            type: "TM",
            department: "Primate Department",
            team: "Ape Research",
            leader: "Cognitive Studies",
        },
        Monkeys: {
            type: "NTM",
            department: "Primate Department",
            team: "Monkey Team",
            leader: "Social Behavior",
        },
        Lemurs: {
            type: "TM",
            department: "Madagascar Department",
            team: "Lemur Conservation",
            leader: "Endemic Species",
        },
    },
}

export const models = ["Google.Labs", "Freepik"]

export const ideas = [
    "Wild Cats",
    "Ocean Mammals",
    "Forest Animals",
    "Arctic Animals",
    "Desert Animals",
    "Tropical Birds",
    "Reptiles",
    "Farm Animals",
    "Insects",
    "Primates",
]

export const nichesByIdea = {
    "Wild Cats": ["African Safari", "Asian Tigers", "Mountain Lions"],
    "Ocean Mammals": ["Deep Sea Giants", "Coastal Dolphins", "Arctic Seals"],
    "Forest Animals": ["Woodland Creatures", "Rainforest Species", "Mountain Wildlife"],
    "Arctic Animals": ["Polar Bears", "Arctic Foxes", "Penguins"],
    "Desert Animals": ["Camels", "Desert Reptiles", "Nocturnal Hunters"],
    "Tropical Birds": ["Parrots", "Hummingbirds", "Birds of Paradise"],
    Reptiles: ["Snakes", "Lizards", "Turtles"],
    "Farm Animals": ["Cattle", "Poultry", "Sheep & Goats"],
    Insects: ["Butterflies", "Beetles", "Bees"],
    Primates: ["Great Apes", "Monkeys", "Lemurs"],
}

export const groupMockData = {
    instagram: ["Wildlife Influencers", "Nature Brands", "Eco Travelers"],
    threads: ["Science Discuss", "Nature Threads", "Eco News"],
    facebook: ["Wildlife Photography Group", "Nature Lovers Community"],
    x: ["Wild News Network", "Conservation Alerts"],
    tiktok: ["Nature Shorts Team", "Animal Clips Crew"],
    youtube: ["Doc Channel Crew", "Safari Vloggers"],
    linkedin: ["Conservation Pros", "Wildlife Scientists"],
    pinterest: ["Nature Moodboards", "Animal Art Curators"],
    medium: ["Wild Writers", "Eco Bloggers"],
    reddit: ["Subreddit Mods", "Nature Enthusiasts"],
    tumblr: ["Nature Aesthetics", "Wild Art Blogs"],
    quora: ["Wildlife Experts", "Nature Guides"],
}

export const usernamesByGroup = {
    "Wildlife Influencers": ["@wildlife_explorer", "@nature_shots", "@animal_kingdom"],
    "Nature Brands": ["@wildlife_brand_1", "@nature_co", "@eco_products"],
    "Eco Travelers": ["@eco_adventurer", "@travel_nature", "@wild_journeys"],
    "Science Discuss": ["@science_hub", "@research_talk", "@knowledge_share"],
    "Nature Threads": ["@nature_stories_app", "@threads_nature", "@eco_updates"],
    "Eco News": ["@eco_news_feed", "@green_planet_news"],
    "Wildlife Photography Group": ["@wildlife_photography_community", "@nature_photo_club"],
    "Nature Lovers Community": ["@nature_lovers_united", "@passion_for_nature"],
    "Wild News Network": ["@wildlife_news_x", "@animal_updates_now"],
    "Conservation Alerts": ["@save_our_planet", "@eco_alerts_x"],
    "Nature Shorts Team": ["@nature_shorts_official", "@wildlife_clips_team"],
    "Animal Clips Crew": ["@animal_clips_daily", "@creature_features"],
    "Doc Channel Crew": ["@documentary_crew", "@nature_docs_channel"],
    "Safari Vloggers": ["@safari_vlogger_1", "@wildlife_adventures_yt"],
    "Conservation Pros": ["@conservation_experts_li", "@wildlife_professionals"],
    "Wildlife Scientists": ["@wildlife_science_lab", "@researchers_wildlife"],
    "Nature Moodboards": ["@nature_inspiration_boards", "@aesthetic_nature"],
    "Animal Art Curators": ["@animal_art_gallery", "@wildlife_artwork"],
    "Wild Writers": ["@wildlife_storytellers", "@nature_writers_connect"],
    "Eco Bloggers": ["@eco_conscious_blog", "@sustainable_living_blog"],
    "Subreddit Mods": ["r/wildlife_mods", "r/naturephotography_mods"],
    "Nature Enthusiasts": ["r/nature_lovers", "r/wildlife_fans"],
    "Nature Aesthetics": ["@nature_aesthetics_tmblr", "@serene_vibes"],
    "Wild Art Blogs": ["@wildart_gallery_tmblr", "@creative_nature"],
    "Wildlife Experts": ["@wildlife_expert_quora", "@ask_wildlife_expert"],
    "Nature Guides": ["@nature_guide_quora", "@outdoor_adventures_guide"],
}
