import { Service } from "../types/service";

export interface PersonID {
  ROWID: number;
  id: string;
  person_centric_id: string;
  service: Service;
}

export function createPersonIDInstance(): PersonID {
  return {
      ROWID: 0,
      id: '',
      person_centric_id: '',
      service: 'iMessage',
  };
}

