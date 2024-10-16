import React from 'react';
import Link from 'next/link';

const email = 'fredlemi@gmail.com';
const appName = 'Eventos Rincon';

export default function PrivacyPolicy() {
  return (
    <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain px-5 py-5 md:py-10'>
      <article className='md:w-2/3'>
        <h1 className='h2-bold'>Privacy Policy for {appName}</h1>
        <p>
          <strong>Last Updated:</strong> 07/10/2024
        </p>
        <br />
        <p>
          We at [Your Company Name] ("we," "our," or "us") are committed to
          protecting your privacy. This Privacy Policy outlines how we collect,
          use, and protect the personal information you provide to us when using{' '}
          {appName} (the "App").
        </p>
        <br />
        <h2 className='h4-medium'>1. Information We Collect</h2>
        <p>
          We collect the following information when you use Google Sign-In to
          access the App:
        </p>

        <p>
          <ul className='list-desc list-inside pl-5'>
            {/*TODO! Fix UL list*/}
            <li className='list-item'>
              <strong>- Personal Information</strong>: When you sign in using
              Google/Facebook, we may collect your name, email address, profile
              picture, and Google/Facebook ID.
            </li>
            <li className='list-item'>
              <strong>- Usage Data</strong>: We may collect information about
              how you interact with the App, including pages visited, features
              used, and device information such as IP address, browser type, and
              operating system.
            </li>
          </ul>
        </p>
        <br />
        <h2 className='h4-medium'>2. How We Use Your Information</h2>
        <p>
          The personal information we collect through Google/Facebook Auth is
          used for the following purposes:
        </p>
        <ul className='list-disc pl-5'>
          <li>
            <strong>- Authentication and Account Access</strong>: To provide
            secure login access to the App and authenticate your identity.
          </li>
          <li>
            <strong>- Personalization</strong>: To customize your experience
            within the App.
          </li>
          <li>
            <strong>- Communication</strong>: To communicate with you about App
            updates, features, and support if necessary.
          </li>
        </ul>
        <p>
          We do not sell or share your personal information with third-party
          entities except as required for legal purposes or to fulfill the
          services provided by the App.
        </p>
        <br />
        <h2 className='h4-medium'>3. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is
          active or as needed to provide the App's services. If you wish to
          delete your account and associated data, you can contact us at{' '}
          <Link
            href={`mailto:${email}`}
            className='text-blue-600 hover:underline dark:text-blue-500'
          >
            {' '}
            {email}
          </Link>
          .
        </p>
        <br />
        <h2 className='h4-medium'>4. Third-Party Services</h2>
        <p>
          The App integrates Google services such as Google and Facebook
          Sign-In. By using these services, you are also subject to
          <Link
            href='https://policies.google.com/privacy'
            className='text-blue-600 hover:underline dark:text-blue-500'
          >
            {' '}
            Google's Privacy Policy
          </Link>{' '}
          and
          <Link
            href='https://www.facebook.com/privacy/policy/'
            className='text-blue-600 hover:underline dark:text-blue-500'
          >
            {' '}
            Facebook's Privacy Policy
          </Link>
          .
        </p>
        <br />
        <h2 className='h4-medium'>5. Security</h2>
        <p>
          We use industry-standard security measures to protect your personal
          information from unauthorized access, disclosure, or destructin.
          However, no method of transmission over the Internet is entirely
          secure, so we cannot guarantee absolute security.
        </p>
        <br />
        <h2 className='h4-medium'>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information at any time. To exercise these rights, please contact us
          at <Link href={`mailto:${email}`}>{email}</Link>.
        </p>
        <br />
        <h2 className='h4-medium'>7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. When we do, we will
          revise the "Last Updated" date at the top of this page. We encourage
          you to review this policy regularly.
        </p>
        <br />
        <h2 className='h4-medium'>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how
          we handle your personal information, please contact us at:
        </p>
        <p>
          <Link
            href='https://www.eventos-rincon.fyi/'
            className='text-blue-600 hover:underline dark:text-blue-500'
          >
            {appName}
          </Link>{' '}
          <br />
          Email:{' '}
          <Link
            href={`mailto:${email}`}
            className='text-blue-600 hover:underline dark:text-blue-500'
          >
            {email}
          </Link>
        </p>
      </article>
    </section>
  );
}
