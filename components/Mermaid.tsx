'use client';

import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

interface MermaidProps {
  diagram: string;
}

export default function Mermaid({ diagram }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.contentLoaded();
    }
  }, [diagram]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center my-8 p-4 rounded-lg overflow-x-auto"
    >
      <div className="mermaid">{diagram}</div>
    </div>
  );
}