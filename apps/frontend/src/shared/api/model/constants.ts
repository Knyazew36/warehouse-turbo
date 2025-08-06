// export const apiDomainAccountDev = 'http://localhost:4001/api'
export const apiDomainAccountDev = 'https://test.5278831-ad07030.twc1.net/api/api'

export const apiDomainAccountProd = 'https://5278831-ad07030.twc1.net/api/api'
// export const apiDomainAccountProd = 'https://big-grain-nest.vercel.app/api'
export const apiDomain = import.meta.env.DEV ? `${apiDomainAccountDev}` : `${apiDomainAccountProd}`
