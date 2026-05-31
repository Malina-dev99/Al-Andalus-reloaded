import cn from 'clsx'
import s from './card.module.scss'
import { useRef, useState } from 'react'
 
export const Card = ({
  number,
  text,
  className,
  inverted,
  background = 'rgba(14, 14, 14, 0.15)',
  hoverImage,
}) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const ref = useRef()
 
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
 
  return (
    <div
      ref={ref}
      className={cn(className, s.wrapper, inverted && s.inverted)}
      style={{ '--background': background }}
      onMouseMove={hoverImage ? handleMouseMove : undefined}
      onMouseEnter={hoverImage ? () => setVisible(true) : undefined}
      onMouseLeave={hoverImage ? () => setVisible(false) : undefined}
    >
      {number && (
        <p className={s.number}>{number.toString().padStart(2, '0')}</p>
      )}
      {text && <p className={s.text}>{text}</p>}
 
      {hoverImage && (
        <div
          className={cn(s.hoverImg, visible && s.hoverImgVisible)}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        >
          <img src={hoverImage} alt="" />
        </div>
      )}
    </div>
  )
}