export interface GmapsPlace {
  name: string
  gmaps: string
  tags: string[]
  medianRating: number
  numberOfRatings: number
  mediaUrl: string[]
  location: {
    lat: number
    lng: number
  }
}