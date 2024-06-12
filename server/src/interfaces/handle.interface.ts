import { Service } from "../types/service";

export interface Handle {
  ROWID: number;
  id: string;
  person_centric_id: string;
  service: Service;
}

export interface HandleData {
  OLD_ROWID: number;
  id: string;
  country: string;
  service: string;
  uncanonicalized_id: string;
  person_centric_id: string;
}

export function createHandleInstance(): Handle {
  return {
      ROWID: 0,
      id: '',
      person_centric_id: '',
      service: 'iMessage',
  };
}

