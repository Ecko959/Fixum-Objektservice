/**
 * Die Ablaufkette der Startseite als Parallax-Scroll-Sequenz.
 *
 * Technik und Geometrie folgen der Vorlage "parallax-scroll-feature-section":
 * eine volle Bildschirmhöhe je Zeile, Text und quadratisches Bild mittig
 * nebeneinander, die Seiten wechseln von Zeile zu Zeile. Drei Werte hängen
 * am Scrollfortschritt:
 *
 *   opacity   0 -> 1                              über [0, 0.7]
 *   clipPath  inset(0 100% 0 0) -> inset(0 0 0 0) über [0, 0.7]
 *   y         -50 -> 0                            über [0, 1]
 *
 * Der y-Wert liegt sowohl auf dem Textblock als auch noch einmal auf dem
 * Absatz darin. Transformationen verschachteln sich, der Absatz läuft also
 * doppelt so weit - das ist der leichte Versatz zwischen Überschrift und
 * Fließtext, und er ist in der Vorlage genauso gemeint.
 *
 * Drei Dinge weichen bewusst ab, weil sie vorher ausdrücklich gefordert
 * waren und die Vorlage sie nicht kennt:
 *
 * 1. Auf dem Handy stehen Bild und Text untereinander und die Zeile ist
 *    nicht bildschirmhoch. Ein 320er Quadrat neben Text passt auf 390 px
 *    Breite nicht nebeneinander.
 *
 * 2. Bei prefers-reduced-motion und ohne JavaScript ist der Ausgangszustand
 *    der fertige. Die Vorlage startet mit opacity 0 und vollem clip - ohne
 *    Hydration bliebe die Sektion sonst dauerhaft leer.
 *
 * 3. Farben, Schriften und Rundungen stammen aus dem Design der Seite.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export type AblaufSchritt = {
  titel: string;
  text: string;
  /** Fertige Bild-URL. Erzeugt astro:assets, übergibt die Astro-Seite. */
  bild: string;
  alt: string;
};

type Props = {
  steps: AblaufSchritt[];
  telHref: string;
  whatsappHref: string;
};

/**
 * Wahr, sobald die Animation laufen darf: breiter Viewport, echter Zeiger,
 * keine reduzierte Bewegung. Startet mit false, damit Server und erster
 * Client-Durchlauf dasselbe ergeben.
 */
function useAnimationErlaubt() {
  const reduziert = useReducedMotion();
  const [breit, setBreit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const lies = () => setBreit(mq.matches);
    lies();
    mq.addEventListener("change", lies);
    return () => mq.removeEventListener("change", lies);
  }, []);

  return breit && !reduziert;
}

function Schritt({
  schritt,
  index,
  animiert,
}: {
  schritt: AblaufSchritt;
  index: number;
  animiert: boolean;
}) {
  const bereich = useRef<HTMLDivElement>(null);

  /* Wie in der Vorlage: von "Oberkante erreicht den unteren Fensterrand" bis
     "Mitte erreicht den oberen Fensterrand". Das ist ein langer Weg, deshalb
     läuft die Aufdeckung ruhig statt sprunghaft. */
  const { scrollYProgress } = useScroll({
    target: bereich,
    offset: ["start end", "center start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clip = useTransform(
    scrollYProgress,
    [0, 0.7],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  const gespiegelt = index % 2 === 1;
  const nummer = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={bereich}
      /* Zeilenhoehe: nicht h-screen, aber grosszuegig.
         Der Scrollweg fuer den vollen Effektverlauf ist Fensterhoehe plus
         halbe Zeilenhoehe - die Fensterhoehe dominiert. Eine kuerzere Zeile
         macht die Animation also kaum schneller, nimmt aber den Leerraum
         zwischen Bild und Text heraus. clamp deckelt nach oben, damit auf
         hohen Bildschirmen keine leeren Flaechen entstehen, und haelt unten
         genug Platz fuer das 416er Bild. */
      className={[
        "flex flex-col items-center justify-center gap-10 py-4",
        "md:min-h-[clamp(30rem,68vh,42rem)] md:flex-row md:gap-24 md:py-8 lg:gap-32",
        gespiegelt ? "md:flex-row-reverse" : "",
      ].join(" ")}
    >
      <motion.div style={animiert ? { y } : undefined} className="max-w-sm">
        <p className="font-utility text-sm font-bold uppercase tracking-[0.18em] text-blue">
          Schritt {nummer}
        </p>
        <h3 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] text-navy md:text-6xl">
          {schritt.titel}
        </h3>
        <motion.p
          style={animiert ? { y } : undefined}
          className="mt-6 text-base leading-relaxed text-muted md:mt-10"
        >
          {schritt.text}
        </motion.p>
      </motion.div>

      <motion.div
        style={animiert ? { opacity, clipPath: clip } : undefined}
        className="relative shrink-0"
      >
        <img
          src={schritt.bild}
          alt={schritt.alt}
          width={640}
          height={640}
          loading="lazy"
          decoding="async"
          className="size-72 rounded-2xl object-cover shadow-[0_18px_50px_-24px_rgba(19,42,92,0.45)] sm:size-80 lg:size-[26rem]"
        />
      </motion.div>
    </div>
  );
}

export default function AblaufScroll({ steps, telHref, whatsappHref }: Props) {
  const animiert = useAnimationErlaubt();

  return (
    <div className="flex flex-col">
      {steps.map((schritt, i) => (
        <Schritt
          key={schritt.titel}
          schritt={schritt}
          index={i}
          animiert={animiert}
        />
      ))}

      <div className="mt-10 rounded-2xl border border-line bg-mist px-6 py-10 text-center md:mt-16 md:px-10 md:py-12">
        <h3 className="font-display text-2xl font-extrabold text-navy md:text-3xl">
          Kostenlose Besichtigung anfragen
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted">
          Sie schildern kurz, worum es geht. Wir schauen uns das Objekt an und
          nennen danach einen Festpreis, der schriftlich gilt.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={telHref}
            className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 font-utility text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-blue-bright"
          >
            <Phone size={17} aria-hidden="true" />
            Jetzt anrufen
          </a>
          <a
            href={whatsappHref}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-6 py-3 font-utility text-sm font-bold uppercase tracking-[0.08em] text-navy transition-colors hover:border-blue hover:text-blue"
          >
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp schreiben
          </a>
        </div>
      </div>
    </div>
  );
}
