import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import WriteupCard from "@/components/WriteupCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { getAllWriteups, WriteupFrontmatter } from '@/lib/markdown';

const Index = () => {
  const [writeups, setWriteups] = useState<WriteupFrontmatter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWriteups = async () => {
      try {
        const data = await getAllWriteups();
        setWriteups(data);
      } catch (error) {
        console.error('Error loading writeups:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWriteups();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            {/* Profile Image */}
            <img 
              src="/images/ascii_art.png" 
              alt="screenguard profile" 
              className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg"
            />
            
            {/* Name and Description */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              screenguard
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              :3
            </p>
          </div>
        </section>
      {/* Recent Writeups Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-100 mb-3">Recent Writeups</h2>
          <p className="text-gray-400">
            {loading ? 'Loading writeups...' : `${writeups.length} writeups available`}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          {loading ? (
            // Loading skeleton
            Array(3).fill(null).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-800 rounded-lg p-6">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            writeups.map((writeup) => (
              <WriteupCard
                key={writeup.id}
                id={writeup.id}
                title={writeup.title}
                category={writeup.category}
                description={writeup.description || ''}
                date={writeup.date}
              />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://github.com/screensguard" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </a>
            <a href="https://ctftime.org/user/79947" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faFlag} size="lg" />
            </a>
            <a href="https://x.com/Rudrakshsaini2" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">© screenguard 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
