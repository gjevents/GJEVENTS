import React from "react";
import { Helmet } from "react-helmet-async";
import LegalLayout, { Block, LastUpdated } from "@/components/layout/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | GJ Events</title>
        <meta
          name="description"
          content="Privacy Policy for GJ Events, including how we collect, use, store, share, and protect account and Google Sign-In data."
        />
        <link rel="canonical" href="https://gjevents.in/privacy-policy" />
      </Helmet>
      <LegalLayout eyebrow="Legal" title="Privacy Policy">
        <Block
          heading="Who We Are"
          body="GJ Events provides event management services, pass and stall coordination, gallery management, and related digital experiences for visitors, partners, and account users. This Privacy Policy explains how we collect, use, store, share, and protect information when you use our website, account features, Google Sign-In, and services."
        />
        <Block
          heading="Information We Collect"
          body="We may collect contact details such as name, email address, phone number, booking or enquiry details, account login information, and messages you send to us. If you create an account using email and password, our authentication provider processes your credentials. If you use Google Sign-In, we receive basic Google account information needed to authenticate you, such as your email address, name, and profile identifier, depending on the permissions shown on the Google consent screen."
        />
        <Block
          heading="Google User Data"
          body="We use Google Sign-In only to let users register, log in, and access permitted account or admin features. We do not use Google user data for advertising, retargeting, credit decisions, surveillance, or sale to data brokers. We request only the minimum Google permissions needed for sign-in, and our use of Google user data is limited to providing and securing the user-facing features of this website."
        />
        <Block
          heading="How We Use Information"
          body="We use information to provide and manage event services, respond to enquiries, support pass and stall coordination, authenticate users, protect accounts, operate the gallery and admin tools, improve the website, prevent misuse, and comply with legal obligations. We may also use contact information to send service-related updates or event communications where permitted by law or consented to by you."
        />
        <Block
          heading="Storage and Security"
          body="Account and authentication data is handled through our authentication platform and related service providers. Website and gallery data may be stored in our application database and media storage. We use reasonable security measures including HTTPS in production, access controls, staff-only admin actions, file type and size validation for uploads, CSRF protection, and restricted operational access."
        />
        <Block
          heading="Sharing of Information"
          body="We do not sell your personal information or Google user data. We may share limited information with service providers that help us operate the website, authentication, hosting, communication, event delivery, payment or booking support, and security. We may disclose information when required by law, to protect rights and safety, or with your direction or consent."
        />
        <Block
          heading="Cookies and Local Storage"
          body="The website may use cookies, sessions, and browser storage to keep users signed in, protect forms, remember interface state such as the splash screen, store authentication tokens where required by the auth provider, and maintain secure app configuration. You can control cookies through your browser, but some account features may not work without them."
        />
        <Block
          heading="Retention and Deletion"
          body="We keep personal information only as long as needed for the purposes described in this policy, including account management, event support, security, legal compliance, and business records. You may request access, correction, or deletion of your personal data by contacting us. We will respond in a reasonable timeframe, subject to legal or security requirements."
        />
        <Block
          heading="Children"
          body="Our services are intended for business partners, event attendees, and users who can lawfully use event and account services. We do not knowingly collect personal information from children without appropriate consent."
        />
        <Block
          heading="Contact"
          body="For privacy questions, data requests, or Google Sign-In concerns, contact GJ Events through the contact details listed on our website. Please include enough information for us to identify your account or request."
        />
        <Block
          heading="Changes to This Policy"
          body="We may update this Privacy Policy as our services, website, or legal requirements change. Updates will be posted on this page with a revised date."
        />
        <LastUpdated />
      </LegalLayout>
    </>
  );
}
