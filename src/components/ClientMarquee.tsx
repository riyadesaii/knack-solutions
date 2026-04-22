import { useQuery } from "@tanstack/react-query";
import { fetchClients, Client, BASE_URL } from "@/lib/api";
import SectionHeading from "@/components/SectionHeading";
import { useState } from "react";

const ClientLogo = ({ client }: { client: Client }) => {
  const [imgError, setImgError] = useState(false);
  if (client.logo && !imgError) {
    return (
      <img
        src={client.logo}
        alt={client.name}
        className="h-16 w-auto object-contain"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="h-16 px-6 flex items-center justify-center bg-muted rounded-lg text-sm font-semibold text-muted-foreground">
      {client.name}
    </div>
  );
};

const ClientMarquee = () => {
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  if (clients.length === 0) return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        No clients added yet.
      </div>
    </section>
  );

  // Duplication is only for seamless CSS loop — visually only one set is seen at a time
  const loopItems = [...clients, ...clients];

  return (
    <section className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <SectionHeading
          title="Trusted by Industry Leaders"
          subtitle="We're proud to partner with forward-thinking companies around the globe."
        />
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee w-max">
          {loopItems.map((client, i) => (
            <div
              key={`${client.id}-${i}`}
              className="flex-shrink-0 mx-12 flex items-center justify-center"
            >
              <ClientLogo client={client} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientMarquee;
