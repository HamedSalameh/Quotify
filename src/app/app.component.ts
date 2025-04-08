import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, MenubarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Quotify';
  menuItems = [
    { label: 'Quote Builder', icon: 'pi pi-fw pi-file', routerLink: '/quote-builder' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: '/settings' },
  ];
  selectedMenuItem: any = null;

  constructor(private primeng: PrimeNG) {
    // Initialize the application
    this.initializeApp();
  }

  initializeApp() {
    // Perform any necessary initialization here
    this.primeng.ripple.set(true);
    console.log('Application initialized!');
  }
}
