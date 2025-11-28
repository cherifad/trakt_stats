import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <main className="flex flex-col items-center gap-8 max-w-3xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Trakt Stats</h1>
          <p className="text-lg text-muted-foreground">
            A modern GUI for viewing your Trakt.tv statistics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Movies</CardTitle>
              <CardDescription>
                Track your movie watching history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View statistics about the movies you have watched, including
                total watch time and favorites.
              </p>
            </CardContent>
            <CardFooter>
              <Button>View Movies</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TV Shows</CardTitle>
              <CardDescription>
                Monitor your TV show progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep track of episodes watched, series progress, and discover
                new shows to watch.
              </p>
            </CardContent>
            <CardFooter>
              <Button>View Shows</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button variant="outline">Learn More</Button>
          <Button>Get Started</Button>
        </div>
      </main>
    </div>
  );
}
