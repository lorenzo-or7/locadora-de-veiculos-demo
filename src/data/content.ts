import type { CategoryId } from '../lib/types'

export const howSteps = [
  {
    title: 'Escolha seu carro',
    text: 'Explore a frota e encontre o modelo ideal. Filtre por porte, câmbio e espaço, e compare até três opções lado a lado.',
    photo: { id: '1573899754191-bd20f600141c', alt: 'Hatch compacto azul em rua arborizada', focus: '50% 60%' },
  },
  {
    title: 'Personalize sua jornada',
    text: 'Defina o período e os serviços desejados. Diárias, adicionais e total aparecem na hora, sem letras miúdas.',
    photo: { id: '1768853143263-72d7e744bbc2', alt: 'Interior com bancos claros e painel moderno', focus: '50% 50%' },
  },
  {
    title: 'Prepare-se para partir',
    text: 'Solicite seu orçamento e organize a retirada. A mensagem sai pronta, com modelo, datas, locais e valores.',
    photo: { id: '1765446925602-e000af0bfa55', alt: 'Sedã verde-petróleo em estrada de terra com vista para o mar', focus: '50% 60%' },
  },
]

export interface Journey {
  id: string
  title: string
  kicker: string
  text: string
  category: CategoryId
  cta: string
  photo: { id: string; alt: string; focus?: string }
}

export const journeys: Journey[] = [
  {
    id: 'negocios',
    title: 'Viagens de negócios',
    kicker: 'Agenda cheia',
    text: 'Sedãs silenciosos, retirada no aeroporto e devolução em outra unidade. Você chega à reunião sem pensar no trajeto.',
    category: 'sedan',
    cta: 'Ver sedãs',
    photo: { id: '1616805111996-e39d9a19e35c', alt: 'Homem de terno ao volante de um carro executivo', focus: '50% 45%' },
  },
  {
    id: 'fim-de-semana',
    title: 'Escapadas de fim de semana',
    kicker: 'Sexta à tarde',
    text: 'Serra, litoral ou aquela estrada que sempre ficou para depois. Um carro com personalidade faz parte do roteiro.',
    category: 'premium',
    cta: 'Ver premium',
    photo: { id: '1564415051543-cb73a7468103', alt: 'Duas pessoas sentadas no teto de um carro ao pôr do sol', focus: '50% 60%' },
  },
  {
    id: 'familia',
    title: 'Aventuras em família',
    kicker: 'Todo mundo junto',
    text: 'SUVs com sete lugares, porta-malas generoso e cadeirinha incluída no simulador. Espaço para a bagagem e para as histórias.',
    category: 'suv',
    cta: 'Ver SUVs',
    photo: { id: '1756142007128-f431ede241cc', alt: 'Família sorrindo ao lado de um carro em uma estrada', focus: '50% 45%' },
  },
  {
    id: 'cidade',
    title: 'Mobilidade urbana',
    kicker: 'Dia a dia',
    text: 'Compactos econômicos, fáceis de estacionar e com consumo baixo para quem precisa se mover pela cidade sem complicação.',
    category: 'economico',
    cta: 'Ver econômicos',
    photo: { id: '1591266235749-f7f25ce0676a', alt: 'Rua de cidade iluminada à noite', focus: '50% 50%' },
  },
]

export const benefits = [
  { title: 'Processo simples', text: 'Da escolha à solicitação em quatro etapas, sem cadastro obrigatório.' },
  { title: 'Frota diversificada', text: 'Do compacto ao picape, com categorias claras para cada necessidade.' },
  { title: 'Preços transparentes', text: 'Diárias, adicionais e total visíveis antes de qualquer contato.' },
  { title: 'Atendimento personalizado', text: 'A solicitação chega estruturada para a equipe responder com precisão.' },
  { title: 'Flexibilidade de escolha', text: 'Retirada e devolução em unidades diferentes, nos horários que fazem sentido.' },
  { title: 'Experiência digital intuitiva', text: 'Funciona no celular, no teclado e com leitores de tela.' },
]

export const faqs = [
  {
    q: 'Como funciona a reserva?',
    a: 'Neste protótipo você monta uma simulação e envia uma solicitação de orçamento. A locadora confirma disponibilidade, valores e condições pelo atendimento. Nenhuma reserva é criada automaticamente.',
  },
  {
    q: 'Quais documentos são necessários?',
    a: 'Em geral, locadoras pedem documento de identidade, carteira de habilitação válida e um cartão para caução. A lista exata é definida por cada empresa; este conteúdo é ilustrativo.',
  },
  {
    q: 'Posso alterar meu período?',
    a: 'Sim. No simulador você ajusta datas, horários e locais a qualquer momento e o total é recalculado. Depois da solicitação, alterações dependem da política da locadora.',
  },
  {
    q: 'Existem adicionais disponíveis?',
    a: 'O simulador inclui proteção adicional, condutor extra, cadeirinha infantil e GPS, com valores demonstrativos. Uma locadora real pode oferecer outros serviços.',
  },
  {
    q: 'Como funciona a retirada?',
    a: 'Você escolhe a unidade e o horário na simulação. Na operação real, a retirada envolve conferência de documentos, vistoria do veículo e assinatura do contrato.',
  },
  {
    q: 'O valor apresentado é definitivo?',
    a: 'Não. O total é uma estimativa com preços ilustrativos. O valor final depende da confirmação da locadora, da disponibilidade e das condições contratuais.',
  },
]

export const demoConditions = [
  'Diárias de 24 horas. Frações excedentes contam como uma diária adicional.',
  'Preços ilustrativos, sem consulta de disponibilidade real.',
  'Documentos, caução e quilometragem são definidos pela locadora no atendimento.',
  'O valor final depende de confirmação e das condições contratuais vigentes.',
]
