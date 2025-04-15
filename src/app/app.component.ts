import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet, ButtonModule, MenubarModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Quotify';
  // localized strings
  menuLabel = $localize`:@@app.menuLabel: Menu`;
  settingsLabel = $localize`:@@app.settingsLabel: Settings`;
  quoteBuilderLabel = $localize`:@@app.quoteBuilderLabel: Quote Builder`;
  aboutLabel = $localize`:@@app.aboutLabel: About`;

  menuItems = [
    { label: this.quoteBuilderLabel, icon: 'pi pi-fw pi-file', routerLink: '/quote-builder' },
    { label: this.settingsLabel, icon: 'pi pi-fw pi-cog', routerLink: '/settings' },
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
