"use client"

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

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

export const RichTextEditor = React.forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, className, ...props }, ref) => {
    return (
        <div className={cn(
            "bg-background rounded-md border border-input text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
             className
        )}>
            <ReactQuill
                ref={ref}
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
