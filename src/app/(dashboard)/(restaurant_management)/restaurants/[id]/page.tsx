import RestaurantManagePanel from "@/components/restaurant/RestaurantManagePanel";

interface Props {
  params: Promise<{ id: string }>;
}

async function SpecificRestaurantView({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <RestaurantManagePanel restaurantId={id} />
    </div>
  );
}

export default SpecificRestaurantView;
