import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BridalPartyMember } from "@shared/schema";

export function BridalPartySection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: members = [], isLoading, error } = useQuery<BridalPartyMember[]>({
    queryKey: ["/api/bridal-party"],
  });

  const groomsmen = members.filter(m => m.role === "groomsman");
  const bridesmaids = members.filter(m => m.role === "bridesmaid");

  if (isLoading) {
    return (
      <section id="bridal-party" className="py-20 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="bridal-party" className="py-20 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <p className="text-destructive">Failed to load bridal party members. Please try again later.</p>
          </Card>
        </div>
      </section>
    );
  }

  // Check if there are no members at all
  if (!isLoading && !error && members.length === 0) {
    return (
      <section id="bridal-party" className="py-20 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Bridal Party
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The special people standing beside us on our big day
            </p>
          </div>
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Our bridal party information will be announced soon. Stay tuned!
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="bridal-party" className="py-20 md:py-32 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Bridal Party
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The special people standing beside us on our big day
          </p>
        </div>

        {/* Groomsmen */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl font-bold text-center text-foreground mb-8">
            Groomsmen
          </h3>
          {groomsmen.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Groomsmen information will be announced soon.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {groomsmen.map((member, index) => (
              <Card key={member.id} className={`overflow-hidden hover-elevate ${
                index === groomsmen.length - 1 && groomsmen.length % 2 !== 0 
                  ? 'md:col-span-2 md:mx-auto md:max-w-md' 
                  : ''
              }`} data-testid={`card-groomsman-${member.id}`}>
                {/* Large Photo Section */}
                {member.photoUrl && (
                  <div className="relative h-80 w-full overflow-hidden bg-muted">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="font-serif text-2xl font-bold mb-1">
                        {member.name}
                      </h4>
                      <p className="text-accent font-medium text-lg">{member.title}</p>
                    </div>
                  </div>
                )}
                
                {/* Story Section */}
                <div className="p-6">
                  <div className={`overflow-hidden transition-all ${
                    expandedId === member.id ? 'max-h-96' : 'max-h-24'
                  }`}>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.story}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                    className="mt-4 w-full"
                    data-testid={`button-expand-${member.id}`}
                  >
                    {expandedId === member.id ? (
                      <>
                        Show Less <ChevronUp className="ml-2 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read Full Story <ChevronDown className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bridesmaids */}
        <div>
          <h3 className="font-serif text-3xl font-bold text-center text-foreground mb-8">
            Bridesmaids
          </h3>
          {bridesmaids.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Bridesmaids information will be announced soon.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {bridesmaids.map((member, index) => (
              <Card key={member.id} className={`overflow-hidden hover-elevate ${
                index === bridesmaids.length - 1 && bridesmaids.length % 2 !== 0 
                  ? 'md:col-span-2 md:mx-auto md:max-w-md' 
                  : ''
              }`} data-testid={`card-bridesmaid-${member.id}`}>
                {/* Large Photo Section */}
                {member.photoUrl && (
                  <div className="relative h-80 w-full overflow-hidden bg-muted">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="font-serif text-2xl font-bold mb-1">
                        {member.name}
                      </h4>
                      <p className="text-accent font-medium text-lg">{member.title}</p>
                    </div>
                  </div>
                )}
                
                {/* Story Section */}
                <div className="p-6">
                  <div className={`overflow-hidden transition-all ${
                    expandedId === member.id ? 'max-h-96' : 'max-h-24'
                  }`}>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.story}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                    className="mt-4 w-full"
                    data-testid={`button-expand-${member.id}`}
                  >
                    {expandedId === member.id ? (
                      <>
                        Show Less <ChevronUp className="ml-2 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read Full Story <ChevronDown className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
