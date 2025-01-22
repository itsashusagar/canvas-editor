import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, User, Mail } from 'lucide-react';
import { useImageStore } from '../../store/imageStore';

const UNSPLASH_ACCESS_KEY = '2itLY6VKNEBIJVPuv0fFDFQ_j4elH6JcNwTRF2-OUw4';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

const ImageSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setSelectedImage } = useImageStore();

  const { data: images, isLoading, error, refetch } = useQuery({
    queryKey: ['images', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      return data.results as UnsplashImage[];
    },
    enabled: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <div className="text-gray-900">Ashu Sagar</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <div className="text-gray-900">itsashusagar@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Image Search and Editor</h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your search term"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mt-6">
          Error fetching images. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {images?.map((image) => (
          <div
            key={image.id}
            className="relative group overflow-hidden rounded-lg shadow-lg bg-white aspect-[4/3]"
          >
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(image.urls.regular)}
                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              >
                Add Caption
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white bg-black bg-opacity-50">
              Photo by {image.user.name}
            </div>
          </div>
        ))}
      </div>

      {images?.length === 0 && searchQuery && !isLoading && (
        <div className="text-center text-gray-500 mt-8">
          No images found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default ImageSearch;