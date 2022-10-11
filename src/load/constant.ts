export enum LoadStatus {
  GENERATED = 'generated',
  CANCELLED = 'cancelled',
  BOOKED = 'booked',
}

export enum VehicleType {
  OPEN_BODY_TRUCK = 'open_body_truck',
  DUMBER_HEAVY = 'dumber_heavy',
  TRAILER = 'traler',
}
export enum SubVehicleType {
  BOX_BODY = 'box_body',
  FLAT_BED = 'flat_bed',
}

export interface NumberOfWheels {
  number: number;
}

export interface VehicleRequirement {
  vehicleType: VehicleType;
  subVehicleType: SubVehicleType;
  numberOfWheels: NumberOfWheels[];
}
