import { useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Card } from 'components/card'
import { useScroll } from 'hooks/use-scroll'
import { clamp, mapRange } from 'lib/maths'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

import s from './feature-cards.module.scss'

const cards = [
  { text: 'La incorporación del árabe como lengua principal en la administración y la vida urbana. Pasó a ser la lengua más importante en el funcionamiento del Estado y de las ciudades, se convirtió en la lengua del poder, la administración y la vida urbana culta, y por eso se extendió poco a poco entre gran parte de la población. ' },

  {
    text: ( `En la alimentación se introduce una forma de comer más estructurada y sofisticada, especialmente en las élites, que con el tiempo evolucionará hasta el sistema moderno de primer plato, segundo plato y postre.`  ),
    
   
  },
  { text: `Se introdujo un gusto por los tejidos más ligeros, los colores vivos y los adornos detallados, algo que tuvo especial impacto en la estética del sur de la península. Aunque las prendas han cambiado con el tiempo, algunas tradiciones y estilos decorativos de la ropa regional andaluza aún reflejan ese legado cultural andalusí. ` },
  { text: 'Las ciudades de al-Ándalus se transformaron por completo: dejaron atrás el modelo tardoantiguo y pasaron a organizarse en torno a mezquitas, zocos y baños públicos, que se convirtieron en el centro de la vida religiosa, económica y social. Hoy en día, ese cambio todavía se percibe en muchas ciudades, con cascos antiguos de calles estrechas, la presencia de mezquitas, patios y mercados tradicionales.' },
  {
    text: <>Se produjo un gran desarrollo de la poesía, la música y la cultura árabe, sobre todo en Córdoba, que se convirtió en un importante centro cultural. En la ciudad florecieron las artes y el conocimiento, y convivían poetas, músicos y sabios que hicieron de Córdoba uno de los principales focos culturales del mundo islámico occidental</>,
  },

,
]

export const FeatureCards = () => {
  const element = useRef()
  const [setRef, rect] = useRect()
  const { height: windowHeight } = useWindowSize()

  const [current, setCurrent] = useState()

  useScroll(
    ({ scroll }) => {
      const start = rect.top - windowHeight * 2
      const end = rect.top + rect.height - windowHeight

      const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)

      element.current.style.setProperty(
        '--progress',
        clamp(0, mapRange(rect.top, end, scroll, 0, 1), 1)
      )
      const step = Math.floor(progress * 10)
      setCurrent(step)
    },
    [rect]
  )

  return (
    <div
      ref={(node) => {
        setRef(node)
      }}
      className={s.features}
    >
      <div className={cn('layout-block-inner', s.sticky)}>
        <aside className={s.title}>
          <p className="h3">
            <AppearTitle>
             Arabización
              <br />
              <span className="grey">e islamización</span>
            </AppearTitle>
          </p>
        </aside>
        <div ref={element}>
          {cards.map((card, index) => (
            <SingleCard
              key={index}
              index={index}
              text={card.text}
              number={index + 1}
              current={index <= current - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SingleCard = ({ text, number, index, current }) => {
  return (
    <div className={cn(s.card, current && s.current)} style={{ '--i': index }}>
      <Card background="rgba(239, 239, 239, 0.8)" number={number} text={text} />
    </div>
  )
}
