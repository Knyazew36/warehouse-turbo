import React, { FC } from 'react'

interface IEmpty {
  title: string
  description?: string
}

const Empty: FC<IEmpty> = ({ title = 'Не найдено', description }) => {
  return (
    // <div className='p-5 flex flex-col justify-center items-center text-center'>
    //   <svg
    //     className='w-48 mx-auto mb-4'
    //     width={178}
    //     height={90}
    //     viewBox='0 0 178 90'
    //     fill='none'
    //     xmlns='http://www.w3.org/2000/svg'
    //   >
    //     <rect
    //       x={27}
    //       y='50.5'
    //       width={124}
    //       height={39}
    //       rx='7.5'
    //       fill='currentColor'
    //       className='fill-white dark:fill-neutral-800'
    //     />
    //     <rect
    //       x={27}
    //       y='50.5'
    //       width={124}
    //       height={39}
    //       rx='7.5'
    //       stroke='currentColor'
    //       className='stroke-gray-50 dark:stroke-neutral-700/10'
    //     />
    //     <rect
    //       x='34.5'
    //       y={58}
    //       width={24}
    //       height={24}
    //       rx={4}
    //       fill='currentColor'
    //       className='fill-gray-50 dark:fill-neutral-700/30'
    //     />
    //     <rect
    //       x='66.5'
    //       y={61}
    //       width={60}
    //       height={6}
    //       rx={3}
    //       fill='currentColor'
    //       className='fill-gray-50 dark:fill-neutral-700/30'
    //     />
    //     <rect
    //       x='66.5'
    //       y={73}
    //       width={77}
    //       height={6}
    //       rx={3}
    //       fill='currentColor'
    //       className='fill-gray-50 dark:fill-neutral-700/30'
    //     />
    //     <rect
    //       x='19.5'
    //       y='28.5'
    //       width={139}
    //       height={39}
    //       rx='7.5'
    //       fill='currentColor'
    //       className='fill-white dark:fill-neutral-800'
    //     />
    //     <rect
    //       x='19.5'
    //       y='28.5'
    //       width={139}
    //       height={39}
    //       rx='7.5'
    //       stroke='currentColor'
    //       className='stroke-gray-100 dark:stroke-neutral-700/30'
    //     />
    //     <rect
    //       x={27}
    //       y={36}
    //       width={24}
    //       height={24}
    //       rx={4}
    //       fill='currentColor'
    //       className='fill-gray-100 dark:fill-neutral-700/70'
    //     />
    //     <rect
    //       x={59}
    //       y={39}
    //       width={60}
    //       height={6}
    //       rx={3}
    //       fill='currentColor'
    //       className='fill-gray-100 dark:fill-neutral-700/70'
    //     />
    //     <rect
    //       x={59}
    //       y={51}
    //       width={92}
    //       height={6}
    //       rx={3}
    //       fill='currentColor'
    //       className='fill-gray-100 dark:fill-neutral-700/70'
    //     />
    //     <g filter='url(#filter19)'>
    //       <rect
    //         x={12}
    //         y={6}
    //         width={154}
    //         height={40}
    //         rx={8}
    //         fill='currentColor'
    //         className='fill-white dark:fill-neutral-800'
    //         shapeRendering='crispEdges'
    //       />
    //       <rect
    //         x='12.5'
    //         y='6.5'
    //         width={153}
    //         height={39}
    //         rx='7.5'
    //         stroke='currentColor'
    //         className='stroke-gray-100 dark:stroke-neutral-700/60'
    //         shapeRendering='crispEdges'
    //       />
    //       <rect
    //         x={20}
    //         y={14}
    //         width={24}
    //         height={24}
    //         rx={4}
    //         fill='currentColor'
    //         className='fill-gray-200 dark:fill-neutral-700 '
    //       />
    //       <rect
    //         x={52}
    //         y={17}
    //         width={60}
    //         height={6}
    //         rx={3}
    //         fill='currentColor'
    //         className='fill-gray-200 dark:fill-neutral-700'
    //       />
    //       <rect
    //         x={52}
    //         y={29}
    //         width={106}
    //         height={6}
    //         rx={3}
    //         fill='currentColor'
    //         className='fill-gray-200 dark:fill-neutral-700'
    //       />
    //     </g>
    //     <defs>
    //       <filter
    //         id='filter19'
    //         x={0}
    //         y={0}
    //         width={178}
    //         height={64}
    //         filterUnits='userSpaceOnUse'
    //         colorInterpolationFilters='sRGB'
    //       >
    //         <feFlood
    //           floodOpacity={0}
    //           result='BackgroundImageFix'
    //         />
    //         <feColorMatrix
    //           in='SourceAlpha'
    //           type='matrix'
    //           values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
    //           result='hardAlpha'
    //         />
    //         <feOffset dy={6} />
    //         <feGaussianBlur stdDeviation={6} />
    //         <feComposite
    //           in2='hardAlpha'
    //           operator='out'
    //         />
    //         <feColorMatrix
    //           type='matrix'
    //           values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0'
    //         />
    //         <feBlend
    //           mode='normal'
    //           in2='BackgroundImageFix'
    //           result='effect1_dropShadow_1187_14810'
    //         />
    //         <feBlend
    //           mode='normal'
    //           in='SourceGraphic'
    //           in2='effect1_dropShadow_1187_14810'
    //           result='shape'
    //         />
    //       </filter>
    //     </defs>
    //   </svg>
    <div className='max-w-sm mx-auto'>
      <p className='mt-2 font-medium text-gray-800 dark:text-neutral-200'>{title}</p>
      {description && <p className='mb-5 text-sm text-gray-500 dark:text-neutral-500'>{description}</p>}
    </div>
    // {/* </div> */}
  )
}

export default Empty
