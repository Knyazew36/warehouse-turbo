import { create } from 'zustand'
import { IUserOrganization } from '../model/organization.type'

interface OrganizationStore {
  currentOrganization: IUserOrganization | null
  setCurrentOrganization: (organization: IUserOrganization | null) => void
  clearCurrentOrganization: () => void
}

export const useOrganizationStore = create<OrganizationStore>(set => ({
  currentOrganization: null,
  setCurrentOrganization: organization => set({ currentOrganization: organization }),
  clearCurrentOrganization: () => set({ currentOrganization: null })
}))
