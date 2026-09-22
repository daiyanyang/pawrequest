export type PetRequest = {
  id: string;
  title: string;
  petType: string;
  description: string;
  price: number;
  posterName: string;
  posterContact: string;
  ownerId: string;
  createdAt: string;
  status: "open" | "claimed";
  responderName?: string;
  responderContact?: string;
};
