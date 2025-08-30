
import type { Timestamp } from 'firebase/firestore';

export interface BandUser {
  id: string; // UID from Firebase Auth
  username: string;
  nombreCompleto: string;
  rol: 'lider' | 'dirigente' | 'miembro';
  fechaRegistro: Timestamp;
}

export interface Announcement {
  id: string;
  titulo: string;
  contenido: string;
  fecha: Timestamp;
  autor: string; // UID of author
  autorNombre?: string; // To display author name
  importancia: 'normal' | 'alta' | 'baja';
  imageUrl?: string; // Optional image for the announcement
}

export interface ForumTopic {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    createdAt: Timestamp;
    lastReplyAt: Timestamp;
    replyCount: number;
}

export interface ForumPost {
    id: string;
    topicId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Timestamp;
}
