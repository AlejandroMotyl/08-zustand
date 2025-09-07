import { QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";

type NoteDetailsProps = {
  params:Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NoteDetailsProps) {
  const { id } = await params;
  const note = await fetchNoteById(id)

  return {
    title: note.title,
    description: note.content.slice(0, 30) + "...",
        openGraph: {
    title: `${note.title} page`,
    description: note.content.slice(0, 30) + "...",
    url: ``,
    images: [
      {
        url: "../public/images/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
  }
}

export default async function NoteDetails({params}:NoteDetailsProps) {
    const queryClient = new QueryClient();
    const { id } =  await params;
    
  await queryClient.prefetchQuery({
    queryKey: ['IDnote', id], 
    queryFn: () => fetchNoteById(id),
  })

  return (
   <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}