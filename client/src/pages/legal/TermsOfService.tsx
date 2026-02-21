import { Link } from "wouter";
import { Disc, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Disc className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-lg tracking-wider uppercase text-gray-900">RAW ARCHIVES</span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-tos-title">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the RAW ARCHIVES platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>RAW ARCHIVES provides a digital music distribution platform that enables artists, labels, and distributors to upload, manage, and distribute their music to digital service providers (DSPs) worldwide. The Service includes, but is not limited to, content management, royalty tracking, analytics, and payout processing.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Account Registration</h2>
              <p>To use the Service, you must create an account and submit an application for approval. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Content Ownership & Licensing</h2>
              <p>You retain all rights to the content you upload to the platform. By uploading content, you grant RAW ARCHIVES a non-exclusive, worldwide license to distribute, reproduce, and display your content solely for the purpose of providing the Service. You represent and warrant that you have all necessary rights and permissions to distribute the content through our platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Distribution & Revenue</h2>
              <p>RAW ARCHIVES will distribute your content to selected DSPs according to your preferences. Revenue generated from streams, downloads, and other forms of consumption will be tracked and reported in your dashboard. Payouts are subject to a minimum threshold of $50.00 and will be processed according to the payout schedule and method selected in your account settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Prohibited Content</h2>
              <p>You may not upload, distribute, or transmit content that: (a) infringes any intellectual property or other proprietary rights; (b) contains explicit or illegal material without proper labeling; (c) is fraudulent, deceptive, or misleading; (d) violates any applicable law or regulation; or (e) contains malware or any harmful code.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Account Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the Service will immediately cease. Outstanding earnings will be paid out according to the standard payout schedule, provided the minimum threshold is met.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>In no event shall RAW ARCHIVES, its directors, employees, partners, agents, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Continued use of the Service after changes constitute acceptance of the modified Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
              <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@rawarchives.com" className="text-indigo-600 hover:text-indigo-700">legal@rawarchives.com</a>.</p>
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
