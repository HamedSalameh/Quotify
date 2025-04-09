import { QuoteItem } from '../../models/QuoteItem';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { UnitTypes } from '../../models/UnitTypes';


export class QuoteItemFactory {
  constructor() { }

  public static createLine(itemType: QuoteItemTypes): QuoteItem {
    switch (itemType) {
      case QuoteItemTypes.ConstructionAndDemolition:
        return this.createLineWithDefaults('Construction and Demolition', UnitTypes.SquareMeter);
      case QuoteItemTypes.FurnitureLayout:
        return this.createLineWithDefaults('Furniture Layout', UnitTypes.SquareMeter);
      case QuoteItemTypes.ElectricalPlan:
        return this.createLineWithDefaults('Electrical Plan', UnitTypes.SquareMeter);
      case QuoteItemTypes.PlumbingPlan:
        return this.createLineWithDefaults('Plumbing Plan', UnitTypes.WaterEndpoints);
      case QuoteItemTypes.HVACPlan:
        return this.createLineWithDefaults('HVAC Plan', UnitTypes.Number);
      case QuoteItemTypes.CeilingAndLightingPlan:
        return this.createLineWithDefaults('Ceiling and Lighting Plan', UnitTypes.SquareMeter);
      case QuoteItemTypes.KitchenCarpentry:
        return this.createLineWithDefaults('Kitchen Carpentry', UnitTypes.SquareMeter);
      case QuoteItemTypes.DressingRoomCarpentry:
        return this.createLineWithDefaults('Dressing Room Carpentry', UnitTypes.SquareMeter);
      case QuoteItemTypes.DecorativeWalls:
        return this.createLineWithDefaults('Decorative Walls', UnitTypes.SquareMeter);
      default:
        throw new Error('Invalid item type');
    }
  }

  private static createLineWithDefaults(label: string, unitType: UnitTypes): QuoteItem {
    const quoteItem: QuoteItem = {
      item: label,
      unitType: unitType,
      units: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      active: false,
    };

    return quoteItem;
  }
}
