
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
      <ReactMarkdown>{content}</ReactMarkdown>
    </ScrollArea>
  ) : (
    <div className={containerClasses}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
