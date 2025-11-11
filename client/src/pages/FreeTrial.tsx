import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertFreeTrialSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import kahaniLogo from "@assets/Kahani Dummy Logo (1)_1762679074954.png";
import { Footer } from "@/components/Footer";

type FreeTrialFormData = z.infer<typeof insertFreeTrialSchema>;

export default function FreeTrial() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const albumFromUrl = urlParams.get('album') || '';

  const form = useForm<FreeTrialFormData>({
    resolver: zodResolver(insertFreeTrialSchema),
    defaultValues: {
      customerPhone: "",
      buyerName: "",
      storytellerName: "",
      selectedAlbum: albumFromUrl || "Our Family History", // Default to first album if not provided
    },
  });

  const freeTrialMutation = useMutation({
    mutationFn: async (data: FreeTrialFormData) => {
      const response = await apiRequest("POST", "/api/free-trial", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sign up");
      }
      return response.json();
    },
    onSuccess: (trial) => {
      queryClient.invalidateQueries({ queryKey: ["/api/free-trial"] });
      
      form.reset();
      setLocation("/thank-you");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FreeTrialFormData) => {
    freeTrialMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src={kahaniLogo} 
              alt="Kahani Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the joy of preserving precious memories. Get started with 10 thoughtfully crafted questions delivered via WhatsApp.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            What's Included in Your Free Trial
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">Week full of Thoughtful Questions</p>
                <p className="text-muted-foreground">Carefully curated to capture meaningful memories and life stories</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">WhatsApp Delivery</p>
                <p className="text-muted-foreground">Questions sent directly to your phone via WhatsApp to the Storyteller</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">Voice & Text Responses</p>
                <p className="text-muted-foreground">Record directly via voice messages</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">Beautiful Story Format</p>
                <p className="text-muted-foreground">Your responses compiled into a keepsake story you'll treasure</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">No payment information Required</p>
                <p className="text-muted-foreground">Start completely free - no payment information needed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-semibold text-primary mt-0.5">•</span>
              <div>
                <p className="font-semibold text-lg mb-1">Flexible Schedule</p>
                <p className="text-muted-foreground">Questions delivered at your preferred pace and timing</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12 bg-card rounded-xl p-8 border">
          <h2 className="text-2xl font-semibold mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                1
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Enter Your Phone Number</p>
                <p className="text-muted-foreground">Just your WhatsApp number is all we need to get started</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                2
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Receive Questions</p>
                <p className="text-muted-foreground">Get thoughtful questions delivered to your WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                3
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">Share Your Story</p>
                <p className="text-muted-foreground">Reply with voice or text messages at your own pace</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-card rounded-xl p-8 border-2 border-primary/20 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Ready to Begin?</h2>
            <p className="text-muted-foreground">
              Enter your WhatsApp number and we'll send you your first question
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Buyer Information Section */}
              <div className="space-y-5">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
                  <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                </div>

                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder=""
                          className="h-12 text-base"
                          data-testid="input-buyer-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Your WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder=""
                          className="h-12 text-base"
                          data-testid="input-customer-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Storyteller Information */}
              <div className="space-y-5 pt-4">
                <FormField
                  control={form.control}
                  name="storytellerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Who's the story teller
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="e.g., Nani, Dadi, Mummy, Dadu, Nanu"
                          className="h-12 text-base"
                          data-testid="input-storyteller-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Hidden field for selected album */}
              <FormField
                control={form.control}
                name="selectedAlbum"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg h-14 mt-8"
                disabled={freeTrialMutation.isPending}
                data-testid="button-start-trial"
              >
                {freeTrialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Starting Your Trial...
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                No payment required. Cancel anytime. Your first question will arrive via WhatsApp shortly.
              </p>
            </form>
          </Form>
        </div>

        {/* Trust Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <span className="text-sm font-medium">500+ Stories Preserved</span>
            <span className="text-sm font-medium">98% Satisfaction</span>
          </div>
          <p className="text-muted-foreground">
            Questions about the trial?{" "}
            <a href="mailto:support@legacyscribe.com" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
