"use client";
import "../../flow/config";
import * as fcl from "@onflow/fcl";
import Logo from "@/components/Logo";
import { CircleDollarSign, Dot, Lock, Wallet } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";
import { useParams } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { useEffect, useState } from "react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { getPublicPosts } from "@/flow/scripts";
import LogoFLow from "@/components/LogoFlow";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function Page() {
  const { author } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicPosts(author).then((res) => {
      setPosts(res);
    });
  }, [author]);

  return (
    <>
      {loading && <Loader />}

      <Navbar />

      <section className="bg-lime py-12 rounded-b-2xl">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-bold text-2xl mb-3">All Posts By</h1>
          <div className={`text-primary-800 font-bold flex flex-col items-center gap-2 ${mono.className}`}>
            <img
              src={`https://source.boringavatars.com/beam/120/${author}?colors=DEECA3,f4a261,e76f51`}
              alt="Photo"
              className="w-16 h-16 rounded-full border-4 border-primary-800"
            />
            <span className="text-lg">{author}</span>
          </div>
        </div>
      </section>

      <section className="my-20">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {posts.map((i) => (
                <Link href={`/${author}/${i.id}`} className="bg-white rounded-md shadow border hover:shadow-xl transition-all flex flex-col" key={i.id}>
                  <img
                    src={`${i?.image?.replace("https://ipfs.io", "https://nftstorage.link")}`}
                    alt="Thumb"
                    className="shrink-0 w-full aspect-video object-cover rounded-t-md"
                  />
                  <div className="p-4 rounded-b-md flex flex-col flex-1">
                    <h6 className="flex-1 font-bold mb-3">{i.title}</h6>
                    <div className="shrink-0 flex items-center justify-between border-t border-gray-100 pt-3">
                      <p className={`text-sm text-gray-500 font-medium`}>{moment(parseInt(i.createDate * 1000)).format("MMM DD, YYYY")}</p>
                      <p className={`text-sm bg-gray-100 rounded px-1.5 py-1 flex items-center gap-1 font-bold ${mono.className}`}>
                        {parseFloat(i.price) > 0 ? (
                          <>
                            <span>{parseFloat(i.price)} </span>
                            <LogoFLow className="w-4 h-4" />
                          </>
                        ) : (
                          <span>Free</span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center">Data Not Found</div>
          )}
        </div>
      </section>
    </>
  );
}
