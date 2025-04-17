import React from 'react'
import { Outlet } from 'react-router-dom'

const WebsiteContents = () => {
  return (
    <>
      {/* Main content */}
      <Outlet />
    </>
  )
}

export default WebsiteContents
