import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { EventExplorer } from "@/components/events/explorer";
import { getEvents } from "@/content/events";

export const metadata: Metadata = pageMetadata("/events", {
  title: "Events",
  description:
    "Upcoming events, gatherings and special services at Citadel of Grace — browse by month and add them to your calendar.",
});

export default function EventsPage() {
  const events = getEvents();

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Events"
        intro="Gatherings, special services and everything happening in the life of the church."
      />
      <Section id="events-list" align="left">
        <EventExplorer events={events} />
      </Section>
    </>
  );
}
