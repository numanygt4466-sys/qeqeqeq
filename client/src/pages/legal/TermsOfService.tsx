import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white" data-testid="page-terms">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the services provided by Raw Archives Records N.V. ("Company," "we," "us," or "our"), including our website, platform, and music distribution services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our services.
            </p>
            <p className="mt-3">
              We reserve the right to modify these Terms at any time. Your continued use of our services following any changes constitutes your acceptance of the revised Terms. We will notify registered users of material changes via email or platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. User Accounts</h2>
            <p>
              To access certain features of our platform, you must create an account and submit an application for approval. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="mt-3">
              You must be at least 18 years of age to create an account. If you are between 16 and 18, you may only use our services with the consent and supervision of a parent or legal guardian. We reserve the right to suspend or terminate accounts that violate these Terms or that remain inactive for an extended period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our platform, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of Raw Archives Records N.V. or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mt-3">
              By submitting music, artwork, or other content to our platform, you represent and warrant that you own or have obtained all necessary rights, licenses, and permissions to distribute such content. You retain ownership of your original content but grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, distribute, and display your content as necessary to provide our distribution services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Content and Music Distribution</h2>
            <p>
              Our platform facilitates the distribution of music and related content to digital service providers (DSPs) and streaming platforms worldwide. By using our distribution services, you agree to the following:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>All submitted content must comply with applicable laws and regulations, including copyright and intellectual property laws.</li>
              <li>You will not submit content that is defamatory, obscene, infringing, or otherwise unlawful.</li>
              <li>We reserve the right to review, approve, or reject any content submitted for distribution at our sole discretion.</li>
              <li>Distribution timelines may vary depending on DSP requirements and processing times.</li>
              <li>You are solely responsible for the accuracy of metadata, credits, and other information associated with your releases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Payment Terms</h2>
            <p>
              Revenue generated from the distribution of your content through our platform will be calculated and distributed according to the applicable royalty rates and payment schedules. Payments are subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Earnings are calculated based on reports received from DSPs and streaming platforms.</li>
              <li>Payments are processed on a monthly or quarterly basis, depending on your account type and agreement.</li>
              <li>A minimum payout threshold may apply before earnings can be withdrawn.</li>
              <li>You are responsible for providing accurate payment information and for any applicable taxes on your earnings.</li>
              <li>We reserve the right to withhold payments in cases of suspected fraud, rights disputes, or Terms violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
            <p>
              We may suspend or terminate your account and access to our services at any time, with or without cause, and with or without notice. Grounds for termination include, but are not limited to, violation of these Terms, copyright infringement claims, fraudulent activity, or extended account inactivity.
            </p>
            <p className="mt-3">
              Upon termination, your right to use our services will immediately cease. We will make reasonable efforts to process any pending payments for earnings accrued prior to termination, subject to our standard verification procedures. Content previously distributed through our platform may remain available on DSPs according to their respective policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Raw Archives Records N.V. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of our services.
            </p>
            <p className="mt-3">
              Our total liability for any claims arising under these Terms shall not exceed the total amount paid to you through our platform in the twelve (12) months preceding the claim. We do not guarantee uninterrupted or error-free operation of our services and are not liable for any delays, failures, or interruptions in content distribution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Raw Archives Records N.V. is incorporated, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services shall be resolved exclusively in the competent courts of that jurisdiction.
            </p>
            <p className="mt-3">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-3">
              Raw Archives Records N.V.<br />
              Email: legal@rawarchivesrecords.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
