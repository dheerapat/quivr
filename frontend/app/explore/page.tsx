"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import DocumentItem from "./DocumentItem";
import { Document } from "./types";
import Button from "../components/ui/Button";
import Link from "next/link";
import Spinner from "../components/ui/Spinner";
import { AnimatePresence } from "framer-motion";
import { useSupabase } from "../supabase-provider";
import { redirect } from "next/navigation";



export default function ExplorePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isPending, setIsPending] = useState(true);
  const { supabase, session } = useSupabase();
  if (session === null) {
    redirect('/login')
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsPending(true);
    try {
      console.log(
        `Fetching documents from ${process.env.NEXT_PUBLIC_BACKEND_URL}/explore`
      );
      const response = await axios.get<{ documents: Document[] }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/explore`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents", error);
      setDocuments([]);
    }
    setIsPending(false);
  };

  return (
    <main>
      <section className="w-full outline-none pt-20 flex flex-col gap-5 items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center my-10">
          <h1 className="text-3xl font-bold text-center">Explore uploaded data</h1>
          <h2 className="opacity-50">View or delete stored data used by your brain</h2>
        </div>
        {isPending ? (
          <Spinner />
        ) : (
          <div className="w-full max-w-xl flex flex-col gap-5">
            {documents.length !== 0 ? (
              <AnimatePresence>
                {documents.map((document) => (
                  <DocumentItem
                    key={document.name}
                    document={document}
                    setDocuments={setDocuments}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center mt-10 gap-1">
                <p className="text-center">Oh No, Your Brain is empty.</p>
                <Link href="/upload">
                  <Button>Upload</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
