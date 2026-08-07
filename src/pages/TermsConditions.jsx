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
          content="Terms & Conditions governing the use of GJ Event services, website, accounts, and event management features."
        />
        <link rel="canonical" href="https://gjevent.com/terms-conditions" />
      </Helmet>
      <LegalLayout eyebrow="Legal" title="Terms & Conditions">
        <Block
          heading="Acceptance of Terms"
          body="By accessing the GJ Event website, creating an account, using Google Sign-In, contacting our team, uploading content through authorised admin tools, or engaging our services, you agree to these Terms & Conditions. If you do not agree, please stop using the website and services."
        />
        <Block
          heading="Services"
          body="GJ Event provides event management services including Garba events, concerts, VIP pass distribution, corporate events, stall bazaars, gallery presentation, and related digital tools. Specific deliverables, dates, pricing, responsibilities, and event rules are confirmed separately for each booking, campaign, or partnership."
        />
        <Block
          heading="Accounts and Sign-In"
          body="Some website features may require an account. You may sign in with email and password or Google Sign-In where available. You are responsible for keeping your account access secure and for activity performed through your account. We may suspend or restrict access if we believe an account is misused, unauthorised, or harmful to the website, users, or event operations."
        />
        <Block
          heading="Admin and Uploaded Content"
          body="Gallery upload, replacement, and deletion features are intended only for authorised staff or administrators. Uploaded images and related titles or sections must be lawful, accurate, safe, and suitable for public display. GJ Event may remove content that is unauthorised, inappropriate, infringing, unsafe, or inconsistent with the website purpose."
        />
        <Block
          heading="Bookings, Payments, and Cancellations"
          body="Passes, stalls, vendor participation, sponsorships, and event bookings are confirmed only according to the agreed payment and confirmation process. Refunds, cancellations, entry conditions, transfer rules, and event-specific restrictions may vary by event and will be communicated at the time of booking or through official event communication."
        />
        <Block
          heading="User Conduct"
          body="Users, attendees, vendors, and partners must act lawfully and respectfully. You must not interfere with website security, upload malicious files, attempt unauthorised access, misuse Google Sign-In or account features, copy protected materials, or engage in conduct that harms event safety, operations, staff, partners, or other users."
        />
        <Block
          heading="Third-Party Services"
          body="The website may use third-party services for authentication, hosting, media, email, analytics, maps, forms, payment or booking support, and related operations. Your use of those services may also be governed by their own terms and privacy policies."
        />
        <Block
          heading="Intellectual Property"
          body="The GJ Event name, branding, website design, text, graphics, photos, event materials, and other content are owned by GJ Event or used with permission. You may not copy, reproduce, modify, sell, or distribute website or event materials without written permission, except as allowed by law."
        />
        <Block
          heading="Availability and Changes"
          body="We try to keep the website accurate and available, but we do not guarantee uninterrupted access, error-free operation, or that all information will always be current. We may update, suspend, or remove website features, legal pages, event information, or services when needed."
        />
        <Block
          heading="Limitation of Liability"
          body="To the maximum extent permitted by law, GJ Event is not liable for indirect, incidental, special, consequential, or punitive losses arising from website use, account access, event services, third-party services, or unavailable features. Where liability cannot be excluded, it is limited to the amount paid for the relevant service giving rise to the claim."
        />
        <Block
          heading="Governing Law"
          body="These terms are governed by the laws of India. Subject to applicable law, disputes shall be handled by the competent courts in Gujarat, India."
        />
        <Block
          heading="Contact"
          body="For questions about these Terms & Conditions, account access, bookings, or website use, contact GJ Event through the contact details listed on the website."
        />
        <LastUpdated />
      </LegalLayout>
    </>
  );
}
