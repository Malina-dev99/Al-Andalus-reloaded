import cn from 'clsx'
import { Layout } from 'layouts/default'
import s from './docs.module.scss'

export default function Docs() {
  return (
    <Layout
      theme="light"
      seo={{
        title: 'Glosario – Al Andalus Reloaded',
        description: 'Términos y conceptos clave de la historia de Al-Ándalus.',
      }}
      className={s.page}
    >
      <section className={cn('theme-light', s.featuring)}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>

            <h1 className={cn('h2', s.title)}>Glosario</h1>

            <h2 className={cn('h4', s.term)}>Umma</h2>
            <p className="p">Comunidad de los creyentes en el Islam. Es un término que aparece en el Corán y en la Constitución de Medina, donde se refiere a la unión y solidaridad entre los musulmanes como una comunidad social y religiosa.</p>

            <h2 className={cn('h4', s.term)}>Bereberes</h2>
            <p className="p">Los bereberes son los pueblos originarios del norte de África. Muchos se islamizaron y participaron junto a los árabes en la conquista de al-Ándalus en 711. En la península tuvieron un papel importante en el ejército y en la organización del territorio, y más tarde algunos grupos bereberes llegaron a gobernar al-Ándalus, como los almorávides y almohades.</p>

            <h2 className={cn('h4', s.term)}>Fath</h2>
            <p className="p">El Fath representa el comienzo de la expansión islámica en la península tras la victoria de las tropas dirigidas por Tariq ibn Ziyad sobre el rey visigodo Rodrigo en la batalla de Guadalete. Para los musulmanes, esta conquista no solo tenía un significado militar, sino también religioso y político, al considerarse la expansión del islam y de la comunidad musulmana.</p>

            <h2 className={cn('h4', s.term)}>Escuela jurídica malikí</h2>
            <p className="p">La escuela jurídica malikí es una de las principales corrientes del derecho islámico suní. Fue fundada por el jurista Malik ibn Anas en el siglo VIII y se basa en el Corán, las enseñanzas del profeta Mahoma y las costumbres de la comunidad musulmana de Medina.</p>

            <h2 className={cn('h4', s.term)}>Saqaliba</h2>
            <p className="p">El término árabe ṣaqāliba (siqlabí en singular) se usaba en al-Ándalus para referirse a esclavos cristianos, muchos de origen eslavo. Desempeñaban funciones muy variadas: sirvientes, soldados, eunucos, artesanos o guardias del califa. A partir del siglo X ganaron importancia política y administrativa en Córdoba, especialmente durante el gobierno de Almanzor, que se apoyó en ellos por su lealtad.</p>

            <h2 className={cn('h4', s.term)}>Diezmo</h2>
            <p className="p">El diezmo es una contribución que consiste en entregar una parte de los ingresos o de la producción, normalmente alrededor del 10%, para un fin religioso o estatal. En al-Ándalus, se utilizó como parte del sistema fiscal del Estado para financiar al gobierno y al ejército.</p>

            <h2 className={cn('h4', s.term)}>Fitna</h2>
            <p className="p">La fitna fue un periodo de crisis, enfrentamientos y guerra civil que afectó al Emirato y posteriormente al Califato de Córdoba. La palabra árabe fitna significa "discordia" o "división", y se utiliza para describir situaciones de conflicto interno dentro del mundo islámico.</p>

            <h2 className={cn('h4', s.term)}>Mozárabes</h2>
            <p className="p">Cristianos que vivían en territorio musulmán y que adoptaron la lengua árabe y muchas costumbres islámicas, manteniendo sin embargo su religión. Fueron un grupo clave en la convivencia y el intercambio cultural de al-Ándalus.</p>

            <h2 className={cn('h4', s.term)}>Muladíes</h2>
            <p className="p">Hispanovisigodos o hispanorromanos que se convirtieron al islam. Representaron una parte importante de la población andalusí y en ocasiones protagonizaron revueltas contra el poder omeya, al sentirse discriminados respecto a los árabes y bereberes.</p>

            <h2 className={cn('h4', s.term)}>Qibla</h2>
            <p className="p">Dirección hacia la que deben orientarse los musulmanes durante la oración, que señala hacia La Meca. En las mezquitas, el muro de la qibla es el muro principal que indica esta dirección sagrada.</p>

            <h2 className={cn('h4', s.term)}>Mihrab</h2>
            <p className="p">Nicho o hornacina situada en el muro de la qibla de una mezquita que indica la dirección de La Meca. Es uno de los elementos arquitectónicos más importantes y decorados de la mezquita.</p>

            <h2 className={cn('h4', s.term)}>Taifas</h2>
            <p className="p">Pequeños reinos independientes en los que se fragmentó al-Ándalus tras la caída del Califato de Córdoba en 1031. Gobernados por dinastías locales, las taifas se enfrentaron entre sí con frecuencia y quedaron bajo la presión de los reinos cristianos del norte.</p>

          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'docs',
    },
  }
}