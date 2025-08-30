
"use client";

import type { ForumPost } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PostCardProps {
  post: ForumPost;
}

const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function PostCard({ post }: PostCardProps) {
  const { authorName, content, createdAt, authorId } = post;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${authorId}`} />
            <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{authorName}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {format(createdAt.toDate(), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}
