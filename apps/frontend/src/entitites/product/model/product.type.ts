export interface Product {
  id: number
  name: string
  quantity: number
  minThreshold: number
  unit: string | null
  category: string | null
  createdAt: Date
  updatedAt: Date
  active: boolean
}
