// components/DoctorCard.tsx
import { getSpecs } from '@/lib/getSpecs';

export default function DoctorCard({ d }: any) {
  return (
    <article data-testid="doctor-card" className="border rounded-lg p-4 shadow-sm">
      <h4 data-testid="doctor-name" className="font-semibold">
        {d.name}
      </h4>
      <p data-testid="doctor-specialty" className="text-sm text-slate-600">
        {getSpecs(d).join(', ')}
      </p>
      <p data-testid="doctor-experience" className="text-sm">
        {d.experience || 'Experience n/a'}
      </p>
      <p data-testid="doctor-fee" className="text-sm">
        {d.fees || 'Fee on request'}
      </p>
    </article>
  );
}
