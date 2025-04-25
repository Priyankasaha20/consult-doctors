// types.ts
export interface Doctor {
  id: string;
  name: string;
  // your JSON uses `specialities: [{ name: string }]`
  specialities: { name: string }[];
  fees: string;               // e.g. "₹ 500"
  experience: string;         // e.g. "13 Years of experience"
  video_consult: boolean;
  in_clinic: boolean;

}
