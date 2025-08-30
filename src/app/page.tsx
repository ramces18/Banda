
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowRight, BookOpen, MessageSquare, Music } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
    {
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        title: "Anuncios Oficiales",
        description: "Mantente al día con las últimas noticias, eventos y comunicados importantes de la banda.",
    },
    {
        icon: <Music className="h-8 w-8 text-primary" />,
        title: "Biblioteca de Partituras",
        description: "Accede a todas las partituras y arreglos musicales de la banda en un solo lugar.",
    },
    {
        icon: <MessageSquare className="h-8 w-8 text-primary" />,
        title: "Foro de Discusión",
        description: "Comparte ideas, haz preguntas y colabora con otros miembros de la banda.",
    },
];

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
                <Logo />
                <Button asChild>
                    <Link href="/login">
                        Iniciar Sesión
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Portal de Gestión para La Banda del IDI
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Un espacio centralizado para anuncios, partituras, discusiones y más. Todo lo que necesitas para estar conectado con la banda.
                                    </p>
                                </div>
                                <Button asChild size="lg" className="w-fit">
                                    <Link href="/login">
                                        Acceder al Portal
                                    </Link>
                                </Button>
                            </div>
                            <Image
                                src="https://picsum.photos/1200/800"
                                width="1200"
                                height="800"
                                alt="Hero"
                                data-ai-hint="marching band"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                            />
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Funcionalidades</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Todo lo que la Banda Necesita</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Desde la comunicación oficial hasta la colaboración entre miembros, nuestro portal lo tiene todo.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
                            {features.map((feature, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className="mb-4">{feature.icon}</div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} La banda del IDI. Todos los derechos reservados.</p>
                <div className="sm:ml-auto">
                     <p className="text-xs text-muted-foreground">
                        Creado por <span className="font-semibold">CodePen - Gerard Ramces</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
