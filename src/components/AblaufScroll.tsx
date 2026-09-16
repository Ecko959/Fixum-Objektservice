/**
 * Die Ablaufkette der Startseite als Scroll-Sequenz.
 *
 * Aufbau: Pro Schritt eine Zeile, Text und Bild wechseln die Seite. Beim
 * Hereinscrollen wird das Bild per clip-path von links aufgedeckt, der Text
 * laeuft leicht versetzt mit.
 *
 * Drei Dinge, die den Aufbau bestimmen:
 *
 * 1. Jeder Schritt ist eine eigene Komponente. Hooks duerfen nicht in einer
 *    .map()-Schleife stehen - React erkennt Hooks ueber ihre Aufrufreihenfolge,
 *    und die waere bei einer wechselnden Anzahl von Schritten nicht stabil.
 *
 * 2. Der Ausgangszustand ist der sichtbare. Die Komponente haengt sich erst
 *    mit client:visible ein; waere das Bild vorher weggeblendet oder
 *    beschnitten, sähe man bis zur Hydration nichts - und ohne JavaScript
 *    dauerhaft nichts.
 *
 * 3. Animiert wird nur auf grossen Zeigegeraeten und nur, wenn niemand
 *    reduzierte Bewegung eingestellt hat. Auf dem Handy stehen die Schritte
 *    schlicht untereinander.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export type AblaufSchritt = {
  titel: string;
  text: string;
  /** Fertige Bild-URL. Erzeugt astro:assets, uebergibt die Astro-Seite. */
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

  /* "start end" = Oberkante der Zeile erreicht die Unterkante des Fensters,
     "center center" = Zeile steht mittig. Dazwischen laeuft die Animation ab,
     sie ist also fertig, bevor die Zeile den oberen Rand erreicht. */
  const { scrollYProgress } = useScroll({
    target: bereich,
    offset: ["start end", "center center"],
  });

  const clip = useTransform(
    scrollYProgress,
    [0, 0.75],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const textY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const gespiegelt = index % 2 === 1;
  const nummer = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={bereich}
      /* Die Mindesthöhe ist bewusst knapp über der Bildhöhe. Mit 70vh stand
         zwischen den Zeilen mehr Leerraum als Inhalt; die Animation braucht
         die Höhe nicht, weil ihr Weg ohnehin vom Fenster bestimmt wird. */
      className={[
        "grid items-center gap-6 py-6",
        "md:min-h-[46vh] md:grid-cols-2 md:gap-14 md:py-8",
        gespiegelt ? "md:[&>*:first-child]:order-2" : "",
      ].join(" ")}
    >
      <motion.div
        style={animiert ? { y: textY, opacity: textOpacity } : undefined}
        className="max-w-lg"
      >
        <p className="font-utility text-sm font-bold uppercase tracking-[0.18em] text-blue">
          Schritt {nummer}
        </p>
        <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
          {schritt.titel}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted">{schritt.text}</p>
      </motion.div>

      <motion.div
        style={animiert ? { clipPath: clip } : undefined}
        className="overflow-hidden rounded-2xl border border-line bg-mist shadow-[0_18px_50px_-24px_rgba(19,42,92,0.45)]"
      >
        <img
          src={schritt.bild}
          alt={schritt.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block aspect-[8/5] w-full object-cover"
        />
      </motion.div>
    </div>
  );
}

export default function AblaufScroll({ steps, telHref, whatsappHref }: Props) {
  const animiert = useAnimationErlaubt();

  return (
    <div>
      {steps.map((schritt, i) => (
        <Schritt
          key={schritt.titel}
          schritt={schritt}
          index={i}
          animiert={animiert}
        />
      ))}

      <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10 text-center md:px-10 md:py-12">
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
