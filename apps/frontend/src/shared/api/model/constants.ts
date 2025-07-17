export const apiDomainAccountDev = 'http://localhost:4000/api'
// export const apiDomainAccountProd = 'https://front-test.devmill.ru/api'
export const apiDomainAccountProd = 'http://5278831-ad07030.twc1.net/api'
// export const apiDomainAccountProd = 'https://big-grain-nest.vercel.app/api'
export const apiDomain = import.meta.env.DEV ? `${apiDomainAccountDev}` : `${apiDomainAccountProd}`
// export const apiDomain = `${apiDomainAccountProd}`
// export const apiDomain = `${apiDomainAccountProd}`
// export const apiDomainFile = `${apiDomainAccount}`
