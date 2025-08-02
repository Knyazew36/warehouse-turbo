import { Product } from '@/entitites/product/model/product.type'

export interface Category {
  id: number
  name: string
  description: string
  color: string
  icon: string
}

export interface GetCategoryWithProducts {
  categories: Category[]
  productsWithoutCategory: Product[]
}

export interface CategoryWithProducts {
  categories: {
    id: number
    name: string
    description: string
    color: string
    icon: string
    active: boolean
    createdAt: string
    updatedAt: string
    products: Product[]
  }[]
}

export type CreateCategoryDto = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateCategoryDto = Partial<CreateCategoryDto>
