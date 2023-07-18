"use client";
import "../../flow/config";
import { getBuyers, getMyPosts, getPurchasedCount } from "../../flow/scripts";
import { useUserStore } from "../../utils/store";
import { Newspaper } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user?.loggedIn) {
      fetchMyPosts();
      getPurchasedCount(user.addr)
        .then((res) => setPurchasedCount(res));
    }
  }, [user]);

  if (!user?.loggedIn) {
    return router.push("/");
  }

  const fetchMyPosts = async () => {
    const data = await getMyPosts(user?.addr);
    setPosts(data);
  };

  return (
    <>
      <h1 className="font-bold text-xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="w-full bg-white rounded-md border p-4 md:p-6 shadow">
          <div className="flex items-center justify-between">
            <h4 className={`text-xl font-bold ${mono.className}`}>{posts.length}</h4>
            <Newspaper className="text-primary-800/20 w-8 h-8" />
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Total Posts</p>
        </div>
        <div className="w-full bg-white rounded-md border p-4 md:p-6 shadow">
          <div className="flex items-center justify-between">
            <h4 className={`text-xl font-bold ${mono.className}`}>{posts.filter((o) => parseFloat(o.price) == 0).length}</h4>
            <Newspaper className="text-primary-800/20 w-8 h-8" />
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Free Access Posts</p>
        </div>
        <div className="w-full bg-white rounded-md border p-4 md:p-6 shadow">
          <div className="flex items-center justify-between">
            <h4 className={`text-xl font-bold ${mono.className}`}>{posts.filter((o) => parseFloat(o.price) > 0).length}</h4>

            <Newspaper className="text-primary-800/20 w-8 h-8" />
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Paid Access Posts</p>
        </div>
        <div className="w-full bg-white rounded-md border p-4 md:p-6 shadow">
          <div className="flex items-center justify-between">
            <h4 className={`text-xl font-bold ${mono.className}`}>{purchasedCount}</h4>
            <Newspaper className="text-primary-800/20 w-8 h-8" />
          </div>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Purchased Count</p>
        </div>
      </div>
    </>
  );
}
