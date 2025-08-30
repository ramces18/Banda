
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Foro de Discusión</h1>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Foro de la Banda</CardTitle>
                    <CardDescription>Un espacio para discutir temas, compartir ideas y colaborar.</CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
