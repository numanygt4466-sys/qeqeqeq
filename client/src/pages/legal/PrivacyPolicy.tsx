import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white" data-testid="page-privacy">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              Raw Archives Records N.V. ("Company," "we," "us," or "our") collects information you provide directly when you create an account, including your name, email address, artist or label name, profile information, catalog details, and payment information. We also automatically collect certain information when you use our platform, including your IP address, browser type, device information, and usage data such as pages visited and features used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide, maintain, and improve our music distribution platform and services.</li>
              <li>Process your music releases and distribute content to digital service providers (DSPs).</li>
              <li>Calculate, track, and process royalty payments and earnings.</li>
              <li>Send you technical notices, updates, security alerts, and administrative messages.</li>
              <li>Respond to your comments, questions, and support requests.</li>
              <li>Monitor and analyze trends, usage patterns, and platform performance.</li>
              <li>Detect, prevent, and address fraud, abuse, and technical issues.</li>
              <li>Comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing</h2>
            <p>
              We share your content and associated metadata with digital service providers (DSPs) as necessary to distribute your music to streaming platforms and digital stores worldwide. We may also share information with payment processors to facilitate royalty payouts, and with service providers who assist us in operating our platform.
            </p>
            <p className="mt-3">
              We do not sell your personal information to third parties. We may share aggregated or de-identified information that cannot reasonably be used to identify you. We may disclose your information if required by law, legal process, or governmental request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to operate our platform, remember your preferences, and analyze how our services are used. Essential cookies are required for the platform to function properly, including session management and authentication. For more detailed information about the cookies we use and how to manage them, please visit our <Link href="/cookie-choices" className="text-gray-900 underline hover:text-gray-700">Cookie Choices</Link> page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide our services. Distribution metadata, royalty reports, and financial records may be retained for extended periods as required by our agreements with DSPs and applicable accounting and tax regulations. Upon account deletion, we will remove your personal data within a reasonable timeframe, subject to legal and contractual obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, subject to legal obligations.</li>
              <li>Object to or restrict the processing of your data.</li>
              <li>Request portability of your data in a structured, machine-readable format.</li>
              <li>Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at privacy@rawarchivesrecords.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information, including encryption of sensitive data, secure authentication mechanisms, and regular security assessments. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information promptly. If you believe we may have collected information from a child under 16, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-3">
              Raw Archives Records N.V.<br />
              Email: privacy@rawarchivesrecords.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
