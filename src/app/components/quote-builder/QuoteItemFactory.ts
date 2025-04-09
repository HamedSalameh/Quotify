import { QuoteItem } from '../../models/QuoteItem';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { UnitTypes } from '../../models/UnitTypes';


export class QuoteItemFactory {
  constructor() { }

  private static readonly DEFAULTS: Record<string, { label: string; unitType: UnitTypes }> = {
    constructionAndDemolition: { label: 'Construction and Demolition', unitType: UnitTypes.SquareMeter },
    furnitureLayout: { label: 'Furniture Layout', unitType: UnitTypes.SquareMeter },
    electricalPlan: { label: 'Electrical Plan', unitType: UnitTypes.SquareMeter },
    plumbingPlan: { label: 'Plumbing Plan', unitType: UnitTypes.WaterEndpoints },
    hvacPlan: { label: 'HVAC Plan', unitType: UnitTypes.Number },
    ceilingAndLightingPlan: { label: 'Ceiling and Lighting Plan', unitType: UnitTypes.SquareMeter },
    kitchenCarpentry: { label: 'Kitchen Carpentry', unitType: UnitTypes.SquareMeter },
    dressingRoomCarpentry: { label: 'Dressing Room Carpentry', unitType: UnitTypes.SquareMeter },
    decorativeWalls: { label: 'Decorative Walls', unitType: UnitTypes.SquareMeter }
  };

  public static createLine(itemType: string): QuoteItem {
    const defaults = this.DEFAULTS[itemType];

    const label = defaults?.label ?? itemType; // Use itemType as fallback label
    const unitType = defaults?.unitType ?? UnitTypes.Number;
  
    return this.createLineWithDefaults(label, unitType);
  }

  private static createLineWithDefaults(label: string, unitType: UnitTypes): QuoteItem {
    return {
      item: label,
      unitType,
      units: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      active: false,
    };
  }
}
