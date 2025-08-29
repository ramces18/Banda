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
}
