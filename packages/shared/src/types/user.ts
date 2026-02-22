export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  defaultSugarLevel?: string;
  defaultIceLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}
