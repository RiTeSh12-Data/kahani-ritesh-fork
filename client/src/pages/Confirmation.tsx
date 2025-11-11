import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MessageCircle, FileText, Mail } from "lucide-react";

export default function Confirmation() {
  const [location] = useLocation();
  const [order, setOrder] = useState<any>(null);

  const orderId = new URLSearchParams(location.split("?")[1]).get("orderId");

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch(() => {});
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-success/20 text-success mb-6 animate-in zoom-in duration-300">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="text-confirmation-title">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for preserving precious memories with LegacyScribe
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-2xl font-bold" data-testid="text-order-id">{order.id}</p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2" data-testid="badge-status">
                {order.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Information</p>
                <p className="font-semibold" data-testid="text-user-name">{order.userName}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">{order.userEmail}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-user-phone">{order.userPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Elder's Information</p>
                <p className="font-semibold" data-testid="text-elder-name">{order.elderName}</p>
                <p className="text-sm text-muted-foreground">WhatsApp: {order.elderWhatsapp}</p>
                <p className="text-sm text-muted-foreground">Relationship: {order.relationship}</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <p className="font-semibold mb-4">Your Unique Story Link:</p>
              <div className="flex items-center gap-2 bg-background p-3 rounded-md border">
                <code className="flex-1 text-sm" data-testid="text-story-link">
                  legacyscribe.com/stories/{order.uniqueCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`legacyscribe.com/stories/${order.uniqueCode}`);
                  }}
                  data-testid="button-copy-link"
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Share this link with family members to view collected stories as they're created
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-3xl font-bold text-primary" data-testid="text-total-paid">₹{order.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Day 1: First Question Sent</p>
                  <p className="text-muted-foreground">
                    On {order.startDate}, {order.elderName} will receive the first question on WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Daily: Questions Continue</p>
                  <p className="text-muted-foreground">
                    Questions will be sent {order.schedule === "daily" ? "daily" : order.schedule === "every-2-days" ? "every 2 days" : "weekly"} via WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold mb-1">After Completion: Memoir Ready</p>
                  <p className="text-muted-foreground">
                    Once all questions are answered, you'll receive a beautifully formatted digital memoir
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Email Notifications</p>
                  <p className="text-muted-foreground">
                    You'll receive email updates when {order.elderName} responds to questions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            A confirmation email has been sent to {order.userEmail}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" data-testid="link-back-home">
              <Button variant="outline" size="lg" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
            <Link href={`/stories/${order.uniqueCode}`} data-testid="link-view-stories">
              <Button size="lg" data-testid="button-view-stories">
                View Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
