
"use client";

import { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { Suggestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, Archive, RotateCcw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function SuggestionForm() {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const { bandUser } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bandUser || content.trim().length < 10) {
             toast({
                variant: 'destructive',
                description: 'La sugerencia debe tener al menos 10 caracteres.',
            });
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'suggestions'), {
                content,
                isAnonymous,
                submittedBy: isAnonymous ? 'anonymous' : bandUser.id,
                submittedAt: serverTimestamp(),
                isArchived: false,
            });
            setContent('');
            setIsAnonymous(false);
            toast({ description: '¡Gracias por tu sugerencia!' });
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            toast({ variant: 'destructive', description: 'No se pudo enviar la sugerencia.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Buzón de Sugerencias</CardTitle>
                <CardDescription>
                    ¿Tienes una idea para mejorar la banda? Compártela aquí. Puede ser anónima si lo prefieres.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu sugerencia aquí..."
                        rows={5}
                        disabled={loading}
                    />
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="anonymous"
                            checked={isAnonymous}
                            onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))}
                            disabled={loading}
                        />
                        <Label htmlFor="anonymous">Enviar como anónimo</Label>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Sugerencia
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function SuggestionsList() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "suggestions"), orderBy("submittedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const suggestionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Suggestion));
            setSuggestions(suggestionsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching suggestions:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleToggleArchive = async (id: string, isArchived: boolean) => {
        const suggestionRef = doc(db, "suggestions", id);
        try {
            await updateDoc(suggestionRef, { isArchived: !isArchived });
            toast({ description: `Sugerencia ${!isArchived ? 'archivada' : 'restaurada'}.` });
        } catch (error) {
            toast({ variant: 'destructive', description: 'No se pudo actualizar la sugerencia.' });
        }
    };

    const activeSuggestions = useMemo(() => suggestions.filter(s => !s.isArchived), [suggestions]);
    const archivedSuggestions = useMemo(() => suggestions.filter(s => s.isArchived), [suggestions]);

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const renderSuggestionCard = (suggestion: Suggestion) => (
         <Card key={suggestion.id} className="bg-muted/50">
            <CardContent className="p-4">
                <p className="whitespace-pre-wrap">{suggestion.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/80 p-3 text-xs text-muted-foreground">
                <div>
                    <span>
                        {suggestion.isAnonymous ? "Anónimo" : "Miembro"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                        {suggestion.submittedAt ? formatDistanceToNow(suggestion.submittedAt.toDate(), { locale: es, addSuffix: true }) : ''}
                    </span>
                </div>
                 <Button variant="ghost" size="sm" onClick={() => handleToggleArchive(suggestion.id, suggestion.isArchived)}>
                    {suggestion.isArchived ? <RotateCcw className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                    {suggestion.isArchived ? 'Restaurar' : 'Archivar'}
                </Button>
            </CardFooter>
        </Card>
    )

    return (
        <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="archived">Archivadas</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
                <div className="space-y-4 mt-4">
                    {activeSuggestions.length > 0 ? (
                        activeSuggestions.map(renderSuggestionCard)
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No hay sugerencias activas.</p>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="archived">
                <div className="space-y-4 mt-4">
                    {archivedSuggestions.length > 0 ? (
                        archivedSuggestions.map(renderSuggestionCard)
                    ) : (
                         <p className="text-center text-muted-foreground py-8">No hay sugerencias archivadas.</p>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    );
}

export default function SuggestionsPage() {
    const { bandUser } = useAuth();
    const canManage = bandUser?.rol === 'lider' || bandUser?.rol === 'dirigente';

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                 <Lightbulb className="h-8 w-8 text-primary" />
                 <div>
                    <h1 className="text-3xl font-bold">Sugerencias</h1>
                    <p className="text-muted-foreground">Un espacio para compartir ideas y mejorar juntos.</p>
                </div>
            </div>
            
            <SuggestionForm />

            {canManage && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Sugerencias Recibidas</CardTitle>
                        <CardDescription>
                            Aquí puedes ver y gestionar las sugerencias enviadas por los miembros.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <SuggestionsList />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
