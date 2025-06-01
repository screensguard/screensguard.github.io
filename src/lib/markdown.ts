// Simple function to parse frontmatter manually
function parseFrontmatter(markdown: string): { data: any; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: markdown };
  }

  const [, frontmatter, content] = match;
  const data: any = {};
  
  // Parse the YAML-like frontmatter
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      data[key.trim()] = value;
    }
  });

  return { data, content: content.trim() };
}

export interface WriteupFrontmatter {
  id: string;
  title: string;
  category: string;
  date: string;
  description?: string;
}

export interface WriteupContent {
  frontmatter: WriteupFrontmatter;
  content: string;
}

export async function getWriteup(id: string): Promise<WriteupContent | null> {
  try {
    console.log('Attempting to fetch writeup:', id);
    
    // First fetch the metadata from index.json
    const indexResponse = await fetch('/content/writeups/index.json');
    if (!indexResponse.ok) {
      console.error('Failed to fetch index.json');
      return null;
    }
    
    const writeups = await indexResponse.json();
    const writeupMeta = writeups.find((w: WriteupFrontmatter) => w.id === id);
    if (!writeupMeta) {
      console.error('Writeup not found in index.json');
      return null;
    }
    
    // Then fetch the markdown content
    const rootPath = `/content/writeups/${id}.md`;
    console.log('Trying root path:', rootPath);
    let response = await fetch(rootPath);
    console.log('Root path response:', response.status, response.statusText);
    
    if (!response.ok) {
      console.log('Root path failed, returning null');
      return null;
    }
    
    const content = await response.text();
    console.log('Successfully loaded writeup:', id);
    
    return {
      frontmatter: writeupMeta,
      content
    };
  } catch (error) {
    console.error('Error loading writeup:', error);
    return null;
  }
}

export async function getAllWriteups(): Promise<WriteupFrontmatter[]> {
  try {
    console.log('Attempting to fetch all writeups');
    const response = await fetch('/content/writeups/index.json');
    console.log('Index response:', response.status, response.statusText);
    if (!response.ok) return [];
    
    const writeups = await response.json();
    console.log('Successfully loaded writeups:', writeups);
    return writeups;
  } catch (error) {
    console.error('Error loading writeups:', error);
    return [];
  }
} 