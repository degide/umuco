
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MarkdownViewerProps {
  content: string;
  className?: string;
  maxHeight?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  className = '',
  maxHeight 
}) => {
  const containerClasses = `prose prose-sm sm:prose dark:prose-invert max-w-none ${className}`;
  
  return maxHeight ? (
    <ScrollArea className={`${containerClasses}`} style={{ maxHeight }}>
      <p dangerouslySetInnerHTML={{__html: content}}></p>
    </ScrollArea>
  ) : (
    <div className={containerClasses}>
      <p dangerouslySetInnerHTML={{__html: content}}></p>
    </div>
  );
};
