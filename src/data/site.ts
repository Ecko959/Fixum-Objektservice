export const site = {
  name: "Fixum Objektservice",
  owner: "Eckhard Singer",
  legalForm: "Einzelunternehmen",
  street: "Hermann-Allmers-Str. 13",
  zip: "26721",
  city: "Emden",
  country: "DE",
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
  claim: "Alles aus einer Hand",
  serviceLine: "Entrümpelung | Entkernung | Trockenbau | Montage",
  smallBusinessNote:
    "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher in Rechnungen nicht ausgewiesen.",
  showReferences: true,
  showTestimonials: false,
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

export const addressLines = [
  site.owner,
  site.name,
  site.street,
  `${site.zip} ${site.city}`,
];

export const navItems = [
  { label: "Startseite", href: "/" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Für Firmen", href: "/fuer-hausverwaltungen" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const whatsappUrl = (topic = "Moin, ich habe eine Anfrage zu:") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(topic)}`;

export const telUrl = `tel:${site.phoneLink}`;
export const mailUrl = `mailto:${site.email}`;
