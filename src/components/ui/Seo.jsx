import React from "react";
import { Helmet } from "react-helmet-async";

// SEO injector. Renders meta tags + JSON-LD structured data.
export default function Seo({
  title = "GJ Event | Premium Event Management Company in India",
  description = "GJ Event is a premium event management company specializing in Garba nights, concerts, VIP pass distribution, corporate events, and stall bazaars. India's next-generation event platform is coming soon.",
  path = "/",
  image = "https://media.base44.com/images/public/6a749d966a0d85567d02ee6f/5ca24ef02_generated_9c0696f6.png"
}) {
  const url = `https://gjevent.com${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "GJ Event",
          description,
          url,
          telephone: "+91-9104005719",
          areaServed: "India",
          knowsAbout: ["Event Management", "Garba Events", "Concerts", "VIP Pass Distribution", "Stall Bazaar"]
        })}
      </script>
    </Helmet>
  );
}