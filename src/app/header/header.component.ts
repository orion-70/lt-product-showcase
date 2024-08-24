import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    InputTextModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  items: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            {
          label:'Home',
          icon:'pi pi-fw pi-home',
          routerLink: '/'
          },
          {
            label: 'Products',
            icon: 'pi pi-fw pi-objects-column',
            routerLink: '/product-list'
          }
        ];
    }
}
