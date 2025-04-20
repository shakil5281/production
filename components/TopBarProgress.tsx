'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export default function TopBarProgress() {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current !== pathname) {
      NProgress.start()
      previousPath.current = pathname
      setTimeout(() => {
        NProgress.done()
      }, 300) // Small delay to show animation
    }
  }, [pathname])

  return null
}
