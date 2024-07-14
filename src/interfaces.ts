// todo: refactor to smaller interfaces and mark optional fields
export interface DataEntry {
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  address: string
  hours: {
    open: string
    close: string
  }[]
  gmaps: string
  menu: {
    name: string
    price: number
  }[]
  mediaUrl: string[]
  reviews: {
    name: string
    rating: number
    comment: string
  }[]
  tags: string[]
  medianRating: number
  numberOfRatings: number
}