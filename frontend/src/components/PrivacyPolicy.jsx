import React from "react"
import "./LegalPages.css"

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">
          <strong>Last Updated: August 25, 2024</strong>
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Aluma ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our content engine
            service designed for career coaches.
          </p>
          <p>
            By using Aluma, you consent to the data practices described in this
            policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Information</h3>
          <p>
            We collect personal information that you provide directly to us,
            including:
          </p>
          <ul>
            <li>
              <strong>Name and Email Address</strong>: When you create an
              account using Google OAuth
            </li>
            <li>
              <strong>Profile Information</strong>: Business name, profession,
              coaching expertise, and ideal client information
            </li>
            <li>
              <strong>Communication Preferences</strong>: Your consent for email
              communications
            </li>
          </ul>

          <h3>2.2 Content and Files</h3>
          <p>We collect and process the content you upload to our service:</p>
          <ul>
            <li>
              <strong>Session Recordings</strong>: Audio and video files from
              coaching sessions
            </li>
            <li>
              <strong>Documents and Notes</strong>: Text files, PDFs, and other
              documents
            </li>
            <li>
              <strong>Text Input</strong>: Manually entered content and notes
            </li>
            <li>
              <strong>Generated Content</strong>: Summaries, social media posts,
              and email follow-ups created by our AI
            </li>
          </ul>

          <h3>2.3 Usage Information</h3>
          <p>
            We automatically collect certain information about your use of the
            service:
          </p>
          <ul>
            <li>
              <strong>Log Data</strong>: IP addresses, browser type, operating
              system, and access times
            </li>
            <li>
              <strong>Usage Patterns</strong>: How you interact with our
              features and content
            </li>
            <li>
              <strong>Device Information</strong>: Device type, screen
              resolution, and language preferences
            </li>
          </ul>

          <h3>2.4 Technical Information</h3>
          <p>
            We collect technical information to ensure service functionality:
          </p>
          <ul>
            <li>
              <strong>Authentication Data</strong>: Google OAuth tokens and
              session information
            </li>
            <li>
              <strong>API Usage</strong>: Requests made to our backend services
            </li>
            <li>
              <strong>Error Logs</strong>: Technical errors and performance
              metrics
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>

          <h3>3.1 Service Provision</h3>
          <p>We use your information to:</p>
          <ul>
            <li>
              <strong>Process Content</strong>: Analyze your uploaded files,
              audio, and text to generate outputs
            </li>
            <li>
              <strong>Generate AI Content</strong>: Create summaries, social
              media posts, and email follow-ups
            </li>
            <li>
              <strong>Improve Service</strong>: Enhance our algorithms and user
              experience
            </li>
            <li>
              <strong>Provide Support</strong>: Respond to your questions and
              technical issues
            </li>
          </ul>

          <h3>3.2 Communication</h3>
          <p>We may use your contact information to:</p>
          <ul>
            <li>
              <strong>Send Updates</strong>: Notify you about service changes
              and new features
            </li>
            <li>
              <strong>Provide Support</strong>: Respond to your inquiries and
              requests
            </li>
            <li>
              <strong>Send Marketing</strong>: Share relevant content and offers
              (with your consent)
            </li>
          </ul>

          <h3>3.3 Analytics and Improvement</h3>
          <p>We analyze usage patterns to:</p>
          <ul>
            <li>
              <strong>Improve Performance</strong>: Optimize our service and fix
              technical issues
            </li>
            <li>
              <strong>Enhance Features</strong>: Develop new functionality based
              on user needs
            </li>
            <li>
              <strong>Ensure Security</strong>: Monitor for suspicious activity
              and security threats
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Information Sharing and Disclosure</h2>

          <h3>4.1 We Do Not Sell Your Data</h3>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties for marketing purposes.
          </p>

          <h3>4.2 Service Providers</h3>
          <p>
            We share information with trusted third-party service providers who
            assist us in operating our service:
          </p>
          <ul>
            <li>
              <strong>Google OAuth</strong>: For user authentication and account
              management
            </li>
            <li>
              <strong>Supabase</strong>: For secure data storage and database
              management
            </li>
            <li>
              <strong>Google Vision</strong>: For OCR processing of uploaded
              documents and images
            </li>
            <li>
              <strong>OpenAI</strong>: For AI content generation and processing
            </li>
          </ul>

          <h3>4.3 Legal Requirements</h3>
          <p>We may disclose your information if required by law or to:</p>
          <ul>
            <li>
              <strong>Comply with Legal Process</strong>: Respond to subpoenas,
              court orders, or legal requests
            </li>
            <li>
              <strong>Protect Rights</strong>: Defend our rights, property, or
              safety
            </li>
            <li>
              <strong>Prevent Fraud</strong>: Investigate and prevent fraudulent
              or illegal activities
            </li>
          </ul>

          <h3>4.4 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your
            information may be transferred as part of the business transaction.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>

          <h3>5.1 Security Measures</h3>
          <p>
            We implement appropriate technical and organizational measures to
            protect your information:
          </p>
          <ul>
            <li>
              <strong>Encryption</strong>: Data is encrypted in transit and at
              rest
            </li>
            <li>
              <strong>Access Controls</strong>: Limited access to personal
              information on a need-to-know basis
            </li>
            <li>
              <strong>Regular Audits</strong>: Security assessments and
              vulnerability testing
            </li>
            <li>
              <strong>Secure Infrastructure</strong>: Cloud-based security with
              industry-standard practices
            </li>
          </ul>

          <h3>5.2 Security Limitations</h3>
          <p>
            While we strive to protect your information, no method of
            transmission over the internet or electronic storage is 100% secure.
            We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>

          <h3>6.1 Retention Period</h3>
          <p>We retain your information for as long as necessary to:</p>
          <ul>
            <li>
              <strong>Provide Services</strong>: Maintain your account and
              deliver our service
            </li>
            <li>
              <strong>Comply with Legal Obligations</strong>: Meet regulatory
              and legal requirements
            </li>
            <li>
              <strong>Resolve Disputes</strong>: Address any issues or claims
            </li>
          </ul>

          <h3>6.2 Demo Data</h3>
          <p>As a demo product, we may:</p>
          <ul>
            <li>
              <strong>Delete Inactive Data</strong>: Remove data from inactive
              accounts
            </li>
            <li>
              <strong>Purge Demo Content</strong>: Clean up test data
              periodically
            </li>
            <li>
              <strong>Honor Deletion Requests</strong>: Delete your data upon
              request
            </li>
          </ul>

          <h3>6.3 Data Deletion</h3>
          <p>You may request deletion of your data by:</p>
          <ul>
            <li>
              <strong>Contacting Us</strong>: Email us with your deletion
              request
            </li>
            <li>
              <strong>Account Deletion</strong>: Delete your account through the
              service
            </li>
            <li>
              <strong>Data Export</strong>: Request a copy of your data before
              deletion
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Third-Party Services</h2>

          <h3>7.1 Google OAuth</h3>
          <ul>
            <li>
              <strong>Purpose</strong>: User authentication and account
              management
            </li>
            <li>
              <strong>Data Shared</strong>: Email address, name, and profile
              picture
            </li>
            <li>
              <strong>Privacy Policy</strong>:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </li>
          </ul>

          <h3>7.2 Supabase</h3>
          <ul>
            <li>
              <strong>Purpose</strong>: Database storage and backend services
            </li>
            <li>
              <strong>Data Shared</strong>: All user content and account
              information
            </li>
            <li>
              <strong>Privacy Policy</strong>:{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase Privacy Policy
              </a>
            </li>
          </ul>

          <h3>7.3 Google Vision</h3>
          <ul>
            <li>
              <strong>Purpose</strong>: OCR processing of uploaded documents and
              images
            </li>
            <li>
              <strong>Data Shared</strong>: Document and image content for text
              extraction
            </li>
            <li>
              <strong>Privacy Policy</strong>:{" "}
              <a
                href="https://cloud.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Cloud Privacy Policy
              </a>
            </li>
          </ul>

          <h3>7.4 OpenAI</h3>
          <ul>
            <li>
              <strong>Purpose</strong>: AI content generation and processing
            </li>
            <li>
              <strong>Data Shared</strong>: Text content for AI analysis and
              generation
            </li>
            <li>
              <strong>Privacy Policy</strong>:{" "}
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Your Rights and Choices</h2>

          <h3>8.1 Access and Control</h3>
          <p>You have the right to:</p>
          <ul>
            <li>
              <strong>Access Your Data</strong>: Request a copy of your personal
              information
            </li>
            <li>
              <strong>Update Information</strong>: Correct or update your
              account information
            </li>
            <li>
              <strong>Delete Data</strong>: Request deletion of your personal
              information
            </li>
            <li>
              <strong>Opt-Out</strong>: Unsubscribe from marketing
              communications
            </li>
          </ul>

          <h3>8.2 Account Settings</h3>
          <p>You can manage your privacy preferences through:</p>
          <ul>
            <li>
              <strong>Account Dashboard</strong>: Update your profile and
              communication preferences
            </li>
            <li>
              <strong>Email Settings</strong>: Control marketing and
              notification emails
            </li>
            <li>
              <strong>Data Export</strong>: Download your data from the service
            </li>
          </ul>

          <h3>8.3 Cookies and Tracking</h3>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>
              <strong>Maintain Sessions</strong>: Keep you logged in during your
              visit
            </li>
            <li>
              <strong>Analyze Usage</strong>: Understand how you use our service
            </li>
            <li>
              <strong>Improve Experience</strong>: Personalize content and
              features
            </li>
          </ul>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Aluma is not intended for use by children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you believe we have collected information from a child under 13,
            please contact us immediately.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries
            other than your own. We ensure appropriate safeguards are in place
            to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by:
          </p>
          <ul>
            <li>
              <strong>Posting Updates</strong>: Publishing the new policy on our
              website
            </li>
            <li>
              <strong>Email Notification</strong>: Sending you an email about
              significant changes
            </li>
            <li>
              <strong>In-App Notice</strong>: Displaying a notice within the
              service
            </li>
          </ul>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email</strong>: alumacoaching.ai@gmail.com
            </li>
            <li>
              <strong>Response Time</strong>: We aim to respond to privacy
              inquiries within 30 days
            </li>
          </ul>
        </section>

        <section>
          <h2>13. California Privacy Rights</h2>
          <p>
            If you are a California resident, you have additional rights under
            the California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>
              <strong>Right to Know</strong>: Request information about personal
              data collected
            </li>
            <li>
              <strong>Right to Delete</strong>: Request deletion of personal
              data
            </li>
            <li>
              <strong>Right to Opt-Out</strong>: Opt-out of the sale of personal
              information
            </li>
            <li>
              <strong>Non-Discrimination</strong>: Not be discriminated against
              for exercising your rights
            </li>
          </ul>
        </section>

        <section>
          <h2>14. European Privacy Rights</h2>
          <p>
            If you are in the European Economic Area (EEA), you have rights
            under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>
              <strong>Right of Access</strong>: Request access to your personal
              data
            </li>
            <li>
              <strong>Right to Rectification</strong>: Correct inaccurate
              personal data
            </li>
            <li>
              <strong>Right to Erasure</strong>: Request deletion of your
              personal data
            </li>
            <li>
              <strong>Right to Portability</strong>: Receive your data in a
              portable format
            </li>
            <li>
              <strong>Right to Object</strong>: Object to processing of your
              personal data
            </li>
          </ul>
        </section>

        <section>
          <h2>15. Governing Law</h2>
          <p>
            This Privacy Policy is governed by the laws of the State of
            California, United States, without regard to its conflict of law
            provisions.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
