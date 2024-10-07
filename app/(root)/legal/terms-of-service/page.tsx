import React from 'react';
import Link from "next/link";

const email = 'fredlemi@gmail.com';
const appName = 'Eventos Rincon';

export default function PrivacyPolicy() {
  return (
    <section
      className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10 flex justify-center px-5">
      <article className="md:w-2/3"><h1 className="text-3xl font-bold">Terms of Service</h1>

        <p>Effective Date: 07/10/2024</p>
        <br/>

        <h2 className="h4-medium">1. Acceptance of Terms</h2>
        <p>By accessing or using {appName}, you agree to comply with and be bound by these Terms of
          Service. Please read these terms carefully. If you do not agree with these terms, you
          should not use this platform.</p>
        <br/>

        <h2 className="h4-medium">2. Description of Service</h2>
        <p>{appName} is an event listing platform where users can post and search for local events
          happening in Rincon de la Victoria, Spain. The service allows users to create accounts,
          post events, and browse through a variety of events such as concerts, theater
          performances, and more.</p>
        <br/>

        <h2 className="h4-medium">3. User Accounts</h2>
        <p>
          In order to post events or access certain features of the service, you are required to
          create an account. You are responsible for maintaining the confidentiality of your login
          credentials and for any activities that occur under your account. You must provide
          accurate and complete information when creating an account.</p>
        <br/>

        <h2 className="h4-medium">4. User Conduct</h2>
        <p>By using the platform, you agree to the following conduct guidelines:</p>
        <ul className="list-disc pl-5">
          <li className="list-item">- Post only events that are legal and appropriate. The posting
            of
            pornographic or sexual content, including but not limited to orgies and sex parties, is
            strictly prohibited.
          </li>
          <li className="list-item">- Respect other users and the platform’s community. Any abusive,
            harassing, or harmful behavior will result in account suspension or termination.
          </li>
          <li className="list-item">- Do not engage in spamming or unauthorized advertising.</li>
          <li className="list-item">- Users must not post false or misleading information about
            events.
          </li>
        </ul>
        <br/>

        <h2 className="h4-medium">5. Content Ownership and Responsibility</h2>
        <p>
          Users retain ownership of the content they post, but by posting content on {appName},
          you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display
          your content in connection with the service. You are solely responsible for the content
          you post and must ensure it complies with all applicable laws and regulations.</p>
        <br/>

        <h2 className="h4-medium">6. Data Usage and Privacy</h2>
        <p>We store basic user and event-related data, such as your email address and event details.
          For more information about how we handle your data, please refer to our
          <Link href="/legal/privacy-policy"
                className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            {" "}privacy policy
          </Link>.
        </p>
        <br/>

        <h2 className="h4-medium">7. Geographic Restrictions</h2>
        <p>
          {appName} is intended to list events that take place in Rincon de la Victoria, Spain. We
          do not guarantee that events outside this area will be supported by our service.
        </p>
        <br/>

        <h2 className="h4-medium">8. Changes to the Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the service at any
          time, with or without notice.</p>
        <br/>

        <h2 className="h4-medium">9. Termination of Accounts</h2>
        <p>
          We may terminate or suspend your account if you violate any terms outlined in this
          agreement. Upon termination, your right to access the platform will cease immediately.
        </p>
        <br/>

        <h2 className="h4-medium">10. Disclaimer</h2>
        <p>The platform and all content are provided "as is" without any warranties, express or
          implied. We do not guarantee the accuracy, reliability, or completeness of any event
          information listed on the platform.</p>
        <br/>

        <h2 className="h4-medium">11. Governing Law</h2>
        <p>
          These terms are governed by the laws of Spain. Any disputes arising from or relating to
          these terms or the service will be resolved in the courts of Andalusia.</p>
        <br/>

        <h2 className="h4-medium">12. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at
          <Link href={`mailto:${email}`}
                className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            {" "}{email}
          </Link>.
        </p>
        <br/>
      </article>
    </section>
  );
}

