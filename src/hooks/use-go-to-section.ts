import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToPageSection } from '@/lib/page-scroll'
import {
  AIRCO_TOPIC,
  getTopicFromPath,
  topicSectionPath,
} from '@/lib/topics'

export function useGoToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const topic = getTopicFromPath(pathname) ?? AIRCO_TOPIC

  return useCallback(
    (section: string) => {
      const path = topicSectionPath(topic, section)
      if (pathname === path) {
        scrollToPageSection(section, 'smooth')
        return
      }
      navigate(path)
    },
    [navigate, pathname, topic],
  )
}
