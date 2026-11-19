import { categories } from '../data/vehicles'
import { sections, site } from '../config/site'
import { scrollToId } from '../lib/scroll'
import { useBooking } from '../state/booking'
import { Wordmark } from './ui/Wordmark'

export function Footer() {
  const { setFilters } = useBooking()

  const goCategory = (id: (typeof categories)[number]['id']) => {
    setFilters({ category: id })
    scrollToId('frota')
  }

  return (
    <footer id="contato" aria-labelledby="footer-title" className="mt-20 border-t border-line pb-28 pt-16 sm:mt-28">
      <h2 id="footer-title" className="sr-only">
        Contato e informações
      </h2>
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="text-fg" />
            <p className="mt-2 text-fg-2">{site.descriptor}</p>
            <p className="mt-6 max-w-[34ch] text-fg-2">Locação de veículos com escolha simples, preços claros e atendimento próximo.</p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2">
            <p className="text-[0.85rem] font-medium">Navegação</p>
            <ul className="mt-3 space-y-0.5">
              {[...sections.filter((s) => s.id !== 'contato'), { id: 'reserva', label: 'Simulador' }].map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(s.id)
                    }}
                    className="inline-flex min-h-11 items-center text-fg-2 hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="text-[0.85rem] font-medium">Categorias</p>
            <ul className="mt-3 space-y-0.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => goCategory(c.id)} className="inline-flex min-h-11 items-center text-fg-2 hover:text-fg">
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[0.85rem] font-medium">Contato demonstrativo</p>
            <dl className="mt-4 space-y-3 text-fg-2">
              <div>
                <dt className="text-[0.8rem]">E-mail</dt>
                <dd className="text-fg">{site.contact.email}</dd>
              </div>
              <div>
                <dt className="text-[0.8rem]">Atendimento</dt>
                <dd className="text-fg">{site.contact.hours}</dd>
              </div>
              <div>
                <dt className="text-[0.8rem]">Orçamentos</dt>
                <dd>
                  <a
                    href="#reserva"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId('reserva')
                    }}
                    className="inline-flex min-h-11 items-center text-fg underline decoration-line underline-offset-4 hover:decoration-accent"
                  >
                    Pelo simulador de locação
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[0.88rem] text-fg-2 md:flex-row md:items-start md:justify-between">
          <p className="max-w-[60ch]">Protótipo conceitual desenvolvido pela Or7.dev. Veículos, preços e condições são ilustrativos.</p>
          <p className="shrink-0">
            Design e desenvolvimento <span className="font-medium text-fg">Or7.dev</span> · Fotos: Unsplash
          </p>
        </div>
      </div>
    </footer>
  )
}
