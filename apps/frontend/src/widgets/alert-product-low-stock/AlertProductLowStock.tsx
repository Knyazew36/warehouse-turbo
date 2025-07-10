import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useProducts } from '@/entitites/product/api/product.api'
import { LucideMailWarning } from 'lucide-react'
import { Link } from 'react-router-dom'

const AlertProductLowStock = () => {
  const { data = [], isLoading } = useProducts(true)

  const lowStockProducts = data.filter(p => p.quantity < p.minThreshold)
  if (lowStockProducts.length === 0 || isLoading) return null

  return (
    <Alert
      variant='destructive'
      className='mt-4 border-red-400 bg-transparent'
    >
      <LucideMailWarning />
      <AlertTitle>Внимание! На складе заканчивается:</AlertTitle>
      <AlertDescription>
        {lowStockProducts.map(p => (
          <div key={p.id}>
            <span className='font-medium'>{p.name}</span>: {p.quantity} (минимум: {p.minThreshold})
          </div>
        ))}
      </AlertDescription>
    </Alert>

    // <Link
    //   to='/products'
    //   className='mt-4 p-1 w-full space-y-1'
    // >
    //   <div
    //     className='py-0.5 px-1 relative size-full flex text-start border-s-4 border-red-600 bg-red-100 text-red-800 text-xs rounded-sm focus:bg-red-200 focus:shadow-2xs dark:bg-neutral-800 dark:before:absolute dark:before:inset-0 dark:before:bg-red-800/10 dark:before:rounded-e dark:focus:before:bg-red-800/30 dark:text-red-500'
    //     data-hs-overlay='#hs-pro-clee'
    //   >
    //     <span className='block truncate'>
    //       <span className='block font-semibold truncate'>Внимание! На складе заканчивается:</span>
    //       {lowStockProducts.map(p => (
    //         <div
    //           key={p.id}
    //           className='flex '
    //         >
    //           <span className='block truncate'>{p.name}</span>: {p.quantity} (минимум: {p.minThreshold})
    //         </div>
    //       ))}
    //       {/* <span className='block truncate'>9AM - 10PM</span> */}
    //     </span>
    //   </div>
    // </Link>
  )
}

export default AlertProductLowStock
