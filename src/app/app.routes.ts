import { Routes } from '@angular/router';
import { QuoteBuilderComponent } from './components/quote-builder/quote-builder.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
    { path: '', redirectTo: 'quote-builder', pathMatch: 'full' },
    { path: 'quote-builder', component: QuoteBuilderComponent },
    { path: 'settings', component: SettingsComponent },
  ];
  
