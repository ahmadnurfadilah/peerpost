"use client";
import "../../../flow/config";
import * as fcl from "@onflow/fcl";
import Logo from "@/components/Logo";
import { CircleDollarSign, Coins, Dot, Lock, Wallet } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";
import { useParams } from "next/navigation";
import { useUserStore } from "@/utils/store";
import { useEffect, useState } from "react";
import { getPaidPostById, getPublicPostById } from "@/flow/scripts";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import Loader from "@/components/Loader";
import { purchasePost } from "@/flow/transactions";
import { toast } from "react-hot-toast";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function Page() {
  const { author, postId } = useParams();
  const [post, setPost] = useState();
  const [description, setDescription] = useState();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [balance, setBalance] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => fcl.currentUser.subscribe(setUser), [setUser]);

  useEffect(() => {
    getPublicPostById(author, postId).then((res) => {
      setPost(res);
    });
  }, [author, postId]);

  useEffect(() => {

    if (post) {
      console.log(post);
      if (post?.description != null) {
        fetch("https://" + post?.description?.replace("https://ipfs.io/ipfs", "") + ".ipfs.dweb.link")
          .then((res) => res.json())
          .then((res) => setDescription(res?.content));
      }
    }

    if (user?.loggedIn) {
      fcl
        .send([fcl.getAccount(user?.addr)])
        .then(fcl.decode)
        .then((res) => setBalance(res.balance / 100000000));

      if (post) {
        if (parseInt(post.price) > 0 && !description ) {
          getPaidPostById(post.author, user.addr, post.id).then((res) => {
            if (res !== null) {
              setPost(res)
            }
          });
        }
      }
    }
  }, [user, post]);

  const handlePayPost = async () => {
    if (balance < post.price) {
      toast.dismiss();
      return toast.error("Your balance is not enough to make this purchase");
    }

    setLoading(true);
    try {
      const txId = await purchasePost(post.author, post.id, post.price);
      fcl.tx(txId).subscribe((e) => {
        if (e?.statusString != "") {
          toast.dismiss();
          toast.loading(e?.statusString);
        }
      });
      await fcl.tx(txId).onceSealed();
      toast.dismiss();
      toast.success("Purchased!");
      getPublicPostById(author, postId).then((res) => {
        setPost(res);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Error occured");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <nav className="relative z-10 inset-x-0 top-0 w-full h-16 border-b border-lime/10 flex items-center justify-center bg-primary-800 mb-10">
        <div className="container px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-6 text-lime hover:text-white" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {user && user.loggedIn ? (
              <Link className={`text-lime font-bold flex items-center gap-2 ${mono.className}`} href="/dashboard">
                <img
                  src={`https://source.boringavatars.com/beam/120/${user?.addr ?? 1}?colors=DEECA3,f4a261,e76f51`}
                  alt="Photo"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">{user?.addr}</span>
              </Link>
            ) : (
              <button
                onClick={() => fcl.authenticate()}
                className="flex items-center gap-2 font-bold text-sm text-primary-800 bg-lime px-6 py-3 rounded-md hover:shadow-lg hover:shadow-lime/20 hover:-translate-y-px transition-all hover:contrast-125 cursor-pointer"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <section className="max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-xs font-bold px-2 py-1 bg-primary-50 text-primary-800 rounded-full">{post?.readingTime} Min Read</span>
          {post ? (
            <div className={`flex items-center justify-center text-sm font-bold mt-2 mb-4 ${mono.className}`}>
              <p>
                By <span className="text-primary-500">{post?.author}</span>
              </p>{" "}
              <Dot /> <p>{moment(parseInt(post?.createDate * 1000)).format("MMM DD, YYYY")}</p>
            </div>
          ) : (
            <Skeleton />
          )}
          <h1 className="text-5xl font-bold mt-4 mb-4 leading-normal">{post?.title || <Skeleton />}</h1>
        </div>

        {post ? (
          <img src={`${post?.image?.replace("https://ipfs.io", "https://nftstorage.link")}`} alt="Thumb" className="w-full rounded-xl" />
        ) : (
          <Skeleton height={400} />
        )}

        {post ? (
          <div className="my-12">
            {description ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: description }}></div>
            ) : (
              <div className="w-full aspect-[5/1] relative">
                <Skeleton count={15} />
                <div className="flex items-center justify-center absolute inset-0 z-10 bg-white/10 backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="mx-auto" />
                    <h2 className="font-bold text-xl my-2">Premium Content</h2>
                    <p className="mb-4">Connect your Wallet & Pay to Read this Post</p>
                    {user && user.loggedIn ? (
                      <button
                        onClick={() => handlePayPost()}
                        className="flex items-center gap-2 mx-auto font-bold text-sm text-lime bg-primary-800 pl-4 pr-2 py-2 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125 cursor-pointer"
                      >
                        <CircleDollarSign className="w-5 h-5" />
                        <span className="font-bold">Pay Post</span>
                        <span className={`bg-lime text-primary-800 text-xs px-2 py-1 rounded-md ${mono.className}`}>{parseFloat(post?.price)} FLOW</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => fcl.authenticate()}
                        className="flex items-center gap-2 mx-auto font-bold text-sm text-lime bg-primary-800 px-6 py-3 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125 cursor-pointer"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Connect Wallet</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12">
            <Skeleton count={10} />
          </div>
        )}
      </section>
    </>
  );
}
