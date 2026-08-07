import React from "react";
import { Helmet } from "react-helmet-async";
import LegalLayout, { Block, LastUpdated } from "@/components/layout/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | GJ Event</title>
        <meta
          name="description"
          content="Privacy Policy for GJ Event — how we collect, use and protect your information."
        />
        <link rel="canonical" href="https://gjevent.com/privacy-policy" />
      </Helmet>
      <LegalLayout eyebrow="Legal" title="Privacy Policy">
        <Block
          heading="Introduction"
          body="GJ Event (“we”, “our”, “us”) is committed to protecting the privacy of our visitors and partners. This Privacy Policy explains how we collect, use and safeguard information when you interact with our website and services."
        />
        <Block
          heading="Information We Collect"
          body="We may collect contact details such as name and phone number when you reach out to our team, as well as non-personal analytics data (e.g. pages visited, device type) to improve our platform."
        />
        <Block
          heading="How We Use Information"
          body="Information is used to respond to enquiries, deliver passes and stall bookings, improve our services, and inform you about upcoming events and our future platform — only where you have consented."
        />
        <Block
          heading="Data Security"
          body="We apply industry-standard measures to protect your information. Access is restricted to authorised personnel and is never sold to third parties."
        />
        <Block
          heading="Your Rights"
          body="You may request access to, correction of, or deletion of your personal data at any time by contacting our team. We will respond in a reasonable timeframe."
        />
        <Block
          heading="Changes to This Policy"
          body="We may update this Privacy Policy as our platform evolves. Updates will be posted on this page with a revised date."
        />
        <LastUpdated />
      </LegalLayout>
    </>
  );
}