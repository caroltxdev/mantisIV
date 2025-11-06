import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], // Adicione RouterLink e RouterLinkActive
  template: `
    <div class="app-container" *ngIf="!isLoginPage">
      <div class="sacola-sidebar">
        <div class="sacola-header">
          <a routerLink="/inicio" class="sacola-brand">
            <span class="sacola-logo-text">Sacola Cheia</span>
          </a>
        </div>

        <div class="sacola-menu">
          <div class="sacola-caption">MENU PRINCIPAL</div>
          <a routerLink="/inicio" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">🏠</span>
            <span>Início</span>
          </a>

          <div class="sacola-caption">ORÇAMENTOS</div>
          <a routerLink="/orcamento/novo" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">📝</span>
            <span>Novo</span>
          </a>
          <a routerLink="/orcamentos" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">💰</span>
            <span>Gerenciar</span>
          </a>

          <div class="sacola-caption">CADASTROS</div>
          <a routerLink="/cadastros/clientes" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">👥</span>
            <span>Clientes</span>
          </a>
          <a routerLink="/cadastros/funcionarios" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">👔</span>
            <span>Funcionários</span>
          </a>
          <a routerLink="/cadastros/produtos" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">🍎</span>
            <span>Produtos</span>
          </a>

          <div class="sacola-caption">RELATÓRIOS</div>
          <a routerLink="/relatorios/produtos" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">📊</span>
            <span>Produtos</span>
          </a>
          <a routerLink="/relatorios/pedidos" routerLinkActive="active" class="sacola-link">
            <span class="sacola-icon">📦</span>
            <span>Pedidos</span>
          </a>
          <a routerLink="/relatorios/clientes" routerLinkActive="active" class="sacola-link">
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
      cursor: pointer;
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
      cursor: pointer;
    }

    .sacola-link:hover {
      background: rgba(82, 199, 107, 0.15);
      transform: translateX(5px);
    }

    .sacola-link.active {
      background: rgba(82, 199, 107, 0.25);
      border-left: 4px solid #52c76b;
      font-weight: 600;
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
      min-height: 100vh;
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
