import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container" *ngIf="!isLoginPage">
      <div class="sacola-sidebar">
        <div class="sacola-header">
          <a href="/inicio" class="sacola-brand">
            <span class="sacola-logo-text">Sacola Cheia</span>
          </a>
        </div>

        <div class="sacola-menu">
          <div class="sacola-caption">MENU PRINCIPAL</div>
          <a href="/inicio" class="sacola-link">
            <span class="sacola-icon">🏠</span>
            <span>Início</span>
          </a>

          <div class="sacola-caption">ORÇAMENTOS</div>
          <a href="/orcamento/novo" class="sacola-link">
            <span class="sacola-icon">📝</span>
            <span>Novo</span>
          </a>
          <a href="/orcamento/editar" class="sacola-link">
            <span class="sacola-icon">✏️</span>
            <span>Editar</span>
          </a>

          <div class="sacola-caption">CADASTROS</div>
          <a href="/cadastros/clientes" class="sacola-link">
            <span class="sacola-icon">👥</span>
            <span>Clientes</span>
          </a>
          <a href="/cadastros/funcionarios" class="sacola-link">
            <span class="sacola-icon">👔</span>
            <span>Funcionários</span>
          </a>
          <a href="/cadastros/produtos" class="sacola-link">
            <span class="sacola-icon">🍎</span>
            <span>Produtos</span>
          </a>

          <div class="sacola-caption">RELATÓRIOS</div>
          <a href="/relatorios/produtos" class="sacola-link">
            <span class="sacola-icon">📊</span>
            <span>Produtos</span>
          </a>
          <a href="/relatorios/pedidos" class="sacola-link">
            <span class="sacola-icon">📦</span>
            <span>Pedidos</span>
          </a>
          <a href="/relatorios/clientes" class="sacola-link">
            <span class="sacola-icon">📋</span>
            <span>Clientes</span>
          </a>
        </div>

        <div class="sacola-footer">
          <button (click)="logout()" class="btn-logout">
            <span class="logout-icon">🚪</span>
            Sair
          </button>
        </div>
      </div>

      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>

    <div *ngIf="isLoginPage" class="login-only">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }

    .sacola-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 260px;
      height: 100vh;
      background: #1a4d27;
      overflow-y: auto;
      padding: 1rem;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
    }

    .sacola-header {
      background: #2d7a3e;
      padding: 1rem;
      border-bottom: 2px solid #52c76b;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .sacola-brand {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .sacola-logo-text {
      color: #e8f5e9;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .sacola-menu {
      padding: 1rem 0;
      flex: 1;
      overflow-y: auto;
    }

    .sacola-caption {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.75rem 0.5rem 0.5rem;
      margin-top: 1rem;
    }

    .sacola-link {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      color: #e8f5e9;
      text-decoration: none;
      border-radius: 8px;
      margin: 0.25rem 0;
      transition: all 0.3s ease;
    }

    .sacola-link:hover {
      background: rgba(82, 199, 107, 0.15);
      transform: translateX(5px);
    }

    .sacola-icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }

    .sacola-footer {
      padding-top: 1rem;
      border-top: 1px solid rgba(82, 199, 107, 0.3);
      margin-top: auto;
    }

    .btn-logout {
      width: 100%;
      padding: 0.75rem;
      background: #e53935;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-logout:hover {
      background: #c62828;
      transform: scale(1.05);
    }

    .logout-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    .main-content {
      margin-left: 260px;
      padding: 2rem;
      background: #f5f5f5;
      width: calc(100% - 260px);
      overflow-y: auto;
    }

    .login-only {
      width: 100%;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  isLoginPage = false;
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage = event.url === '/login' || event.url === '/';
      });
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_email');
    this.router.navigate(['/login']);
  }

  title = 'Sacola Cheia';
}
