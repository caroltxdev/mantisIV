// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  
  { 
    path: 'inicio', 
    loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [authGuard]
  },

  // ===== ORÇAMENTOS =====
  
  {
    path: 'orcamento/novo',
    loadComponent: () => import('./pages/orcamento/novo-orcamento/novo-orcamento.component')
      .then(m => m.NovoOrcamentoComponent),
    canActivate: [authGuard]
  },
  
  {
    path: 'orcamento/editar',
    loadComponent: () => import('./pages/orcamento/editar-orcamento/editar-orcamento.component')
      .then(m => m.EditarOrcamentoComponent),
    canActivate: [authGuard]
  },
  
  {
    path: 'orcamento/editar/:id',
    loadComponent: () => import('./pages/orcamento/editar-orcamento/editar-orcamento.component')
      .then(m => m.EditarOrcamentoComponent),
    canActivate: [authGuard]
  },
  
  {
    path: 'orcamentos',
    loadComponent: () => import('./pages/orcamento/listar-orcamentos/listar-orcamentos.component')
      .then(m => m.ListarOrcamentosComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'orcamento/taxa-entrega', 
    loadComponent: () => import('./pages/orcamento/taxa-entrega/taxa-entrega.component')
      .then(m => m.TaxaEntrega),
    canActivate: [authGuard]
  },

  // ===== PEDIDOS =====
  
  { 
    path: 'pedidos', 
    loadComponent: () => import('./pages/pedidos/pedidos.component')
      .then(m => m.Pedidos),
    canActivate: [authGuard]
  },

  // ===== CADASTROS =====
  
  { 
    path: 'cadastros/clientes', 
    loadComponent: () => import('./pages/cadastros/clientes/clientes.component')
      .then(m => m.ClientesComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'cadastros/funcionarios', 
    loadComponent: () => import('./pages/cadastros/funcionarios/funcionarios.component')
      .then(m => m.FuncionariosComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'cadastros/produtos', 
    loadComponent: () => import('./pages/cadastros/produtos/produtos.component')
      .then(m => m.ProdutosComponent),
    canActivate: [authGuard]
  },

  // ===== RELATÓRIOS =====
  
  { 
    path: 'relatorios/produtos', 
    loadComponent: () => import('./pages/relatorios/relatorio-produtos/relatorio-produtos.component')
      .then(m => m.RelatorioProdutosComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'relatorios/pedidos', 
    loadComponent: () => import('./pages/relatorios/relatorio-pedidos/relatorio-pedidos.component')
      .then(m => m.RelatorioPedidosComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'relatorios/clientes', 
    loadComponent: () => import('./pages/relatorios/relatorio-clientes/relatorio-clientes.component')
      .then(m => m.RelatorioClientesComponent),
    canActivate: [authGuard]
  },

  // ===== ROTA CURINGA =====
  { path: '**', redirectTo: 'inicio' }
];
