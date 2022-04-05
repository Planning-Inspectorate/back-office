declare module '@pins/platform' {
  export function validatePostcode(value: string): boolean;
}

export interface LocalPlanningDepartment {
  FID: number;
  LPA21CD: string;
  LPA21NM: string;
  Co_terminous: 'Y' | 'N';
}
