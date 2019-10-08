export interface Post {
  groupHash: string
  postHash: string
  block: string
  lastModified: string
  author: string
  content: any
  comments: Comment[]
  shares: Share[]
  reactions: Reaction[]
}

export interface Comment {
  // This is a placeholder
  commentHash: never
}

export interface Share {
  // This is a placeholder
  shareHash: never
}

export interface Reaction {
  // This is a placeholder
  reactionHash: never
}
