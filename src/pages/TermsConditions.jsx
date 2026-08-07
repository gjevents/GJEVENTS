import React from "react";
import { Helmet } from "react-helmet-async";
import LegalLayout, { Block, LastUpdated } from "@/components/layout/LegalLayout";

export default function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions | GJ Event</title>
        <meta
          name="description"
          content="Terms & Conditions governing the use of GJ Event services and website."
        />
        <link rel="canonical" href="https://gjevent.com/terms-conditions" />
      </Helmet>
      <LegalLayout eyebrow="Legal" title="Terms & Conditions">
        <Block
          heading="Acceptance of Terms"
          body="By accessing the GJ Event website and engaging our services, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our services."
        />
        <Block
          heading="Services"
          body="GJ Event provides event management including Garba events, concerts, VIP pass distribution, corporate events and stall bazaars. Details of specific services are confirmed at the time of booking."
        />
        <Block
          heading="Bookings & Payments"
          body="Passes, stalls and event bookings are confirmed only upon receipt of agreed payment. Refund and cancellation terms are communicated at the time of booking and may vary per event."
        />
        <Block
          heading="Conduct"
          body="Attendees and partners are expected to conduct themselves respectfully. GJ Event reserves the right to refuse entry or service where conduct compromises safety or the event experience."
        />
        <Block
          heading="Intellectual Property"
          body="All branding, content and materials on this site are the property of GJ Event and may not be reproduced without written permission."
        />
        <Block
          heading="Limitation of Liability"
          body="GJ Event is not liable for indirect or consequential losses arising from the use of our services. Our liability is limited to the value of the service provided."
        />
        <Block
          heading="Governing Law"
          body="These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Gujarat."
        />
        <LastUpdated />
      </LegalLayout>
    </>
  );
}