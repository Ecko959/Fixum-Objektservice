import { faq } from "./faq";
import { offerCatalog } from "./services";
import { sameAs, site } from "./site";

/**
 * Zentrale schema.org-Bausteine.
 *
 * Alle Knoten hängen über feste @id-Werte zusammen, damit Suchmaschinen
 * Unternehmen, Website und Einzelseite als ein Graph lesen statt als drei
 * unverbundene Snippets.
 */

export const ids = {
  business: `${site.domain}/#business`,
  website: `${site.domain}/#website`,
  logo: `${site.domain}/#logo`,
  place: `${site.domain}/#place`,
};

/** Absolute URL aus einem internen Pfad. */
export const absolute = (path: string) => new URL(path, site.domain).toString();

/** Kanonische Form: immer mit abschließendem Slash, damit Canonical und Sitemap identisch sind. */
export const canonicalPath = (pathname: string) => {
  const [clean] = pathname.split(/[?#]/);
  if (clean === "/" || clean === "") return "/";
  return clean.endsWith("/") ? clean : `${clean}/`;
};

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.street,
  postalCode: site.zip,
  addressLocality: site.city,
  addressRegion: site.region,
  addressCountry: site.country,
};

const openingHoursSpecification = site.openingHours.map((slot) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
  opens: slot.opens,
  closes: slot.closes,
}));

export const logoSchema = {
  "@type": "ImageObject",
  "@id": ids.logo,
  url: absolute("/logo/fixum-lockup-blue.png"),
  contentUrl: absolute("/logo/fixum-lockup-blue.png"),
  caption: site.name,
};

/**
 * HomeAndConstructionBusiness ist der spezifischste passende LocalBusiness-Typ
 * für Rückbau-, Ausbau- und Objektdienstleistungen.
 */
export const businessSchema = {
  "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
  "@id": ids.business,
  name: site.name,
  legalName: site.legalName,
  alternateName: "Fixum",
  url: `${site.domain}/`,
  logo: { "@id": ids.logo },
  image: absolute(site.ogImage),
  description:
    "Fixum Objektservice übernimmt Entrümpelung, Haushaltsauflösung, Entkernung, nicht-tragenden Rückbau, Trockenbau, Montage und Hausmeisterservice in Emden und Ostfriesland - mit Festpreis nach Besichtigung.",
  slogan: site.claim,
  telephone: site.phoneDisplay,
  email: site.email,
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Überweisung",
  foundingDate: site.foundingYear,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  hasMap: `https://www.openstreetmap.org/?mlat=${site.geo.lat}&mlon=${site.geo.lng}`,
  openingHoursSpecification,
  founder: { "@type": "Person", name: site.owner },
  knowsLanguage: "de-DE",
  ...(sameAs.length ? { sameAs } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: site.phoneDisplay,
    email: site.email,
    areaServed: "DE",
    availableLanguage: ["de"],
  },
  /* Einsatzradius statt einer reinen Städteliste - das ist die Angabe,
     die Google für lokale Treffer tatsächlich auswertet. */
  areaServed: [
    {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      geoRadius: site.radiusKm * 1000,
    },
    ...site.areaServed.map((name) => ({
      "@type": "City",
      name,
      address: {
        "@type": "PostalAddress",
        addressLocality: name,
        addressRegion: site.region,
        addressCountry: site.country,
      },
    })),
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Leistungen von Fixum Objektservice",
    itemListElement: offerCatalog.map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        provider: { "@id": ids.business },
        areaServed: site.areaServed.slice(0, 6).join(", "),
      },
    })),
  },
};

/**
 * Aus diesem Knoten zieht Google den Quellennamen über dem Suchergebnis.
 * Steht er nicht da, nimmt Google die Domain - genau der Fall, der behoben
 * werden sollte. Entscheidend sind name, url auf der kanonischen Startseite
 * und die Schreibweisen unter alternateName.
 */
export const websiteSchema = {
  "@type": "WebSite",
  "@id": ids.website,
  url: `${site.domain}/`,
  name: site.name,
  alternateName: ["Fixum", "Fixum Objektservice Emden"],
  inLanguage: "de-DE",
  publisher: { "@id": ids.business },
};

export const faqPageSchema = {
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/** Breadcrumb-Knoten aus [Label, Pfad]-Paaren. Der Startseiten-Eintrag wird ergänzt. */
export const breadcrumbSchema = (trail: Array<[string, string]>) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Startseite", "/"], ...trail].map(
    ([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absolute(canonicalPath(path)),
    }),
  ),
});

/** Service-Knoten für eine einzelne Leistungsseite. */
export const serviceSchema = ({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) => ({
  "@type": "Service",
  name,
  description,
  serviceType: serviceType ?? name,
  url: absolute(canonicalPath(path)),
  provider: { "@id": ids.business },
  areaServed: site.areaServed.map((city) => ({ "@type": "City", name: city })),
  audience: {
    "@type": "Audience",
    audienceType:
      "Privatkunden, Hausverwaltungen, Bauunternehmen und Eigentümer",
  },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: absolute("/kontakt/"),
    servicePhone: {
      "@type": "ContactPoint",
      telephone: site.phoneDisplay,
      contactType: "customer service",
    },
  },
});
