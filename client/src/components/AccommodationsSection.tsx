import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink } from "lucide-react";

const hotels = [
  {
    name: "Leonardo Hotel",
    location: "Middlesbrough",
    url: "https://www.leonardohotels.co.uk/middlesbrough",
  },
  {
    name: "Premier Inn",
    location: "Middlesbrough Town Centre",
    url: "https://www.premierinn.com/gb/en/hotels/england/north-yorkshire/middlesbrough/middlesbrough-town-centre.html",
  },
  {
    name: "Travelodge",
    location: "Middlesbrough",
    url: "https://www.travelodge.co.uk/hotels/371/Middlesbrough-hotel",
  },
  {
    name: "Holiday Inn Express",
    location: "Middlesbrough",
    url: "https://www.ihg.com/holidayinnexpress/hotels/gb/en/middlesbrough/mcsuk/hoteldetail",
  },
];

export function AccommodationsSection() {
  return (
    <section id="accommodations" className="py-20 md:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nearby Accommodations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For guests travelling from afar, here are some hotels near the venue
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel, index) => (
            <Card
              key={index}
              className="text-center hover-elevate transition-all duration-300"
              data-testid={`hotel-card-${index}`}
            >
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {hotel.location}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  data-testid={`hotel-link-${index}`}
                >
                  <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                    View Hotel
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
