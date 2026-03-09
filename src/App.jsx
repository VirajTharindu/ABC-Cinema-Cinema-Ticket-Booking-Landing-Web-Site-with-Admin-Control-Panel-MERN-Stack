import React, { useEffect } from 'react'
import Layout from './components/Layout'
import Hero from './components/Hero'
import ThreeMovieCarousel from './components/Three/ThreeMovieCarousel'
import BookingView from './components/Booking/BookingView'
import AdminDashboard from './components/Admin/AdminDashboard'
import { useStore } from './store/useStore'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import UserProfile from './components/UserProfile'

import ErrorBoundary from './components/ErrorBoundary'
import Testimonials from './components/Testimonials'
import FeedbackForm from './components/FeedbackForm'

function App() {
    const view = useStore((state) => state.view);
    const setView = useStore((state) => state.setView);

    // Secret Admin Toggle: Alt + A
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key.toLowerCase() === 'a') {
                setView(view === 'admin' ? 'home' : 'admin');
            }
            if (e.altKey && e.key.toLowerCase() === 'p') {
                setView(view === 'profile' ? 'home' : 'profile');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [view, setView]);

    return (
        <Layout>
            <AnimatePresence mode="wait">
                {view === 'home' && (
                    <motion.div
                        key="home-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ErrorBoundary>
                            <Hero />
                        </ErrorBoundary>

                        <ErrorBoundary>
                            <ThreeMovieCarousel />
                        </ErrorBoundary>

                        <Testimonials />
                        <FeedbackForm />
                    </motion.div>
                )}

                {view === 'booking' && <BookingView key="booking-view" />}
                {view === 'admin' && <AdminDashboard key="admin-view" />}
                {view === 'profile' && <UserProfile key="profile-view" />}
            </AnimatePresence>

            <div
                className="fixed bottom-4 right-16 z-40 opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-2 bg-white/5 rounded-full"
                onClick={() => setView('profile')}
                title="User Profile (Alt+P)"
            >
                <User size={16} color="white" />
            </div>

            <div
                className="fixed bottom-4 right-4 z-40 opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-2 bg-white/5 rounded-full"
                onClick={() => setView('admin')}
                title="Admin Access (Alt+A)"
            >
                <Lock size={16} color="white" />
            </div>
        </Layout>
    )
}

export default App
