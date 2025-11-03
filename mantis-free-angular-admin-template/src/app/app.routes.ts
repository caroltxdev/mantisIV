import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  
  { path: 'inicio', loadComponent: () => 
    import('./pages/inicio/inicio.component').then(m => m.InicioComponent) 
  },
  
  { path: 'orcamento/novo', loadComponent: () => 
    import('./pages/orcamento/novo-orcamento/novo-orcamento.component').then(m => m.NovoOrcamento) 
  },
  
  { path: 'orcamento/editar', loadComponent: () => 
    import('./pages/orcamento/editar-orcamento/editar-orcamento.component').then(m => m.EditarOrcamento) 
  },
  
  { path: 'orcamento/taxa-entrega', loadComponent: () => 
    import('./pages/orcamento/taxa-entrega/taxa-entrega.component').then(m => m.TaxaEntrega) 
  },
  
  { path: 'pedidos', loadComponent: () => 
    import('./pages/pedidos/pedidos.component').then(m => m.Pedidos) 
  },
  
  { path: 'relatorios/produtos', loadComponent: () => 
    import('./pages/relatorios/relatorio-produtos/relatorio-produtos.component').then(m => m.RelatorioProdutos) 
  },
  
  { path: 'relatorios/pedidos', loadComponent: () => 
    import('./pages/relatorios/relatorio-pedidos/relatorio-pedidos.component').then(m => m.RelatorioPedidos) 
  },
  
  { path: 'relatorios/clientes', loadComponent: () => 
    import('./pages/relatorios/relatorio-clientes/relatorio-clientes.component').then(m => m.RelatorioClientes) 
  }
];
