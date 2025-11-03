// nav-items.ts - DADOS DO MENU SACOLA CHEIA

export interface NavItem {
  id: string;
  title: string;
  type: 'item' | 'group';
  icon?: string;
  url?: string;
  children?: NavItem[];
}

export const NavItems: NavItem[] = [
  {
    id: 'navigation',
    title: 'Menu Principal',
    type: 'group',
    children: [
      {
        id: 'inicio',
        title: 'Início',
        type: 'item',
        icon: 'home',
        url: '/inicio'
      }
    ]
  },
  {
    id: 'orcamentos',
    title: 'Orçamentos',
    type: 'group',
    children: [
      {
        id: 'novo-orcamento',
        title: 'Novo Orçamento',
        type: 'item',
        icon: 'add_circle',
        url: '/orcamento/novo'
      },
      {
        id: 'listar-orcamento',
        title: 'Gerenciar Orçamentos',
        type: 'item',
        icon: 'edit',
        url: '/orcamentos'
      },
      {
        id: 'taxa-entrega',
        title: 'Taxa de Entrega',
        type: 'item',
        icon: 'local_shipping',
        url: '/orcamento/taxa-entrega'
      },
      {
        id: 'pedidos',
        title: 'Pedidos',
        type: 'item',
        icon: 'shopping_cart',
        url: '/pedidos'
      }
    ]
  },
  {
    id: 'cadastros',
    title: 'Cadastros',
    type: 'group',
    children: [
      {
        id: 'clientes',
        title: 'Clientes',
        type: 'item',
        icon: 'people',
        url: '/cadastros/clientes'
      },
      {
        id: 'funcionarios',
        title: 'Funcionários',
        type: 'item',
        icon: 'badge',
        url: '/cadastros/funcionarios'
      },
      {
        id: 'produtos',
        title: 'Produtos',
        type: 'item',
        icon: 'inventory',
        url: '/cadastros/produtos'
      }
    ]
  },
  {
    id: 'relatorios',
    title: 'Relatórios',
    type: 'group',
    children: [
      {
        id: 'relatorio-produtos',
        title: 'Relatório de Produtos',
        type: 'item',
        icon: 'assessment',
        url: '/relatorios/produtos'
      },
      {
        id: 'relatorio-pedidos',
        title: 'Relatório de Pedidos',
        type: 'item',
        icon: 'bar_chart',
        url: '/relatorios/pedidos'
      },
      {
        id: 'relatorio-clientes',
        title: 'Relatório de Clientes',
        type: 'item',
        icon: 'pie_chart',
        url: '/relatorios/clientes'
      }
    ]
  }
];
