import { redirect } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';

export default async function HomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let isValid = false;

  try {
    const res = await axiosInstance.get(`/api/restaurants/v1/public/by-slug/${slug}/menu/`);
    if (res.status === 200) {
      isValid = true;
    }
  } catch (error) {
    isValid = false;
  }

  if (!isValid) {
    redirect('/restaurant');
  } else {
    redirect(`/restaurant/${slug}/menu`);
  }
}
