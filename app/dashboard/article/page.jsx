"use client";

import { getMyPosts } from "@/flow/scripts";
import { useUserStore } from "@/utils/store";
import { Edit, Eye, Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Source_Code_Pro } from "next/font/google";
import { Dialog, Transition } from '@headlessui/react'
import { deletePost } from "@/flow/transactions";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import { orderBy, sortBy } from "lodash";

const mono = Source_Code_Pro({ subsets: ["latin"] });

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const user = useUserStore((state) => state.user);
  const [deletingPost, setDeletingPost] = useState(undefined)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (!user?.loggedIn) {
    return router.push("/");
  }

  const fetchMyPosts = async () => {
    const data = await getMyPosts(user?.addr);
    setPosts(orderBy(data, ['createDate'], ['desc']));
  };

  const handleDeletePost = async (postID) => {
    setLoading(true);

    await deletePost(postID)
      .then(async (res) => {
        setLoading(false);
        return toast.success("Your post has been deleted");
      })
      .catch((err) => {
        setLoading(false);
        return toast.error("Error occured");
      });

    setTimeout(() => {
      fetchMyPosts();
    }, 2000);
  }

  return (
    <>
      {loading && <Loader />}

      <h2 className="font-bold text-xl mb-6">My Articles</h2>
      <table className="w-full bg-white border rounded-md shadow-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left px-3 py-2">Title</th>
            <th className="px-3 py-2 text-right">Price</th>
            <th className="text-left px-3 py-2">Published at</th>
            <th className="text-left px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="text-dark/80">
          {posts.length > 0 ? (
            <>
          {posts.map((i) => (
            <tr key={i.id} className="hover:bg-gray-50 transition-all border-b border-gray-100">
              <td className="px-3 py-4">
                <Link
                  href={`/${i.author}/${i.id}`}
                  className="underline underline-offset-4 decoration-dashed hover:decoration-primary-800 hover:decoration-solid hover:text-primary-800"
                >
                  {i.title.substr(0, 50)} {i.title.length > 50 && "...."}
                </Link>
              </td>
              <td className={`px-3 py-4 text-right font-bold ${mono.className}`}>
                <span className="text-primary-800">{parseFloat(i.price).toFixed(2)} FLOW</span>
              </td>
              <td className="px-3 py-4">{moment(parseInt(i.createDate * 1000)).format("MMM DD, YYYY")}</td>
              <td>
                <div className="flex items-center justify-center gap-2">
                  <button className="p-2 rounded-md bg-primary-800 text-lime" onClick={() => toast.error("This features is coming very soon")}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md bg-danger-500 text-white" onClick={() => setDeletingPost(i.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
            </>
          ) : (
            <tr>
              <td colSpan={4} className="px-3 py-4">
              <p>You don&apos;t have any posts, <Link className="text-primary-800 underline" href="/dashboard/article/new">create new</Link></p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Transition appear show={deletingPost !== undefined} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setDeletingPost(undefined)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This post will delete permanently
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleDeletePost(deletingPost)}
                    >
                      Yes, delete post
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-primary-800 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setDeletingPost(undefined)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
