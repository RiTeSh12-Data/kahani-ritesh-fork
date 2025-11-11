import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  MessageCircle,
  Mic,
  FileText,
  CheckCircle,
  Star,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Question Sets",
      description: "Professionally crafted questions designed to unlock life's most meaningful stories and memories.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Conversations",
      description: "Simple, familiar interface. Your loved ones answer questions via WhatsApp at their own pace.",
    },
    {
      icon: Mic,
      title: "Voice & Text Responses",
      description: "Capture stories through voice messages or text - whatever feels most natural and comfortable.",
    },
    {
      icon: FileText,
      title: "Beautiful Digital Books",
      description: "Receive a professionally formatted digital memoir preserving every story forever.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Select Question Pack",
      description: "Choose from our expertly curated question sets tailored to different life experiences.",
    },
    {
      number: 2,
      title: "Elder Answers on WhatsApp",
      description: "Questions are sent daily via WhatsApp. Your loved one responds at their convenience.",
    },
    {
      number: 3,
      title: "Receive Digital Memoir",
      description: "Get a beautifully formatted digital book preserving all responses and memories.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      relationship: "Granddaughter",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "My grandfather shared stories I never knew. The WhatsApp format made it so easy for him. We now have a priceless family treasure.",
    },
    {
      name: "Rajesh Kumar",
      relationship: "Son",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Preserved my mother's immigration journey before it was too late. The questions were thoughtful and brought out beautiful memories.",
    },
    {
      name: "Anita Desai",
      relationship: "Daughter",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "My father, a veteran, shared his service stories that he'd never told anyone. This service is truly life-changing.",
    },
  ];

  const pricingTiers = [
    {
      name: "Starter Pack",
      price: "₹799",
      duration: "30 days",
      questions: 30,
      features: ["Daily WhatsApp questions", "Voice & text responses", "Digital memoir", "Email support"],
      popular: false,
    },
    {
      name: "Complete Legacy",
      price: "₹999",
      duration: "50 days",
      questions: 50,
      features: [
        "Daily WhatsApp questions",
        "Voice & text responses",
        "Digital memoir",
        "Priority support",
        "Sample questions preview",
      ],
      popular: true,
    },
    {
      name: "Premium Experience",
      price: "₹1,299",
      duration: "50 days",
      questions: 50,
      features: [
        "Daily WhatsApp questions",
        "Voice & text responses",
        "Premium digital memoir",
        "Dedicated support",
        "Photo integration",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How does the WhatsApp conversation work?",
      answer: "Once you purchase, we'll send the first question to your loved one's WhatsApp. Each day (or your chosen frequency), they'll receive a new question to answer via voice message or text. It's simple, familiar, and comfortable.",
    },
    {
      question: "What if my elder isn't tech-savvy?",
      answer: "WhatsApp is one of the most user-friendly apps. If they can use WhatsApp to chat with family, they can use LegacyScribe. We also provide simple instructions and support to help them get started.",
    },
    {
      question: "Can I customize the questions?",
      answer: "Our question packs are professionally curated for different life experiences. While we don't offer customization in our standard packs, the variety of questions ensures comprehensive life story coverage.",
    },
    {
      question: "What format is the final digital memoir?",
      answer: "You'll receive a beautifully formatted PDF document with all responses organized chronologically. It includes the questions, text transcriptions, and embedded audio files for voice responses.",
    },
    {
      question: "Can multiple family members access the stories?",
      answer: "Yes! You'll receive a unique link that can be shared with family members to view the collected stories as they're being created.",
    },
    {
      question: "What languages are supported?",
      answer: "Currently, we support English, Hindi, and regional Indian languages. The elder can respond in their preferred language, and we'll preserve it authentically.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#F5E6D3] via-[#E8D4B8] to-[#F5E6D3]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" variant="secondary" data-testid="badge-hero">
              Preserve Stories That Matter
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Capture Your Grandparent's Wisdom Through Simple{" "}
              <span className="text-primary">WhatsApp Conversations</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform life stories into beautifully documented digital memoirs. Preserve veteran service,
              elder wisdom, and family legacy forever through comfortable WhatsApp conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/products" data-testid="link-hero-start">
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-start-preserving">
                  Start Preserving Stories
                </Button>
              </Link>
              <Link href="/free-trial" data-testid="link-hero-trial">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2" data-testid="button-free-trial">
                  Try Free Trial
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold" data-testid="text-stat-stories">500+ Stories Preserved</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary fill-current" />
                <span className="font-semibold" data-testid="text-stat-satisfaction">98% Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold" data-testid="text-stat-duration">Average 45 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose LegacyScribe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed to make story preservation effortless and meaningful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to preserve a lifetime of memories
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`step-${index}`}>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-secondary" />
                  )}
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Families Are Saying</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from families who preserved their loved ones' legacies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative pt-12" data-testid={`testimonial-${index}`}>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full border-4 border-background shadow-lg"
                    data-testid={`img-testimonial-${index}`}
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-center italic mb-4 text-muted-foreground">"{testimonial.text}"</p>
                  <div className="text-center">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.relationship}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the perfect question pack for your loved one's story
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${tier.popular ? "border-primary border-2 shadow-xl scale-105" : ""}`}
                data-testid={`pricing-card-${index}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" data-testid="badge-popular">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold" data-testid={`text-price-${index}`}>{tier.price}</span>
                    <span className="text-muted-foreground ml-2">/ story</span>
                  </div>
                  <CardDescription className="text-base">
                    {tier.questions} questions • {tier.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/products" data-testid={`link-choose-plan-${index}`}>
                    <Button
                      variant={tier.popular ? "default" : "outline"}
                      className="w-full"
                      data-testid={`button-choose-plan-${index}`}
                    >
                      Choose Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about preserving life stories
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Preserve Your Family's Legacy?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start capturing precious stories today. No credit card required for free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-trial" data-testid="link-cta-final-trial">
              <Button size="lg" variant="default" className="text-lg px-8 py-6" data-testid="button-cta-trial">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/products" data-testid="link-cta-final-browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2" data-testid="button-cta-browse">
                Browse Question Packs
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-4 border-t border-primary/20">
            <Link href="/book-demo" data-testid="link-demo-books">
              <Button variant="ghost" size="lg" className="text-primary text-lg font-semibold" data-testid="button-demo-books">
                View Sample Memory Books →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
