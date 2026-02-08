import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { addNewBook, deleteBook, editBook, getOneBook } from './API/services/BookService';
import { authenticateUser, logoutUser } from './API/services/Authentication';
import BooksPage from './pages/books/BooksPage';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './pages';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );

  // return BooksPage();

  // useEffect(() => {
  //   async function testServer(){
  //     await logoutUser();

  //     const isLoggedIn = await authenticateUser("chrezalvin@gmail.com", "password");

  //     if(!isLoggedIn){
  //       console.error("Failed to log in");
  //       return;
  //     }

  //     const newBook = await addNewBook({
  //       title: "The Interesting Fantasy",
  //       author: "chrez. A",
  //       edition: null,
  //       genre: "fantasy",
  //       isbn: null,
  //       language: "en",
  //       publication_year: 2001,
  //       publisher: "fictional books ltd.",
  //       summary: "A fantasy book about something really interesting.",
  //     });

  //     console.log(`added book: ${newBook.title} with id ${newBook.book_id}`);

  //     const newBookEdited = await editBook(newBook.book_id, {
  //       summary: "An edited summary for the interesting fantasy book.",
  //     })

  //     console.log(`edited book summary: ${newBookEdited.summary}`);

  //     const fetchedBook = await getOneBook(newBook.book_id);

  //     console.log(`fetched book summary: ${fetchedBook.summary}`);

  //     const deleted = await deleteBook(newBook.book_id);

  //     if(deleted)
  //       console.log(`deleted book with id ${newBook.book_id}`);
  //   }

  //   testServer()
  // }, [])

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
