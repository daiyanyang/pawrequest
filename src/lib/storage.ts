import { PetRequest } from "./types";

const STORAGE_KEY = "pawrequest-requests";

export function getRequests(): PetRequest[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRequests(requests: PetRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function addRequest(request: PetRequest) {
  const requests = getRequests();
  requests.unshift(request);
  saveRequests(requests);
}

export function getRequest(id: string): PetRequest | undefined {
  return getRequests().find((r) => r.id === id);
}

export function claimRequest(id: string, responderName: string, responderContact: string) {
  const requests = getRequests().map((r) =>
    r.id === id
      ? { ...r, status: "claimed" as const, responderName, responderContact }
      : r
  );
  saveRequests(requests);
}
