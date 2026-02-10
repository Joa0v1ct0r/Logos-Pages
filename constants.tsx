
import React from 'react';
import { Project, Plan, FAQItem } from './types';
import { Layout, Globe, Cpu, Zap, Shield, Rocket } from 'lucide-react';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Aurora Fintech',
    slug: 'aurora-fintech',
    description: 'Um dashboard financeiro disruptivo focado em microinvestidores.',
    technologies: ['React', 'Supabase', 'Framer Motion'],
    cover_image_url: 'https://picsum.photos/seed/aurora/1200/800',
    project_url: 'https://github.com',
    is_active: true,
    order_index: 1,
    status: 'Public',
    demo_type: 'scroll'
  },
  {
    id: '2',
    title: 'EcoSphere LP',
    slug: 'ecosphere-lp',
    description: 'Conversão massiva para produtos de sustentabilidade inteligente.',
    technologies: ['Next.js', 'Tailwind', 'Conversion'],
    cover_image_url: 'https://picsum.photos/seed/eco/1200/800',
    project_url: 'https://github.com',
    is_active: true,
    order_index: 2,
    status: 'Public',
    demo_type: 'scroll'
  },
  {
    id: '3',
    title: 'Moderna Arch',
    slug: 'moderna-arch',
    description: 'Minimalismo e elegância para um escritório de arquitetura internacional.',
    technologies: ['Typescript', 'Design System'],
    cover_image_url: 'https://picsum.photos/seed/arch/1200/800',
    project_url: 'https://github.com',
    is_active: true,
    order_index: 3,
    status: 'Public',
    demo_type: 'scroll'
  }
];

export const PLANS: Plan[] = [
  {
    id: 'p1',
    name: 'Essencial',
    price: 'A partir de R$ 2.9k',
    description: 'Ideal para Landing Pages de alta conversão e lançamentos.',
    features: ['Design Exclusivo', 'Mobile First', 'SEO Integrado', 'Hospedagem inclusa (1 ano)'],
    highlighted: false,
    is_active: true
  },
  {
    id: 'p2',
    name: 'Premium',
    price: 'A partir de R$ 5.9k',
    description: 'O padrão ouro para sites institucionais que transmitem autoridade.',
    features: ['Blog Integrado', 'Animações Premium', 'Multi-páginas', 'Suporte Prioritário'],
    highlighted: true,
    is_active: true
  },
  {
    id: 'p3',
    name: 'Enterprise',
    price: 'Sob Consulta',
    description: 'Sistemas web sob medida para automatizar e escalar seu negócio.',
    features: ['Painel Admin', 'API Integrations', 'Segurança Bancária', 'Escalabilidade Cloud'],
    highlighted: false,
    is_active: true
  }
];

export const SERVICES = [
  {
    title: 'Landing Pages',
    description: 'Focadas em converter visitantes em clientes reais através de gatilhos mentais e UX otimizada.',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Sites Institucionais',
    description: 'Arquiteturas digitais que constroem credibilidade e posicionam sua marca no mercado global.',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: 'Sistemas Web',
    description: 'Aplicações robustas, seguras e performáticas para resolver problemas complexos de gestão.',
    icon: <Cpu className="w-6 h-6" />,
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'f1',
    question: 'Qual o prazo médio de entrega?',
    answer: 'Nossos projetos variam de 15 dias (Landing Pages) a 60 dias (Sistemas Complexos). Priorizamos qualidade sobre velocidade desenfreada.',
    order_index: 1
  },
  {
    id: 'f2',
    question: 'Terei suporte após o lançamento?',
    answer: 'Sim! Oferecemos 3 meses de garantia técnica gratuita e planos de manutenção mensal para evolução contínua.',
    order_index: 2
  },
  {
    id: 'f3',
    question: 'Como funciona o processo de pagamento?',
    answer: 'Trabalhamos com entrada + parcelamento durante o desenvolvimento ou condições especiais para pagamentos à vista.',
    order_index: 3
  }
];
