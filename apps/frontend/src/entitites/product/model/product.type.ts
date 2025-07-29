export interface Product {
  id: number
  name: string
  quantity: string
  minThreshold: string
  unit: string | null
  category: string | null
  createdAt: Date
  updatedAt: Date
  active: boolean
  organizationId: number
}
