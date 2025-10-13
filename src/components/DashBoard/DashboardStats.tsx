"use client";

import {
  Users,
  Store,
  Calendar,
  Zap,
  ZapOff,
  ShoppingCart,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 100, damping: 5 });
  const rounded = useTransform(spring, (latest) => Math.floor(latest));

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

interface Props {
  data: any;
}

export default function DashboardStats({ data }: Props) {
  const stats = data.data;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center  border rounded-sm overflow-hidden shadow w-full ">
          <div className="p-4 bg-green-400">
            <Users className="h-12 w-12 text-white" />
          </div>
          <div className="px-4  ">
            <h3 className="text-sm tracking-wider font-medium">Total Members</h3>
            <p className="text-3xl font-medium">
              <AnimatedNumber value={stats.total_member_count} />
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center  border rounded-sm overflow-hidden shadow w-full ">
          <div className="p-4 bg-[#B3A7B8]">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <div className="px-4  ">
            <h3 className="text-sm tracking-wider font-medium">Total active members</h3>
            <p className="text-3xl font-medium ">
              <AnimatedNumber value={stats.total_active_member_count} />
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center border rounded-sm overflow-hidden shadow w-full sm:">
          <div className="p-4 bg-[#D54B38]">
            <ZapOff className="h-12 w-12 text-white" />
          </div>
          <div className="px-4  ">
            <h3 className="text-sm tracking-wider font-medium">Total pending members</h3>
            <p className="text-3xl font-medium">
              <AnimatedNumber value={stats.total_pending_member_count} />
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center  border rounded-sm overflow-hidden shadow w-full sm:">
          <div className="p-4 bg-[#ED983B]">
            <Store className="h-12 w-12 text-white" />
          </div>
          <div className="px-4">
            <h3 className="text-sm tracking-wider font-medium">Total Restaurants</h3>
            <p className="text-3xl font-medium">
              <AnimatedNumber value={stats.total_restaurants_count} />
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center  border rounded-sm overflow-hidden shadow w-full sm:">
          <div className="p-4 bg-[#315047]">
            <ShoppingCart className="h-12 w-12 text-white" />
          </div>
          <div className="px-4  ">
            <h3 className="text-sm tracking-wider font-medium">Total products</h3>
            <p className="text-3xl font-medium">
              <AnimatedNumber value={stats.total_products_count} />
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center  border rounded-sm overflow-hidden shadow w-full sm:">
          <div className="p-4 bg-[#AC8D72]">
            <Calendar className="h-12 w-12 text-white" />
          </div>
          <div className="px-4  ">
            <h3 className="text-sm tracking-wider font-medium">Total events</h3>
            <p className="text-3xl font-medium">
              <AnimatedNumber value={stats.total_events_count} />
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
