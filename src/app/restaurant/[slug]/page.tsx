import { redirect } from 'next/navigation';

export default function HomePage({ params }: { params: { slug: string } }) {
  redirect(`/restaurant/${params.slug}/menu`);
}
