import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
import { Link } from 'components/link'
import { ListItem } from 'components/list-item'
import { projects } from 'content/projects'
import { useScroll } from 'hooks/use-scroll'
import { Layout } from 'layouts/default'
import { button, useControls } from 'leva'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'
import { Modal } from 'components/modal'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const Sponsor = dynamic(() => import('icons/sponsor.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const HeroTextIn = ({ children, introOut }) => {
  return (
    <div className={cn(s['hide-text'], introOut && s['show-text'])}>
      {children}
    </div>
  )
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  useControls(
    'lenis',
    () => ({
      stop: button(() => {
        lenis.stop()
      }),
      start: button(() => {
        lenis.start()
      }),
    }),
    [lenis]
  )

  useControls(
    'scrollTo',
    () => ({
      immediate: button(() => {
        lenis.scrollTo(30000, { immediate: true })
      }),
      smoothDuration: button(() => {
        lenis.scrollTo(30000, { lock: true, duration: 10 })
      }),
      smooth: button(() => {
        lenis.scrollTo(30000)
      }),
      forceScrollTo: button(() => {
        lenis.scrollTo(30000, { force: true })
      }),
    }),
    [lenis]
  )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height,
    })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight,
    })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  useScroll((e) => {
    console.log(window.scrollY, e.scroll, e.isScrolling, e.velocity, e.isLocked)
  })

  useFrame(() => {
    console.log('frame', window.scrollY, lenis?.scroll, lenis?.isScrolling)
  }, 1)

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2,
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Al Andalus Reloaded – Historia de Al-Ándalus',
        description:
          'Un viaje por la historia de Al-Ándalus en Córdoba.',
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      <Modal />

      <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>Historia de Al-Ándalus</h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                <span>©</span> 711–1492 d.C.
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>desliza</p>
              </HeroTextIn>
              <HeroTextIn introOut={introOut}>
                <p> para explorar</p>
              </HeroTextIn>
              
            </div>
          </div>
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Coloca el cursor sobre las </p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">palabras subrayadas </p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">para ver su significado.</p>
            </HeroTextIn>

            
          </h1>
         <Button
          className={cn(s.cta, s.documentation, introOut && s.in)}
          arrow
          icon={<GitHub />}
          href="/docs"   
        >
          Glosario
        </Button>
          <Button
            className={cn(s.cta, s.sponsor, introOut && s.in)}
            arrow
            icon={<Sponsor />}
            href="https://github.com/sponsors/darkroomengineering"
          >
            Más información
          </Button>
        </div>
      </section>

      <section className={s.why} data-lenis-scroll-snap-align="start">
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            <AppearTitle>Antes del 711</AppearTitle>
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <p className="p">
               La península arábiga estaba fragmentada en tribus hasta que Muhammad se encargó 
               de crear una comunidad política y religiosa unificada: <span className={s.tooltip}
                data-tip="Comunidad de los creyentes en el Islam. Es un término que aparece en
                 el Corán y en la Constitución de Medina, donde se refiere a la unión y solidaridad
                  entre los musulmanes como una comunidad social y religiosa.">la umma</span> . 
               Esta cohesión permitió una estabilidad interna y una identidad común para expandirse rápidamente, 
               aprovechando la debilidad de los imperios vecinos.
            
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
             Norte de África y la península ibérica
              </h3>
              <p className="p">
              En el norte de África, el poder musulmán ya estaba consolidado.
               Algunas fuentes mencionan a Don Julián en Tánger, aunque su
                papel es incierto. Mientras tanto, la península ibérica estaba 
                bajo el reino visigodo, gobernado por Rodrigo desde Toledo.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
             Las primeras incursiones
              </h3>
              <p className="p">
               Antes de la invasión se hicieron incursiones de prueba. 
               Tarif ibn Malik lideró una de ellas: cruzó con un pequeño
                grupo, saqueó la costa y regresó con botín.
                 Al difundirse esta noticia, Abu Zurʿa Tarif ibn Malik animó nuevas incursiones. 
                 Con unos 3.000 hombres, volvieron a cruzar, desembarcaron en una península a la 
                que llamaron Tarifa. Atacaron la zona, obtuvieron botín y regresaron a África.
              </p>
            </div>
            
             </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight} data-lenis-scroll-snap-align="start">
            <Parallax speed={-0.5}>
              <p className="h2">
                <AppearTitle>A partir del 711</AppearTitle>
              </p>
            </Parallax>
          </div>
          <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
                Tras este éxito, un ejército formado principalmente por árabes y 
                <span className={s.tooltip} data-tip="Los bereberes, son los pueblos originarios 
                del norte de África. Muchos se islamizaron y participaron junto a los árabes 
                en la conquista de al-Ándalus en 711. En la península tuvieron un papel
                 importante en el ejército y en la organización del territorio, y más 
                 tarde algunos grupos bereberes llegaron a gobernar al-Ándalus, como 
                 los almorávides y almohades."> bereberes</span>, 
                dirigido por Tariq ibn Ziyad, desembarcó en una montaña que fue llamada Gibraltar.
               Según la tradición, quemaron sus barcos y animaron a las tropas diciendo: ¡Combatid
                o morid!. Derrotaron al rey visigodo Rodrigo en la batalla de Guadalete y dio inicio
                 al dominio musulmán, el <span className={s.tooltip} data-tip="El Fath representa el 
                 comienzo de la expansión islámica en la península tras la victoria de las tropas 
                 dirigidas por Tariq ibn Ziyad sobre el rey visigodo Rodrigo en la batalla de
                  Guadalete. Para los musulmanes, esta conquista no solo tenía un significado
                  militar, sino también religioso y político, al considerarse la 
                  expansión del islam y de la comunidad musulmana.">Fath</span>. La conquista se extendió rápidamente mediante campañas militares y pactos con la población hispanovisigoda, que en muchos 
                 casos conservó su religión y costumbres a cambio del pago de tributos, 
                  con el tiempo estos acuerdos generaron tensiones y conflictos.
              </p>
            </Parallax>
          </div>
           <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
              Tras la consolidación inicial, el poder islámico en Oriente entró en crisis con 
              la llegada de los abasíes en 750, que derrotaron a los omeyas y persiguieron
               a su familia. Solo un miembro logró escapar: el joven principe Abderramán I. 
               Tras una huida arriesgada, llegó a al-Ándalus y, con el apoyo de distintos grupos descontentos con la situación,
                logró fundar en el año 756 el Emirato independiente de Córdoba. 

                </p>
            </Parallax>
          </div>
           <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
              A partir de ahí, los omeyas consolidaron su poder. Sofocaron rebeliones,
              reorganizaron el territorio y fortalecieron el Estado, dando inicio a una 
              dinastía que gobernaría al-Ándalus hasta el año 1031. En ese proceso se fue
               formando una nueva identidad cultural, marcada por la arabización y la 
               islamización progresiva de la sociedad. El poder omeya no solo se sostuvo en lo militar, sino también en la construcción
           de una gran capital. Córdoba creció hasta convertirse en una de las ciudades 
           más importantes de Europa.
           </p>

         <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
            La llegada de los omeyas fue clave para la consolidación del 
            islam en la península, 
            así como para el desarrollo de una identidad política y cultural más 
            cohesionada, vinculada al arabismo. Su liderazgo permitió reforzar la 
            estabilidad del territorio e impulsar la construcción del símbolo del 
            nuevo poder andalusí: la Mezquita de Córdoba.
            
                </p>
            </Parallax>
          </div>
             
              
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="00"
              text="Abderramán I convierte la basílica visigoda de San Vicente en la primitiva mezquita. Su planta presenta 11 naves perpendiculares al muro de la qibla y los capiteles eran de acarreamiento de otras construcciones."
              hoverImage="/images/mezquita-00.jpg"
            />
            <Card
              className={s.card}
              number="01"
              text="El periodo de prosperidad que se vive en el 833, lleva a Abderramán II a prolongar la sala de oración 8 naves hacia el sur y además se labraron nuevos capiteles."
              hoverImage="/images/mezquita-01.jpg"
            
            />
            <Card
              className={s.card}
              number="02"
              text="Más tarde, en el año 951, Abderramán III emprende una nueva ampliación que afecta al patio. Este creció hacia el norte y en él se construyeron pórticos. También se edifica un alminar."
              hoverImage="/images/mezquita-02.jpg"
            />
            <Card
              className={s.card}
              number="03"
              text="En el 962, Alhakén II amplia la nave central. Se termina el mihrab y se construye un doble muro de la qibla. Esta ampliación concentra todo el arte califal. "
              hoverImage="/images/mezquita-03.jpg"
            />
            <Card
              className={s.card}
              number="04"
              text="La última intervención fue realizada por Almanzor. Se realiza hacia el este porque hacia el sur ya se encuentra el río Guadalquivir.Esta ampliación es la más grande de todas. "
              hoverImage="/images/mezquita-04.jpg"
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              <br />
              <span className="contrast">año 788</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
             Hisham I
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}></h2>
          </div>
        </div>
      </section>
   
   
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <p className="p">
           Antes de morir, Abderramán I aseguró la continuidad del poder omeya en al-Ándalus.
           El emirato pasaría a manos de su hijo, Hisham I, consolidando así una sucesión
          dinástica que buscaba evitar fracturas internas en un territorio todavía marcado
           por tensiones políticas y rivalidades entre élites.

              </p>
              <p className="p">
              Hisham I fue un gobernante prudente e inteligente. Durante su reinado promovió 
              obras de caridad para mejorar la situación del pueblo y ordenó la ampliación
              de la Mezquita de Córdoba, iniciada por su padre. Además, impulsó la 
              expansión de la<span className={s.tooltip} data-tip="La escuela jurídica malikí es
               una de las principales corrientes del derecho islámico suní. Fue fundada por el
               jurista Malik ibn Anas en el siglo VIII y se basa en el Corán, las enseñanzas del 
               profeta Mahoma y las costumbres de la comunidad musulmana de Medina.">escuela jurídica malikí</span>, que se convirtió en la corriente
              dominante del derecho islámico en Al-Ándalus.
              </p>
              <p className="p">
               Durante esta etapa, el Emirato de al-Ándalus dejó de expandirse territorialmente 
               Durante esta etapa, el emirato dejó atrás la expansión territorial y concentró
                sus esfuerzos en consolidar el poder interno. Las campañas militares pasaron a
                 orientarse principalmente al control de las fronteras cristianas y a operaciones
               de castigo. En ese contexto, Al-Hakam I (796–822) fortaleció el Estado mediante
               una administración más rígida y un sistema fiscal más organizado.
              </p>
              <p className="p">
               Para sostener esta estructura política y militar, el emir recurrió cada vez más
               a los <span className={s.tooltip} data-tip="El término árabe ṣaqāliba
                (siqlabí en singular) se usaba en al-Ándalus para referirse a esclavos cristianos,
                muchos de origen eslavo. Desempeñaban funciones muy variadas: sirvientes, soldados,
                 eunucos, artesanos o guardias del califa. A partir del siglo X ganaron importancia 
                 política y administrativa en Córdoba, especialmente durante el gobierno de Almanzor,
                  que se apoyó en ellos por su lealtad.">saqaliba</span>.
               Este proceso marcó el inicio de la llamada “extranjerización”
               del ejército andalusí, una transformación que alcanzaría su máximo desarrollo
               siglos después con Almanzor.
              </p>
                <p className="p">
                A la muerte de Al-Hakam I, su hijo Abderramán II (822–852) heredó un emirato más
               estable y con unas bases fiscales sólidas. Su reinado inauguró una etapa de
                prosperidad caracterizada por la consolidación del poder omeya y por el auge de
                Córdoba como gran centro político y cultural de Occidente islámico.
              </p>
              <p className="p">
              Abderramán II fue además un gobernante profundamente culto, apasionado por la
              poesía, la música, la filosofía, la medicina y las artes. También favoreció la
              llegada de conocimientos y obras procedentes de Oriente, especialmente de Bagdad,
              lo que contribuyó al crecimiento cultural de Córdoba. 
              </p>
                <p className="p">
               En este contexto destacó
              la figura de Ziryab, músico e intelectual llegado desde
               Oriente, cuya influencia transformó la vida cortesana: introdujo nuevas formas
                musicales, cambios en la moda, innovaciones gastronómicas y hábitos de etiqueta
                que redefinieron la cultura andalusí.
              </p>
              <p className="p">
               Sin embargo, Abderramán II no fue solo un mecenas cultural. También consolidó el
              aparato del Estado omeya mediante una fiscalidad más estricta. Impuso 
              un <span className={s.tooltip} data-tip="El diezmo es una contribución que consiste
               en entregar una parte de los ingresos o de la producción, normalmente alrededor del 
               10%, para un fin religioso o estatal.En al-Ándalus, se utilizó como parte del sistema
                fiscal del Estado para financiar al gobierno y al ejército."> diezmo</span>
               sobre los cereales en cada distrito, independientemente de la calidad de la
                cosecha anual, reforzando así la Hacienda pública. </p>
              
            
            <p className="p">
                
                Cuando Muhammad I heredó el poder, recibió un Estado más sólido desde el punto de
               vista administrativo. Mientras tanto, la sociedad andalusí estaba experimentando
               una profunda transformación.  La antigua sociedad visigoda, mayoritariamente rural
                y cristiana, había estado
              dominada por grandes terratenientes que obtenían rentas de campesinos,
               dependientes y esclavos. Frente a ese modelo, la nueva sociedad araboislámica
               introdujo una organización más urbana y centralizada, articulada en torno a las
              ciudades y a un sistema estatal basado en la recaudación de impuestos.
              </p>

              <p className="p">
                
               Al-Ándalus inició así un doble proceso de arabización e islamización que
               transformó la lengua, la cultura, las costumbres y la estructura social del
              territorio y que implicó: 
              </p>
          </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards />
        </section>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <p className="p">
              Volviendo a la historia política, tras el reinado de Abderramán II, 
              le sucedió su hijo Muhammad I (852–886). Su gobierno estuvo marcado por 
              un aumento de las tensiones internas y numerosas revueltas en distintas 
              zonas de al-Ándalus, lo que hizo que el emirato perdiera parte de la 
              estabilidad conseguida anteriormente.  
            </p>
            <p className="p">
            En 929, Abderramán III se proclamó califa, lo que significó la independencia
             total de al-Ándalus respecto al califato abasí de Bagdad. Con este hecho
              comenzó el Califato de Córdoba (929–1031), una etapa de gran esplendor en
               la que el Estado alcanzó una fuerte estabilidad política y un importante 
               desarrollo cultural y científico, convirtiendo a Córdoba en una de las 
               ciudades más destacadas de Europa. Además, se produjo un periodo de prosperidad 
               y relativa convivencia entre musulmanes, cristianos y judíos bajo el poder omeya.
            </p>
            <p className="p">
              A siete kilómetros de Córdoba, al pie de Sierra Morena, se levantó una ciudad
               palaciega destinada a convertirse en símbolo del poder omeya 
               en Occidente: Medina Azahara. 
            </p>
          </div>
        </div>
      </section>
     <section className={cn(s.rethink)}>
  <div className={s.cards}>
    <HorizontalSlides>
      <Card
        className={s.card}
        number="00"
        text="Medina Azahara nació en el año 936 por orden de Abderramán III. No era solo una nueva residencia: simbolizaba el nacimiento del califato de Córdoba y la ambición de los omeyas de convertirse en los califas de Occidente."
        hoverImage="\images\Medina-01.JPG"
      />
      <Card
        className={s.card}
        number="01"
        text="Miles de obreros levantaron la ciudad con materiales valiosos llegados del Mediterráneo. Medina Azahara no solo debía funcionar: debía mostrar riqueza, autoridad y poder ante el mundo."
        hoverImage="\images\Medina-02.JPG"
      />
      <Card
        className={s.card}
        number="02"
        text="La ciudad se construyó al pie de Sierra Morena, dominando toda la llanura cordobesa. En el siglo X, Córdoba era una de las mayores ciudades de Europa, y Medina Azahara actuaba como su gran centro político y simbólico."
        hoverImage="\images\Medina-00.JPG"
      />
      <Card
        className={s.card}
        number="03"
        text="Medina Azahara estaba organizada en tres niveles escalonados. En la parte superior se encontraba el Alcázar y la sede del poder califal. Su arquitectura reflejaba el orden y la jerarquía del Estado."
        hoverImage="\images\Medina-03.JPG"
      />
      <Card
        className={s.card}
        number="04"
        text="La mezquita fue inaugurada en el año 941 y estaba abierta tanto a la corte como a los habitantes de la medina. Su enorme riqueza decorativa la convirtió, siglos después, en uno de los edificios más saqueados."
        hoverImage="\images\Medina-04.JPG"
      />
      <Card
        className={s.card}
        number="05"
        text="En el año 1010, Medina Azahara fue destruida durante las guerras que acabaron con el califato. Sus piedras fueron reutilizadas durante siglos como cantera, hasta prácticamente el siglo XX."
        hoverImage="\images\Medina-05.JPG"
      />
    </HorizontalSlides>
  </div>
