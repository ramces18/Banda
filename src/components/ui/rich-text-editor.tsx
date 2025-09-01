
"use client"

import React from 'react';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Skeleton } from './skeleton';

// Dynamically import ReactQuill to ensure it's only loaded on the client side.
const ReactQuill = dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => (
        <div className="space-y-2">
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[150px] w-full" />
        </div>
    )
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  [key: string]: any; 
}

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'color', 'background'
];

export const RichTextEditor = React.forwardRef<any, RichTextEditorProps>(
  ({ value, onChange, className, ...props }, ref) => {
    return (
        <div className={cn(
            "bg-background rounded-md border border-input text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
             className
        )}>
            <ReactQuill
                forwardedRef={ref}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                className="[&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-editor]:min-h-[150px]"
                {...props}
            />
        </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
