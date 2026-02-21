import { Link } from "wouter";
import { Disc, ArrowLeft } from "lucide-react";

export default function CookieChoices() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Disc className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-lg tracking-wider uppercase text-gray-900">RAW ARCHIVES</span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-cookie-title">Cookie Choices</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
              <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website operators. RAW ARCHIVES uses cookies to ensure the platform functions properly and to improve your experience.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Essential Cookies</h2>
              <p>These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in, setting your privacy preferences, or filling in forms. These include session cookies that keep you logged in while you use the platform.</p>
              <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-500 uppercase tracking-wider">
                      <th className="pb-2 font-medium">Cookie</th>
                      <th className="pb-2 font-medium">Purpose</th>
                      <th className="pb-2 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-t border-gray-100">
                      <td className="py-2 font-mono">connect.sid</td>
                      <td className="py-2">Session authentication</td>
                      <td className="py-2">Session / 24 hours</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="py-2 font-mono">sidebar_state</td>
                      <td className="py-2">Sidebar open/closed preference</td>
                      <td className="py-2">7 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Functional Cookies</h2>
              <p>These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Analytics Cookies</h2>
              <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our platform. They help us know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and anonymous.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Managing Your Cookie Preferences</h2>
              <p>Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to alert you when cookies are being sent. Please note that if you disable cookies, some features of the platform may not function properly.</p>
              <p className="mt-3">To manage cookies in your browser:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
              <p>RAW ARCHIVES does not use third-party advertising cookies. We may use analytics services that place their own cookies to help us understand how our platform is used. These services process data in accordance with their own privacy policies.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@rawarchives.com" className="text-indigo-600 hover:text-indigo-700">privacy@rawarchives.com</a>.</p>
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
