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
  id: string
  author: string
  date: string
  body: string
}

export interface Share {
  // This is a placeholder
  shareHash: never
}

export interface Reaction {
  symbol: string
  count: number
}
