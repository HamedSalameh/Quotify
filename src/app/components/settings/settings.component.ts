import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { QuoteItemOptionConfig } from '../../models/QuoteItemOptionConfig';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings',
  imports: [ButtonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    
  }

  ResetConfiguration() {
    const quoteItems: QuoteItemOptionConfig[] = [
      { key: QuoteItemTypes.CeilingAndLightingPlan, base_price: 25 },
      { key: QuoteItemTypes.ConstructionAndDemolition, base_price: 20 },
      { key: QuoteItemTypes.DressingRoomCarpentry, base_price: 50 },
      { key: QuoteItemTypes.ElectricalPlan, base_price: 25 },
      { key: QuoteItemTypes.FurnitureLayout, base_price: 10 },
      { key: QuoteItemTypes.HVACPlan, base_price: 200 },
      { key: QuoteItemTypes.KitchenCarpentry, base_price: 150 },
      { key: QuoteItemTypes.PlumbingPlan, base_price: 400 },
      { key: QuoteItemTypes.DecorativeWalls, base_price: 50 }
    ];

    this.settingsService.saveConfiguration(quoteItems)
      .then(() => console.log('Configuration saved successfully!'))
      .catch(error => console.error('Error saving configuration: ', error));

    alert('Configuration saved successfully!');
  }
}


