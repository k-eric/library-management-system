import { Routes, Route } from 'react-router-dom';
import { ReadingListProvider } from './context/ReadingListContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SpaceBookingPage from './pages/SpaceBookingPage.jsx';
import ReadingListPage from './pages/ReadingListPage.jsx';

export default function App() {
  return (
    <ReadingListProvider>
      <div className="min-h-screen bg-slate-50 text-sm text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/reading-list"
              element={
                <ProtectedRoute>
                  <ReadingListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/spaces/book"
              element={
                <ProtectedRoute>
                  <SpaceBookingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ReadingListProvider>
  );
}