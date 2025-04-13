export const UnitTypes = {
  SquareMeter: 'SquareMeter',
  LinearMeter: 'LinearMeter',
  WaterEndpoints: 'WaterEndpoints',
  ElectricalEndpoints: 'ElectricalEndpoints',
  Number: 'Number',
} as const;

export type UnitType = keyof typeof UnitTypes;

export const UnitTypeLabels: Record<UnitType, string> = {
  SquareMeter: $localize`:@@unitTypes.squareMeter:Square Meter`,
  LinearMeter: $localize`:@@unitTypes.linearMeter:Linear Meter`,
  WaterEndpoints: $localize`:@@unitTypes.waterEndpoints:Water Endpoints`,
  ElectricalEndpoints: $localize`:@@unitTypes.electricalEndpoints:Electrical Endpoints`,
  Number: $localize`:@@unitTypes.number:Number`,
};
