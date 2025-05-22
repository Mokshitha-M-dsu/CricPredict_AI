import React from 'react';

interface ResponseDisplayProps {
  response: string;
  color: string;
  title: string;
}

export function ResponseDisplay({ response, color, title }: ResponseDisplayProps) {
  return (
    <div className={`mt-4 p-4 ${color} rounded-md border`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="prose prose-sm max-w-none">
        {response.split('\n').map((line, i) => (
          <p key={i} className="mb-2">{line}</p>
        ))}
      </div>
    </div>
  );
}