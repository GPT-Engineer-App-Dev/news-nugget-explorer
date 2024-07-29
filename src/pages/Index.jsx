import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Terminal } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typingEffect, setTypingEffect] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    const text = "Hacker News Terminal";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypingEffect(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="container mx-auto p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primary flex items-center">
        <Terminal className="mr-2" />
        <span className="font-mono">{typingEffect}</span>
        <span className="animate-pulse">|</span>
      </h1>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Initiate search protocol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input text-foreground border-primary"
        />
        <div className="absolute top-0 right-0 bottom-0 flex items-center pr-3">
          <span className="text-primary">&gt;</span>
        </div>
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <Card key={index} className="animate-pulse bg-card">
              <CardHeader>
                <div className="h-6 bg-secondary rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-secondary rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-destructive">Error: {error.message}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map((story) => (
            <Card key={story.objectID} className="bg-card border border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Upvotes: {story.points}</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-secondary text-primary hover:bg-primary hover:text-secondary"
                >
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    Access Data <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
