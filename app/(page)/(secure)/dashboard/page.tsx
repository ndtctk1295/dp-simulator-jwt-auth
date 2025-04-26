

import { PieChartComponents } from '@/app/_components/chart/Piechart'
import OverviewHomepageComp from './components/OverviewHomepage'

export default function DashboardPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
        <OverviewHomepageComp />
      </div>
      <div>
        <PieChartComponents />   
      </div>
    </main>
  )
}
