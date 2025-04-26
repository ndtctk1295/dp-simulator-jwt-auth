'use client'

import AccountButton from './account-button'
import BreadcrumbBar from './breadcumb-bar'
import MenuSheet from './menu-sheet'
import NotificationButton from './noti-button'
import SearchBar from './search-bar'
import Sidebar from './side-bar'

const Navbar = () => {
  return (
    <>
      <Sidebar />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <MenuSheet />
          <BreadcrumbBar />
          <div className='flex-grow'></div>
          {/* <SearchBar /> */}
          <NotificationButton />
          <AccountButton />
        </header>
      </div>
    </>
  )
}

export default Navbar
