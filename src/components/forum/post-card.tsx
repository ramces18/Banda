
"use client";

import type { ForumPost } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Flag } from "lucide-react";

interface PostCardProps {
  post: ForumPost;
  canManage: boolean;
  onDelete: (post: ForumPost) => void;
  onReport: (post: ForumPost) => void;
}

const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function PostCard({ post, canManage, onDelete, onReport }: PostCardProps) {
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
          {createdAt ? format(createdAt.toDate(), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es }) : ''}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-end gap-2">
         <Button variant="ghost" size="sm" onClick={() => onReport(post)}>
            <Flag className="mr-2 h-4 w-4" />
            Reportar
        </Button>
        {canManage && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(post)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
