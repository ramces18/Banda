import type { Timestamp } from 'firebase/firestore';

export interface BandUser {
  id: string; // UID from Firebase Auth
  username: string;
  nombreCompleto: string;
  rol: 'lider' | 'dirigente' | 'miembro';
  fechaRegistro: Timestamp;
  avatarStyle?: string; // e.g., 'micah', 'adventurer', etc.
  fcmTokens?: string[]; // For push notifications
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

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  type: 'Ensayo' | 'Acto Cívico' | 'Desfile' | 'Presentación' | 'Otro';
  createdBy: string; // UID of user who created it
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
    id:string;
    topicId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Timestamp;
}

export interface Report {
    id?: string;
    type: 'topic' | 'post';
    contentId: string; // ID of the topic or post
    contentParentId?: string; // topicId if it's a post
    reporterId: string;
    reporterName: string;
    reportedAt: Timestamp;
}

export interface Suggestion {
  id: string;
  content: string;
  submittedAt: Timestamp;
  submittedBy: string; // UID or 'anonymous'
  isAnonymous: boolean;
  isArchived: boolean;
}
