export type PetRequest = {
  id: string;
  title: string;
  pet_type: string;
  description: string;
  price: string;
  status: "open" | "claimed";
  poster_id: string;
  poster_name: string;
  poster_contact: string;
  responder_id: string | null;
  responder_name: string | null;
  responder_contact: string | null;
  created_at: string;
};
