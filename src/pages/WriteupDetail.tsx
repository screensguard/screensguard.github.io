import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { faScrewdriver } from "@fortawesome/free-solid-svg-icons";
import { getWriteup, WriteupContent } from '@/lib/markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";


const getCategoryStyle = (cat: string): { icon: any; color: string } => {
  switch (cat.toLowerCase()) {
    case 'web':
      return {
        icon: faScrewdriver,
        color: 'text-blue-400'
      };
    case 'forensics':
      return {
        icon: faScrewdriver,
        color: 'text-green-400'
      };
    case 'crypto':
      return {
        icon: faScrewdriver,
        color: 'text-yellow-400'
      };
    case 'reverse':
      return {
        icon: faScrewdriver,
        color: 'text-orange-400'
      };
    case 'misc':
      return {
        icon: faScrewdriver,
        color: 'text-pink-400'
      };
    default:
      return {
        icon: faScrewdriver,
        color: 'text-gray-400'
      };
  }
};

// Table of contents extraction from markdown
const extractTableOfContents = (content: string) => {
  const headings = content.match(/^#{1,6}\s.+$/gm) || [];
  return headings.map((heading, index) => {
    const level = heading.match(/^#{1,6}/)?.[0].length || 1;
    const text = heading.replace(/^#{1,6}\s/, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { id, text, level, index };
  });
};

const WriteupDetail = () => {
  const { id } = useParams();
  const [writeup, setWriteup] = useState<WriteupContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWriteup = async () => {
      if (!id) {
        setError('No writeup ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await getWriteup(id);
        if (!data) {
          setError('Writeup not found');
        } else {
          setWriteup(data);
        }
      } catch (err) {
        setError('Error loading writeup');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWriteup();
  }, [id]);

  const tableOfContents = extractTableOfContents(writeup?.content || '');
  const categoryStyle = getCategoryStyle(writeup?.frontmatter.category || '');

  const renderMarkdown = (content: string) => {
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    return content
      .split('\n')
      .map((line, index) => {
        // Code blocks
        if (line.startsWith('```')) {
          if (!inCodeBlock) {
            // Start of code block
            inCodeBlock = true;
            codeBlockLanguage = line.slice(3).trim();
            codeBlockContent = '';
            return null;
          } else {
            // End of code block
            inCodeBlock = false;
            const content = codeBlockContent;
            codeBlockContent = '';
            return (
              <pre key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg my-4">
                <code className="text-sm font-mono text-gray-200">{content}</code>
              </pre>
            );
          }
        }

        if (inCodeBlock) {
          codeBlockContent += line + '\n';
          return null;
        }

        // Headers
        if (line.startsWith('# ')) {
          const text = line.replace('# ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h1 key={index} id={id} className="text-3xl font-bold text-gray-100 mt-8 mb-4">{text}</h1>;
        }
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h2 key={index} id={id} className="text-2xl font-semibold text-gray-200 mt-6 mb-3">{text}</h2>;
        }
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return <h3 key={index} id={id} className="text-xl font-semibold text-gray-300 mt-5 mb-2">{text}</h3>;
        }

        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-gray-700 pl-4 my-4 italic text-gray-400">
              {line.slice(2)}
            </blockquote>
          );
        }
        
        // Images
        if (line.startsWith('![')) {
          const match = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            const [, alt, src] = match;
            // Handle both relative and absolute image paths
            const imagePath = src.startsWith('/')
              ? src
              : `/content/writeups/${id}/images/${src}`;
            return (
              <div key={index} className="my-4">
                <img 
                  src={imagePath}
                  alt={alt || ''} 
                  className="max-w-full rounded-lg border border-gray-700"
                />
              </div>
            );
          }
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-300 ml-4 mb-2">• {line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <li key={index} className="text-gray-300 ml-4 mb-2">{line}</li>;
        }
        
        // Inline code
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <p key={index} className="text-gray-300 leading-relaxed mb-4">
              {parts.map((part, i) => 
                i % 2 === 0 ? 
                  part : 
                  <code key={i} className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200">{part}</code>
              )}
            </p>
          );
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('`')) {
          return <p key={index} className="text-gray-300 leading-relaxed mb-4">{line}</p>;
        }
        
        return <br key={index} />;
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-transparent border border-gray-700 rounded-lg p-6">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-transparent border border-gray-700 rounded-lg p-8">
                <div className="mb-8 pb-6 border-b border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-8 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/6 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !writeup) {
    return (
      <div className="min-h-screen bg-black text-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold text-red-500 mb-4">Error</div>
            <div className="text-xl text-gray-300 mb-8">{error || 'Writeup not found'}</div>
            <Link 
              to="/writeups" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Writeups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-transparent border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-100 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
  {tableOfContents.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      onClick={e => {
        e.preventDefault();
        const el = document.getElementById(item.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
      className={`block text-sm hover:text-gray-100 transition-colors ${
        item.level === 1 ? 'font-medium text-gray-100' : 
        item.level === 2 ? 'text-gray-300 pl-3' : 'text-gray-400 pl-6'
      }`}
    >
      {item.text}
    </a>
  ))}
</nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-transparent border border-gray-700 rounded-lg p-8">
              {/* Header */}
              <div className="mb-8 pb-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="mb-3">
                    <Badge className="bg-transparent border border-gray-700 hover:bg-transparent px-3 py-1">
                      <FontAwesomeIcon 
                        icon={faScrewdriver} 
                        className={`${categoryStyle.color} mr-2 w-4 h-4`}
                      />
                      <span className={categoryStyle.color}>
                        {writeup.frontmatter.category.toLowerCase()}
                      </span>
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{writeup.frontmatter.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 line-clamp-2 mb-3">
                  {writeup.frontmatter.title}
                </h3>
                {writeup.frontmatter.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {writeup.frontmatter.description}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                {renderMarkdown(writeup.content)}
              </div>
            </article>
          </div>
        </div>
      </div>
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

export default WriteupDetail; 