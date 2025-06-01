import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import WriteupCard from "@/components/WriteupCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { getAllWriteups, WriteupFrontmatter } from '@/lib/markdown';

const Writeups = () => {
  const [writeups, setWriteups] = useState<WriteupFrontmatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWriteups = async () => {
      try {
        const data = await getAllWriteups();
        setWriteups(data);
      } catch (err) {
        console.error('Error loading writeups:', err);
        setError('Failed to load writeups');
      } finally {
        setLoading(false);
      }
    };

    loadWriteups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-gray-100">
        <Header />
        <div className="flex-grow">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="h-10 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-transparent border border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-6 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/6 animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-gray-700 rounded w-1/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-gray-100">
        <Header />
        <div className="flex-grow">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-red-500 mb-4">Error</div>
              <div className="text-xl text-gray-300">{error}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />

      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Writeups
            </h1>
            <p className="text-lg text-gray-300"></p>
          </div>

          {/* Writeups Grid */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl">
            {writeups.map((writeup, index) => (
              <WriteupCard
                key={writeup.id}
                id={writeup.id}
                title={writeup.title}
                category={writeup.category}
                description={writeup.description || ''}
                date={writeup.date}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer className="border-t border-gray-800 bg-black py-2">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <div className="flex justify-center space-x-6 mb-2">
        <a
          href="https://github.com/screensguard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a
          href="https://ctftime.org/user/79947"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faFlag} size="lg" />
        </a>
        <a
          href="https://x.com/Rudrakshsaini2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
      </div>
      <p className="text-gray-400 text-sm mb-0">© screenguard 2025. All rights reserved.</p>
    </div>
  </footer>
);

export default Writeups;
