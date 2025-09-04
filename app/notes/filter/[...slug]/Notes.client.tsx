"use client";

import { useState } from 'react'
import css from "@/app/notes/filter/[...slug]/NotesPage.module.css"
import {useQuery} from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import NoNotesMessage from '@/components/NoNotesMessage/NoNotesMessage';
import { keepPreviousData } from '@tanstack/react-query';

type NotesClientProps = {
  tag: string;
};

export default function NotesClient({tag}:NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [modalIsOpen, setModalState] = useState<boolean>(false);



const { isLoading, isError, isFetching, data } = useQuery({
  queryKey: ['notes', page, query, tag],
  queryFn: () => fetchNotes(query, page, tag),
  placeholderData:keepPreviousData,
  refetchOnMount: false,
})

  
  const notes = (data && data.notes) ? data.notes : [];  
  const totalPages = (data && data.notes) ? data.totalPages : 1;  


  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  const onChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setQuery(event.target.value);
  }, 1000)


  return (
    <>
      <div className={css.app}>
        
	  <header className={css.toolbar}>
      <SearchBox onChange={onChange} query={query} />
		  <button className={css.button} onClick={() => openModal()} >Create note +</button>
      </header>
        
      
        {(isFetching || isLoading) ? (<Loader />)
        : (isError ) ? (<ErrorMessage />)
        : (notes.length === 0) ? (<NoNotesMessage />)
        : (<>
          {totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage} />} 
          <NoteList notes={notes} />
          </>)
          }

      {modalIsOpen && <Modal closeModal={closeModal}><NoteForm closeModal={closeModal} /></Modal>}

</div>

    </>
  )
}
