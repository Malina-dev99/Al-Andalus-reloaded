import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState } from 'react'
import s from './intro.module.scss'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isMobile) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
      return
    }

    if (!scroll) {
      document.documentElement.classList.toggle('intro', true)
    }

    if (!lenis) return
    if (scroll) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
    } else {
      setTimeout(() => {
        lenis.stop()
      }, 0)

      document.documentElement.classList.toggle('intro', true)
    }
  }, [scroll, lenis, isMobile])

  return (
    <div
      className={cn(s.wrapper, isLoaded && s.out)}
      onTransitionEnd={(e) => {
        e.target.classList.forEach((value) => {
          if (value.includes('out')) {
            setScroll(true)
          }
          if (value.includes('show')) {
            setIntroOut(true)
          }
        })
      }}
    >
      <div className={cn(s.introTextWrapper, isLoaded && s.relative)}>
        <span className={cn(s.pressStartIntro, s.start, isLoaded && s.show)} style={{ '--index': 1 }}>Al Andalus</span>
        <span className={cn(s.pressStartIntro, s.pressStartSub, s.start, isLoaded && s.show)} style={{ '--index': 2 }}>reloaded</span>
      </div>
    </div>
  )
}

export const Title = ({ className }) => {
  const introOut = useStore(({ introOut }) => introOut)

  return (
    <div className={cn(className, s.titleTextWrapper)}>
      <span className={s.pressStartTitle}>Al Andalus</span>
      <span className={cn(s.pressStartTitle, s.pressStartTitleSub, introOut && s.translate)}>reloaded</span>
    </div>
  )
}
