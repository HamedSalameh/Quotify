import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Quotify';

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
