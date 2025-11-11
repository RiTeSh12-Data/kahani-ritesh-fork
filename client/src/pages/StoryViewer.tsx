import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Calendar, MessageCircle, ArrowLeft } from "lucide-react";

export default function StoryViewer() {
  const [, params] = useRoute("/stories/:uniqueCode");
  const [stories, setStories] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.uniqueCode) {
      fetch(`/api/stories/${params.uniqueCode}`)
        .then((res) => res.json())
        .then((data) => {
          setStories(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params?.uniqueCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading stories...</h1>
        </div>
      </div>
    );
  }

  if (!stories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Stories Not Found</h1>
          <p className="text-muted-foreground mb-6">This story collection doesn't exist or has been removed.</p>
          <Link href="/" data-testid="link-back-home">
            <Button data-testid="button-back-home">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = (stories.responses.length / stories.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/" data-testid="link-back">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="text-story-title">
                {stories.elderName}'s Story
              </h1>
              <Badge variant="secondary" data-testid="badge-category">{stories.category}</Badge>
            </div>
            <Button variant="outline" data-testid="button-download">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold" data-testid="text-progress">
                {stories.responses.length} of {stories.totalQuestions} questions answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {stories.responses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2" data-testid="text-no-responses">No responses yet</h2>
              <p className="text-muted-foreground">
                Questions are being sent to {stories.elderName}. Check back soon for their responses!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {stories.responses.map((response: any, index: number) => (
              <Card key={index} data-testid={`response-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-primary">Question {index + 1}</span>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(response.answeredAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold mb-4" data-testid={`question-${index}`}>
                        {response.questionText}
                      </p>
                    </div>
                  </div>

                  {response.audioUrl && (
                    <div className="mb-4">
                      <audio controls className="w-full" data-testid={`audio-${index}`}>
                        <source src={response.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {response.responseText && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-muted-foreground leading-relaxed" data-testid={`response-text-${index}`}>
                        {response.responseText}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {stories.responses.length > 0 && stories.responses.length < stories.totalQuestions && (
          <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">More Stories Coming Soon</h3>
            <p className="text-muted-foreground">
              We're still collecting {stories.elderName}'s wonderful stories. Check back regularly for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
