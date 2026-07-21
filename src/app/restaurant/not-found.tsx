import { redirect } from 'next/navigation';

export default function RestaurantNotFound() {
  redirect('/restaurant');
}
