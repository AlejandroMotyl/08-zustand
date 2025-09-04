import { QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import { fetchNotes } from "@/lib/api";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Notes({ params }: NotesProps) {
  const { slug } =  await params;
  const tag = slug[0]
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag], 
    queryFn: () => fetchNotes(tag),
  })

  return (
   <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}