</section>


<section className={cn('theme-light', s.featuring)}>
  <div className={s.inner}>
    <div className={cn('layout-block', s.intro)}>
      <p className="p">La crisis del Califato de Córdoba comenzó con una profunda inestabilidad conocida como la <span className={s.tooltip} data-tip="La fitna fue un periodo de crisis, enfrentamientos y guerra civil que afectó al Emirato y posteriormente al Califato de Córdoba. La palabra árabe fitna significa “discordia” o “división”, y se utiliza para describir situaciones de conflicto interno dentro del mundo islámico."> fitna</span>. 
      Las revueltas surgieron por múltiples causas: la elevada presión fiscal, el deseo de autonomía de distintas regiones, las luchas de poder entre clanes y ciudades, la discriminación hacia musulmanes no árabes y el descontento de conversos hispanogodos, bereberes y sectores cristianos que rechazaban el proceso de islamización. A esto se sumaban el reparto desigual de tierras y la sensación de que muchas zonas quedaban al margen de los beneficios del poder omeya.</p>
      <p className="p">La situación fue empeorando progresivamente. La caída de la recaudación debilitó la capacidad del Estado para mantener un ejército fuerte, lo que aceleró la pérdida de control sobre el territorio. En este contexto, ciudades como Toledo desafiaron la autoridad de Córdoba, surgieron poderes locales independientes y aumentaron los conflictos entre señores regionales.</p>
      <p className="p">En el año 1031, tras la desaparición del Califato de Córdoba, comenzó la etapa de los Reinos de Taifas. Al-Ándalus se fragmentó en numerosos pequeños reinos independientes gobernados por dinastías locales, lo que debilitó profundamente la unidad política. Estas taifas se enfrentaron entre sí con frecuencia y, además, quedaron bajo la presión de los reinos cristianos del norte, a los que en muchos casos pagaban tributos para mantener la paz.</p>
      <p className="p">A finales del siglo XI, la llegada de los almorávides desde el norte de África permitió reunificar temporalmente al-Ándalus bajo un poder más fuerte. Sin embargo, este dominio no se mantuvo estable y, con el tiempo, muchas ciudades rechazaron su autoridad, recuperando su independencia y dando lugar a una nueva fragmentación conocida como las segundas taifas.</p>
    </div>
  </div>
</section>


      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        <div className="layout-grid">
          <aside className={s.title}>
            <p className="h3">
              <AppearTitle>
                <span>Marina</span>

                <br />
                <span className="grey">Prieto Oltra</span>
              </AppearTitle>
            </p>
          </aside>
          
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    }, // will be passed to the page component as props
  }
}
