import { Link } from "wouter";
import { Disc, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Disc className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-lg tracking-wider uppercase text-gray-900">RAW ARCHIVES</span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-privacy-title">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly when you create an account, including your name, email address, artist/label name, Spotify profile link, catalog information, and revenue details. We also collect information about your use of the platform, including content uploads, distribution preferences, and payout history.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to: (a) provide, maintain, and improve the Service; (b) process transactions and send related information; (c) send you technical notices, updates, security alerts, and support messages; (d) respond to your comments, questions, and requests; (e) monitor and analyze trends, usage, and activities; and (f) comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
              <p>We share your content and associated metadata with digital service providers (DSPs) as necessary to distribute your music. We may share aggregated or de-identified information that cannot reasonably be used to identify you. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security. We use industry-standard encryption for sensitive data including passwords and financial information.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. Distribution metadata and reporting data may be retained for royalty accounting purposes as required by our agreements with DSPs.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to: (a) access the personal information we hold about you; (b) request correction of inaccurate data; (c) request deletion of your data; (d) object to processing of your data; (e) request data portability; and (f) withdraw consent at any time. To exercise these rights, contact us at the email address below.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own, including countries where DSPs operate. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws when transferring data internationally.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p>The Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:privacy@rawarchives.com" className="text-indigo-600 hover:text-indigo-700">privacy@rawarchives.com</a>.</p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
