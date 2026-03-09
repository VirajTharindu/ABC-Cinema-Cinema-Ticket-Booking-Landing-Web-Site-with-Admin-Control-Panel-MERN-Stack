import { Movie } from '../domain/types';

export const movies: Movie[] = [
    {
        id: 1,
        title: "The Silent Watcher",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
        genre: "Sci-Fi Thriller",
        price: 18.50,
        rating: 4.8,
        duration: "142 min"
    },
    {
        id: 2,
        title: "Neon Horizon",
        image: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?q=80&w=1000&auto=format&fit=crop",
        genre: "Cyberpunk Action",
        price: 22.00,
        rating: 4.9,
        duration: "128 min"
    },
    {
        id: 3,
        title: "Echoes of Eternity",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop",
        genre: "Space Odyssey",
        price: 25.00,
        rating: 5.0,
        duration: "165 min"
    },
    {
        id: 4,
        title: "Shadow Protocol",
        image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
        genre: "Espionage",
        price: 15.00,
        rating: 4.6,
        duration: "115 min"
    }
];
