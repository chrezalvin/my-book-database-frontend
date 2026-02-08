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
}

export default App;
