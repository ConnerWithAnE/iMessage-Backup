import { Service } from "../types/service";

export interface Handle {
  ROWID: number;
  id: string;
  person_centric_id: string;
  service: Service;
}

export function createHandleInstance(): Handle {
  return {
      ROWID: 0,
      id: '',
      person_centric_id: '',
      service: 'iMessage',
  };
}

