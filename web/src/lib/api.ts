export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type Gathering = {
  slug: string;
  title: string;
  dates: string[];
  timezone: string;
  topics: string[];
};

export type CreateGatheringInput = {
  title: string;
  dates: string[];
  timezone: string;
  topics: string[];
};

export async function createGathering(
  input: CreateGatheringInput,
): Promise<Gathering> {
  const res = await fetch(`${API_URL}/api/gatherings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`API responded with ${res.status}`);
  }
  return res.json();
}
