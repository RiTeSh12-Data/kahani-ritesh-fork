import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Loader2, Share2, Copy, Mail, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";
import { insertFeedbackSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { SiWhatsapp } from "react-icons/si";

const feedbackFormSchema = insertFeedbackSchema;
type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function Feedback() {
  const { toast } = useToast();
  const [, params] = useRoute("/feedback/:orderCode");
  const orderCode = params?.orderCode || "";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  const { data: checkData, isLoading: isChecking } = useQuery({
    queryKey: ["/api/feedback/check", orderCode],
    queryFn: async () => {
      const response = await fetch(`/api/feedback/check/${orderCode}`);
      if (!response.ok) throw new Error("Failed to check feedback");
      return response.json();
    },
    enabled: !!orderCode,
  });

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      orderCode,
      overallRating: 0,
      whatsappEase: "easy",
      storyQuality: "satisfied",
      wouldRecommend: "probably-yes",
      writtenFeedback: "",
      allowTestimonial: false,
      testimonialName: "",
      testimonialRelationship: "",
      testimonialPhoto: "",
      allowFollowUp: false,
      followUpEmail: "",
      followUpPhone: "",
    },
  });

  const allowTestimonial = form.watch("allowTestimonial");
  const allowFollowUp = form.watch("allowFollowUp");
  const overallRating = form.watch("overallRating");

  const submitFeedbackMutation = useMutation({
    mutationFn: (data: FeedbackFormData) => apiRequest("POST", "/api/feedback/submit", data),
    onSuccess: (feedback) => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback/check"] });
      const code = `LEGACY-${orderCode.substring(0, 6).toUpperCase()}`;
      setReferralCode(code);
      setIsSubmitted(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedbackMutation.mutate(data);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const shareWhatsApp = () => {
    const message = `I just used LegacyScribe to preserve my family's stories! You should try it too. Use my code ${referralCode} for 20% off: ${window.location.origin}/products`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = "Preserve Your Family Stories with LegacyScribe";
    const body = `I recently used LegacyScribe to capture precious memories from my loved one, and it was an amazing experience!\n\nUse my referral code ${referralCode} to get 20% off your first order: ${window.location.origin}/products\n\nIt's a beautiful way to preserve stories for future generations.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!orderCode) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Order Code</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Please use a valid feedback link from your order confirmation.
          </p>
          <Link href="/products" data-testid="link-browse-products-invalid">
            <Button size="lg" data-testid="button-browse-products-invalid">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-success/20 text-success mb-6 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="heading-thank-you">Thank You!</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              Your feedback helps us preserve more family stories for future generations.
            </p>
            <p className="text-muted-foreground">
              We read every single review and use your insights to improve.
            </p>
          </div>

          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 text-secondary">
                  <Share2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Refer a Friend, Get 20% Off</h2>
                  <p className="text-sm text-muted-foreground">
                    Share LegacyScribe and you both save!
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 mb-4">
                <Label className="text-sm font-medium mb-2 block">Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="font-mono text-lg font-bold"
                    data-testid="input-referral-code"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralCode}
                    data-testid="button-copy-code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Give this code to friends. When they purchase, you both get 20% off your next order!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={shareWhatsApp}
                  data-testid="button-share-whatsapp"
                >
                  <SiWhatsapp className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={shareEmail}
                  data-testid="button-share-email"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/stories/${orderCode}`} data-testid="link-view-stories">
              <Button size="lg" data-testid="button-view-stories">
                View My Stories
              </Button>
            </Link>
            <Link href="/products" data-testid="link-browse-more">
              <Button size="lg" variant="outline" data-testid="button-browse-more">
                Browse More Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (checkData?.submitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-success/20 text-success mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We've already received your feedback. We appreciate your time and insights!
          </p>
          <Link href="/products" data-testid="link-browse-products">
            <Button size="lg" data-testid="button-browse-products">Browse More Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-block h-1 w-24 bg-secondary rounded-full mb-4"></div>
          <h1 className="text-4xl font-bold mb-3">Share Your Experience</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Help us improve LegacyScribe for other families
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-secondary" />
            Your feedback means the world to us
          </p>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="overallRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">
                        How would you rate your overall experience? *
                      </FormLabel>
                      <FormControl>
                        <div className="py-4">
                          <StarRating
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="whatsappEase"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          How easy was it for your elder to use WhatsApp?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="very-easy" id="very-easy" data-testid="radio-whatsapp-very-easy" />
                              <Label htmlFor="very-easy" className="flex-1 cursor-pointer font-normal">
                                Very Easy - They loved it!
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="easy" id="easy" data-testid="radio-whatsapp-easy" />
                              <Label htmlFor="easy" className="flex-1 cursor-pointer font-normal">
                                Easy - No major issues
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="neutral" id="neutral" data-testid="radio-whatsapp-neutral" />
                              <Label htmlFor="neutral" className="flex-1 cursor-pointer font-normal">
                                Neutral - Some confusion
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="difficult" id="difficult" data-testid="radio-whatsapp-difficult" />
                              <Label htmlFor="difficult" className="flex-1 cursor-pointer font-normal">
                                Difficult - Needed help
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="very-difficult" id="very-difficult" data-testid="radio-whatsapp-very-difficult" />
                              <Label htmlFor="very-difficult" className="flex-1 cursor-pointer font-normal">
                                Very Difficult - Too complicated
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="storyQuality"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          How satisfied are you with the story quality?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="very-satisfied" id="very-satisfied" data-testid="radio-quality-very-satisfied" />
                              <Label htmlFor="very-satisfied" className="flex-1 cursor-pointer font-normal">
                                Very Satisfied
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="satisfied" id="satisfied" data-testid="radio-quality-satisfied" />
                              <Label htmlFor="satisfied" className="flex-1 cursor-pointer font-normal">
                                Satisfied
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="neutral" id="quality-neutral" data-testid="radio-quality-neutral" />
                              <Label htmlFor="quality-neutral" className="flex-1 cursor-pointer font-normal">
                                Neutral
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="dissatisfied" id="dissatisfied" data-testid="radio-quality-dissatisfied" />
                              <Label htmlFor="dissatisfied" className="flex-1 cursor-pointer font-normal">
                                Dissatisfied
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="very-dissatisfied" id="very-dissatisfied" data-testid="radio-quality-very-dissatisfied" />
                              <Label htmlFor="very-dissatisfied" className="flex-1 cursor-pointer font-normal">
                                Very Dissatisfied
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="wouldRecommend"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold">
                          Would you recommend LegacyScribe to others?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="definitely-yes" id="definitely-yes" data-testid="radio-recommend-definitely-yes" />
                              <Label htmlFor="definitely-yes" className="flex-1 cursor-pointer font-normal">
                                Definitely Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="probably-yes" id="probably-yes" data-testid="radio-recommend-probably-yes" />
                              <Label htmlFor="probably-yes" className="flex-1 cursor-pointer font-normal">
                                Probably Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="not-sure" id="not-sure" data-testid="radio-recommend-not-sure" />
                              <Label htmlFor="not-sure" className="flex-1 cursor-pointer font-normal">
                                Not Sure
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="probably-not" id="probably-not" data-testid="radio-recommend-probably-not" />
                              <Label htmlFor="probably-not" className="flex-1 cursor-pointer font-normal">
                                Probably Not
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
                              <RadioGroupItem value="definitely-not" id="definitely-not" data-testid="radio-recommend-definitely-not" />
                              <Label htmlFor="definitely-not" className="flex-1 cursor-pointer font-normal">
                                Definitely Not
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="writtenFeedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Tell us more about your experience
                        </FormLabel>
                        <p className="text-sm text-muted-foreground mb-3">
                          What did you love? What could we improve? Any special moments to share?
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              placeholder="Your feedback helps us preserve more precious memories..."
                              className="min-h-[150px] resize-none"
                              maxLength={500}
                              onChange={(e) => {
                                field.onChange(e);
                                setCharacterCount(e.target.value.length);
                              }}
                              data-testid="textarea-written-feedback"
                            />
                            <p className="absolute bottom-3 right-3 text-xs text-muted-foreground" data-testid="text-character-count">
                              {characterCount} / 500
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="allowTestimonial"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-allow-testimonial"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            You can feature my feedback as a testimonial on your website
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {allowTestimonial && (
                    <div className="mt-6 space-y-4 pl-8 animate-in slide-in-from-top-2">
                      <FormField
                        control={form.control}
                        name="testimonialName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Priya Sharma"
                                data-testid="input-testimonial-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="testimonialRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Relationship *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Granddaughter, Son, Niece"
                                data-testid="input-testimonial-relationship"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-8">
                  <FormField
                    control={form.control}
                    name="allowFollowUp"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-allow-followup"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            LegacyScribe can follow up with me about my feedback
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {allowFollowUp && (
                    <div className="mt-6 space-y-4 pl-8 animate-in slide-in-from-top-2">
                      <FormField
                        control={form.control}
                        name="followUpEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your@email.com"
                                data-testid="input-followup-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="followUpPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+91 9876543210"
                                data-testid="input-followup-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg"
                  disabled={overallRating === 0 || submitFeedbackMutation.isPending}
                  data-testid="button-submit-feedback"
                >
                  {submitFeedbackMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
