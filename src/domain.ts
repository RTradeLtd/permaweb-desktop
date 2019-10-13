export interface Group {
  groupHash: string
  name: string
}

export interface Post {
  groupHash: string
  postHash: string
  block: string
  lastModified: string
  author: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  comments: Comment[]
  shares: Share[]
  reactions: Reaction[]
}

export interface Comment {
  // This is a placeholder
  commentHash: never
  author: string
  lastModified: string
  content: string
}

export interface Share {
  // This is a placeholder
  shareHash: never
}

export interface Reaction {
  // This is a placeholder
  reactionHash: never
}
