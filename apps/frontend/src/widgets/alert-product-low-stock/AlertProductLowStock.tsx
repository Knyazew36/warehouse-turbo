import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useProducts } from '@/entitites/product/api/product.api'
import { formatNumber } from '@/shared/utils/formatNumber'
import { LucideMailWarning } from 'lucide-react'

const AlertProductLowStock = () => {
  const { data = [], isLoading } = useProducts(true)
  const lowStockProducts = data.filter(p => +p.quantity < +p.minThreshold)

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
            <span className='font-medium'>{p.name}</span> остаток: {formatNumber(+p.quantity)} {p.unit} (минимум:{' '}
            {formatNumber(+p.minThreshold)} {p.unit})
          </div>
        ))}
      </AlertDescription>
    </Alert>
  )
}

export default AlertProductLowStock
