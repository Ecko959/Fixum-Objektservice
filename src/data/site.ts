export const site = {
  name: "Fixum Objektservice",
  legalName: "Fixum Objektservice, Inhaber Eckhard Singer",
  owner: "Eckhard Singer",
  legalForm: "Einzelunternehmen",
  street: "Hermann-Allmers-Str. 13",
  zip: "26721",
  city: "Emden",
  region: "Niedersachsen",
  regionCode: "DE-NI",
  country: "DE",
  countryName: "Deutschland",
  phoneDisplay: "+49 151 / 29628025",
  phoneLink: "+4915129628025",
  whatsapp: "4915129628025",
  email: "info@fixum-objektservice.de",
  domain: "https://fixum-objektservice.de",
  taxId: "",
  chamber: "Handwerkskammer für Ostfriesland, Aurich",
  googleProfile: "",
  hours: "Mo-Sa, 7:00-19:00 Uhr",
  radiusKm: 50,
  foundingYear: "2024",
  claim: "Alles aus einer Hand",
  /* Kursive Zeile über der Hero-Überschrift. Bewusst nicht der Slogan:
     der steht im Footer und als schema.org-slogan und soll nicht doppeln. */
  heroLine: "Ihr Partner für zuverlässige Projekte",
  serviceLine: "Entrümpelung | Entkernung | Trockenbau | Montage",
  smallBusinessNote:
    "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher in Rechnungen nicht ausgewiesen.",
  showReferences: true,
  showTestimonials: false,
  /* Rathaus Emden als Ortsmittelpunkt - Basis für lokale Suchsignale. */
  geo: { lat: 53.3671, lng: 7.2061 },
  ogImage: "/og.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt:
    "Fixum Objektservice Emden - Entrümpelung, Entkernung, Trockenbau und Montage",
  /* Öffnungszeiten maschinenlesbar für schema.org */
  openingHours: [
    {
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  areaServed: [
    "Emden",
    "Aurich",
    "Leer",
    "Norden",
    "Norddeich",
    "Krummhörn",
    "Hinte",
    "Moormerland",
    "Weener",
    "Wiesmoor",
    "Großefehn",
    "Ihlow",
    "Südbrookmerland",
    "Westoverledingen",
    "Papenburg",
    "Wittmund",
    "Uplengen",
  ],
};

/** Profile, die schema.org als sameAs bestätigt bekommt. Leere Einträge fliegen raus. */
export const sameAs = [site.googleProfile].filter(Boolean);

export const addressLines = [
  site.owner,
  site.name,
  site.street,
  `${site.zip} ${site.city}`,
];

export const navItems = [
  { label: "Startseite", href: "/" },
  { label: "Leistungen", href: "/leistungen/" },
  { label: "Für Firmen", href: "/fuer-hausverwaltungen/" },
  { label: "Über uns", href: "/ueber-uns/" },
  { label: "Kontakt", href: "/kontakt/" },
];

export const whatsappUrl = (topic = "Moin, ich habe eine Anfrage zu:") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(topic)}`;

export const telUrl = `tel:${site.phoneLink}`;
export const mailUrl = `mailto:${site.email}`;
