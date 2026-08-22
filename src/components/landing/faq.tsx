import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Do I need to install anything?",
    answer:
      "No. Docolab is designed to work directly in the browser, so your team can create and collaborate on documents without installing complicated desktop software.",
  },
  {
    question: "Can multiple people edit a document at the same time?",
    answer:
      "Yes. Multiple team members can work inside the same document simultaneously and see changes in real time.",
  },
  {
    question: "What happens if someone loses their internet connection?",
    answer:
      "The application gracefully handles temporary connectivity issues and synchronizes changes automatically once the connection is restored.",
  },
  {
    question: "Is my team's data secure?",
    answer:
      "Documents are protected using authentication, authorization, encrypted connections, secure storage, and proper access controls to help keep your team's data safe.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Frequently asked questions
      </h2>

      <Accordion type="single" collapsible className="mt-10 w-full">
        {FAQS.map((faq, index) => (
          <AccordionItem key={faq.question} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base font-medium text-foreground">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
