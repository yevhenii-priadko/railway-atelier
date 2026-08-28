import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Nav locale={locale} dict={dict} pathWithoutLocale="/" />
      <Hero locale={locale} dict={dict} />
      <About dict={dict} />
      <div className="tiffany-rule" />
      <Services dict={dict} />
      <Process dict={dict} />
      <Gallery locale={locale} dict={dict} />
      <Contact dict={dict} />
      <Footer locale={locale} dict={dict} />
    </>
  );
}
