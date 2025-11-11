import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

export default function Blogs() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-[#EEE9DF] border-b border-[#C9C1B1]/30">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="min-h-[44px] min-w-[44px]"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <img 
            src={kahaniLogo} 
            alt="Kahani Logo" 
            className="h-12 w-auto object-contain"
          />
          
          <div className="w-[44px]" />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <img 
            src={kahaniLogo} 
            alt="Kahani Logo" 
            className="h-24 w-auto object-contain mx-auto mb-8"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">BLOG</h1>
        </div>

        {/* Blog Posts */}
        <div className="space-y-16">
          {/* Blog 1 */}
          <article className="space-y-4" data-testid="blog-post-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              The Power of Stories in Everyday Life
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Stories are more than just words—they are the threads that connect our past, present, and future. Every family has tales that make them unique, moments that bring laughter, tears, or inspiration. Preserving these stories ensures that memories live on, long after moments pass.
              </p>
              <p>
                At Kahani, we believe everyone's story matters. Sharing a story is not just about recounting events; it's about celebrating life, connecting generations, and passing down wisdom in a way that no photo or video can fully capture. Stories have the power to teach empathy, spark creativity, and create a sense of belonging.
              </p>
              <p>
                In today's fast-paced world, it's easy for these precious memories to get lost. That's why Kahani provides an easy way to record and preserve your stories. Whether it's a childhood memory, a family tradition, or a lesson learned, each story carries a piece of your heart.
              </p>
              <p>
                By sharing stories with loved ones, we also spread joy. A simple tale can brighten someone's day, evoke nostalgia, or inspire reflection. Every story shared strengthens the bonds between people, reminding us that our experiences, no matter how small, are worth remembering.
              </p>
              <p className="font-medium text-foreground">
                Preserve your stories. Share the joy. Celebrate life's moments with Kahani, and ensure that your stories continue to inspire and connect, generation after generation.
              </p>
            </div>
          </article>

          {/* Blog 2 */}
          <article className="space-y-4" data-testid="blog-post-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why Every Family Needs a Storytelling Tradition
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Family stories are the heartbeat of our identity. They give us roots, teach us values, and show us where we come from. Many of us grew up listening to grandparents recount tales of their childhood, or parents sharing the lessons they learned along the way. These stories do more than entertain—they shape who we are.
              </p>
              <p>
                Creating a storytelling tradition in your family has immense value. It encourages children to listen, learn, and even contribute their own experiences. It strengthens relationships, fosters communication, and keeps family history alive.
              </p>
              <p>
                With modern life moving at lightning speed, these moments of shared storytelling are often overlooked. Kahani aims to bring them back in a meaningful way. Our platform allows you to record and store your stories safely, making it simple to preserve memories for years to come.
              </p>
              <p>
                Sharing stories isn't just about remembering—it's about joy. When we narrate a family anecdote, celebrate a triumph, or recount a funny mishap, we create laughter, pride, and connection. Every story shared adds a new layer to your family's legacy.
              </p>
              <p className="font-medium text-foreground">
                Start small—record a favorite memory, an unforgettable lesson, or a cherished tradition. Over time, these stories will form a rich tapestry of family heritage. With Kahani, you can ensure that your stories live on, bringing happiness and connection to everyone who hears them.
              </p>
            </div>
          </article>

          {/* Blog 3 */}
          <article className="space-y-4" data-testid="blog-post-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Kahani: Where Stories Spark Family Bonds
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                In a world where everyone is constantly on the go, meaningful family connections can sometimes take a backseat. Between busy schedules, scattered locations, and the distractions of digital life, it's easy to lose touch with the stories that make a family unique. That's where Kahani comes in.
              </p>
              <p>
                Kahani isn't just a platform—it's a bridge. By giving families an easy way to record and share their stories via WhatsApp, Kahani brings loved ones closer, no matter the distance. A childhood memory, a funny mishap, or a lesson passed down through generations suddenly becomes a shared moment of joy and connection.
              </p>
              <p>
                The magic of Kahani lies in its simplicity. No complicated apps, no long forms—just real stories from real people. Each story shared becomes a thread weaving a stronger family fabric. Parents, grandparents, and children alike can participate, ensuring that everyone's voice is heard and cherished.
              </p>
              <p>
                Sharing stories also sparks conversation. A tale from the past can lead to laughter, reflection, or even new traditions. Through Kahani, families don't just preserve memories—they create opportunities to connect, celebrate, and understand each other better.
              </p>
              <p className="font-medium text-foreground">
                Ultimately, Kahani works because it focuses on what truly matters: people and their stories. Every memory shared strengthens bonds, every laugh creates closeness, and every story becomes a gift that families can carry forward for generations. With Kahani, connection is just a story away.
              </p>
            </div>
          </article>

          {/* Blog 4 */}
          <article className="space-y-4" data-testid="blog-post-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              The Story Behind Kahani: Preserving Memories, Connecting Hearts
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Every family has stories—moments that make them laugh, lessons that shape their lives, and memories that stay with them forever. Yet, in today's fast-paced world, many of these stories are at risk of being forgotten. That simple realization is what sparked the idea for Kahani.
              </p>
              <p>
                We started Kahani because we believe every story matters. Personal stories aren't just memories; they are threads that weave families together. A shared story can bridge generations, spark joy, and create understanding in ways that photos or videos alone cannot. We wanted to build a space where these moments are not only preserved but celebrated.
              </p>
              <p className="font-medium text-foreground">
                Our goal was to make storytelling effortless and inclusive. Many people have memories they want to share but don't know how or where to start. With Kahani, anyone can record their stories easily, even on a platform as familiar as WhatsApp. It's about making the act of sharing simple, enjoyable, and meaningful.
              </p>
            </div>
          </article>
        </div>

        {/* Return Home Button */}
        <div className="text-center pt-12">
          <Button
            size="lg"
            onClick={() => setLocation("/")}
            className="px-8 py-6 text-lg font-semibold min-h-[56px]"
            data-testid="button-home"
          >
            Return to Home
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
