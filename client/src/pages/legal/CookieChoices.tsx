import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CookieChoices() {
  return (
    <div className="min-h-screen bg-white" data-testid="page-cookies">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Choices</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to website operators. Raw Archives Records N.V. uses cookies to ensure our platform functions properly and to improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h2>
            <p>
              These cookies are strictly necessary for the operation of our platform. They enable core functionality such as user authentication, session management, and security features. Without these cookies, the platform cannot function properly. Essential cookies cannot be disabled.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Session cookies:</strong> Keep you logged in while you navigate the platform.</li>
              <li><strong>Security cookies:</strong> Help protect your account from unauthorized access.</li>
              <li><strong>Consent cookies:</strong> Remember your cookie preferences so you are not asked repeatedly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h2>
            <p>
              Analytics cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously. This data allows us to measure and improve the performance of our services, identify popular features, and detect potential issues. All information collected by analytics cookies is aggregated and does not identify individual users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Preference Cookies</h2>
            <p>
              Preference cookies enable our platform to remember choices you make, such as your language preference, display settings, and interface customizations. These cookies enhance your experience by providing personalized features and content without requiring you to reconfigure your settings each time you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Manage Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to view, delete, and block cookies from websites. Please note that disabling certain cookies may affect the functionality of our platform and your ability to use some features.
            </p>
            <p className="mt-3">To manage cookies in common browsers:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
              <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
              <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
            </ul>
            <p className="mt-3">
              You can also opt out of analytics cookies by using browser extensions designed to block tracking, or by adjusting your cookie preferences when prompted by our consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
            <p>
              Our platform may use third-party services that set their own cookies, such as analytics providers. These third-party cookies are governed by the respective privacy policies of those services. Raw Archives Records N.V. does not use third-party advertising cookies or share cookie data with advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Choices page, please contact us at:
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
