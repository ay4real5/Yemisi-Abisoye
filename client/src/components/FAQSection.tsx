import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Is there a dress code for the wedding?",
      answer: (
        <>
          Asoebi fabric, Aso Oke Headtie/Fila is available. If you wish to partake in the colour scheme by wearing traditional aso ebi fabric please contact 07898375084.
          <br /><br />
          <strong>Colour of the day: Cream coloured outfit.</strong>
          <br /><br />
          We would appreciate if you partake in our colour scheme, but if you do not own the colour for the day, please do not worry at all! Just dress to impress! 😍
        </>
      ),
    },
    {
      question: "What is the schedule for the wedding day?",
      answer: "Our Wedding is on Saturday 21st March 2026. The ceremony will promptly start from 11:00am and we aim to end the after party before 11:00pm.",
    },
    {
      question: "When should I RSVP by?",
      answer: "To help us with our planning, please RSVP as soon as possible. However, we would appreciate if this is done by 28th February 2026.",
    },
    {
      question: "When should I arrive to the ceremony?",
      answer: "You should aim to arrive at least 15 minutes before the ceremony starts. This gives you plenty of time to find a seat, settle in, and avoid any last-minute disruptions. Arriving any later could risk missing the start of the ceremony or interrupting key moments. It's always better to be early than to rush and potentially miss out!",
    },
    {
      question: "Are children welcome?",
      answer: "As much as we love your little ones, our wedding is exclusively for adults. Thank you for understanding 😊.",
    },
    {
      question: "Is there a parking area at the venue?",
      answer: "Yes, there is plenty of free parking available at the venue.",
    },
    {
      question: "Do you have a gift preference?",
      answer: "We will be very thankful for any gift that we receive. Also, monetary gift would be greatly appreciated.",
    },
    {
      question: "Is it okay to take pictures with our phones and cameras during the wedding?",
      answer: "Yes! We would love for you to take photos and share them with us. However, please don't block the walkway during dance entrance and be conscious of the photographers and videographers. If uploading your pictures on social media, can we please ask you to tag us with #AbifoundhisMisi #AbifoundhisMisi26",
    },
    {
      question: "Can I bring a date?",
      answer: "Please only bring a plus one if this has been confirmed with the Bride and Groom or their Parents. Seating will be allocated to ensure guests feel comfortable and have their own seats. We hope you understand 😊.",
    },
    {
      question: "Can I cancel my RSVP?",
      answer: "If your plans have changed and you are unable to attend after previously confirming, please tell us as soon as possible. This will allow us to accommodate other guests and make any necessary adjustments.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For all our friends and family who have questions, please check out our Q & A
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 data-[state=open]:bg-card"
            >
              <AccordionTrigger
                className="font-serif text-lg font-semibold text-foreground hover:no-underline py-6 text-center justify-center [&>svg]:ml-2"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-center">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
