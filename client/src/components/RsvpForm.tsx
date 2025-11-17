import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const rsvpSchema = z.object({
  guestName: z.string().min(2, "Please enter your full name"),
  attending: z.boolean(),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

export function RsvpForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 3;
  const { toast } = useToast();

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestName: "",
      attending: false,
    },
  });

  const createRsvpMutation = useMutation({
    mutationFn: async (data: RsvpFormData) => {
      const payload = {
        guestName: data.guestName,
        attending: data.attending,
        plusOneName: "",
      };
      return apiRequest("POST", "/api/rsvps", payload);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "RSVP Received!",
        description: "Thank you for confirming your attendance.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RsvpFormData) => {
    createRsvpMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-20 md:py-32 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
              Thank You!
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Your RSVP has been received. We can't wait to celebrate with you!
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                form.reset();
              }}
              variant="outline"
              data-testid="button-submit-another"
            >
              Submit Another RSVP
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 md:py-32 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            RSVP
          </h2>
          <p className="text-lg text-muted-foreground">
            Please let us know if you can join us
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 mx-1 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-8">
              {/* Step 1: Guest Name */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Your Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-guest-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Attendance */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Will You Attend?
                  </h3>
                  <FormField
                    control={form.control}
                    name="attending"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-attending"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="font-medium cursor-pointer">
                            Wedding Ceremony - Saturday 21st March 2026
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Love & Celebration Message */}
              {currentStep === 3 && (
                <div className="space-y-6 text-center py-8">
                  <div className="flex justify-center gap-4 mb-6">
                    <Heart className="w-16 h-16 text-primary fill-primary animate-pulse" />
                    <span className="text-6xl">💕</span>
                    <Heart className="w-16 h-16 text-primary fill-primary animate-pulse" />
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
                    We Can't Wait! 💒
                  </h3>
                  
                  <p className="text-xl text-muted-foreground mb-2">
                    Your presence will make our day extra special! ✨
                  </p>
                  
                  <p className="text-lg text-muted-foreground">
                    See you on March 21st, 2026! 🎉
                  </p>
                  
                  <div className="text-4xl mt-6">
                    😊 💐 🥂 🎊 💍
                  </div>
                </div>
              )}
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                  data-testid="button-previous"
                >
                  Previous
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1"
                  data-testid="button-next"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createRsvpMutation.isPending}
                  data-testid="button-submit-rsvp"
                >
                  {createRsvpMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm Attendance"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
