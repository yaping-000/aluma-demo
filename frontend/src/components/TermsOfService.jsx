import React from "react"
import "./LegalPages.css"

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">
          <strong>Last Updated: August 25, 2024</strong>
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Aluma ("we," "our," or "us"). Aluma is a content engine
            that helps career coaches turn their session notes, audio, and
            uploaded content into actionable outputs including summaries, social
            media posts, and email follow-ups.
          </p>
          <p>
            By accessing or using our service, you agree to be bound by these
            Terms of Service ("Terms"). If you disagree with any part of these
            terms, you may not access our service.
          </p>
        </section>

        <section>
          <h2>2. Service Description</h2>
          <p>Aluma is a demo product designed to help career coaches:</p>
          <ul>
            <li>
              Process and analyze session recordings, notes, and uploaded
              content
            </li>
            <li>
              Generate summaries, social media posts, and email follow-ups
            </li>
            <li>Organize and synthesize coaching materials</li>
            <li>Grow their audience and generate leads</li>
          </ul>
        </section>

        <section>
          <h2>3. User Accounts and Registration</h2>

          <h3>3.1 Account Creation</h3>
          <p>
            To use certain features of Aluma, you must create an account using
            Google OAuth authentication. You are responsible for maintaining the
            confidentiality of your account information.
          </p>

          <h3>3.2 Account Responsibilities</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>All activities that occur under your account</li>
            <li>
              Providing accurate and complete information during registration
            </li>
            <li>
              Notifying us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section>
          <h2>4. User Content and License</h2>

          <h3>4.1 Content Ownership</h3>
          <p>
            You retain ownership of all content you upload, create, or submit to
            Aluma, including but not limited to:
          </p>
          <ul>
            <li>Session recordings and audio files</li>
            <li>Notes and text content</li>
            <li>Documents and files</li>
            <li>Generated outputs based on your content</li>
          </ul>

          <h3>4.2 License to Aluma</h3>
          <p>
            By uploading content to Aluma, you grant us a limited,
            non-exclusive, royalty-free license to:
          </p>
          <ul>
            <li>
              Process and analyze your content for the purpose of generating
              outputs
            </li>
            <li>Store your content securely on our servers</li>
            <li>Use your content to improve our service and algorithms</li>
            <li>
              Generate summaries, social media posts, and other outputs as
              requested
            </li>
          </ul>

          <h3>4.3 Content Restrictions</h3>
          <p>You agree not to upload content that:</p>
          <ul>
            <li>Violates any applicable laws or regulations</li>
            <li>Infringes on the rights of others</li>
            <li>Contains malicious code or viruses</li>
            <li>Is inappropriate, offensive, or harmful</li>
          </ul>
        </section>

        <section>
          <h2>5. Service Availability and Disclaimers</h2>

          <h3>5.1 Demo Product</h3>
          <p>
            Aluma is provided as a demo product "as-is" and "as available." We
            make no representations or warranties about the reliability,
            availability, or functionality of the service.
          </p>

          <h3>5.2 No Warranties</h3>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>WARRANTIES OF MERCHANTABILITY</li>
            <li>WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>WARRANTIES OF NON-INFRINGEMENT</li>
            <li>
              WARRANTIES REGARDING THE ACCURACY OR COMPLETENESS OF GENERATED
              CONTENT
            </li>
          </ul>

          <h3>5.3 Service Interruptions</h3>
          <p>
            We do not guarantee that the service will be uninterrupted, secure,
            or error-free. We may modify, suspend, or discontinue the service at
            any time without notice.
          </p>
        </section>

        <section>
          <h2>6. Limitations of Liability</h2>

          <h3>6.1 Limitation of Damages</h3>
          <p>
            IN NO EVENT SHALL ALUMA, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR
            AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>LOSS OF PROFITS</li>
            <li>LOSS OF DATA</li>
            <li>BUSINESS INTERRUPTION</li>
            <li>
              DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THE SERVICE
            </li>
          </ul>

          <h3>6.2 Maximum Liability</h3>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING
            TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY
            YOU TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section>
          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Aluma and its
            officers, directors, employees, and agents from and against any
            claims, damages, losses, liabilities, costs, and expenses (including
            reasonable attorneys' fees) arising out of or relating to:
          </p>
          <ul>
            <li>Your use of the service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your content uploaded to the service</li>
          </ul>
        </section>

        <section>
          <h2>8. Third-Party Services</h2>
          <p>Aluma integrates with third-party services including:</p>
          <ul>
            <li>Google OAuth (authentication)</li>
            <li>Supabase (data storage)</li>
            <li>Google Vision (OCR processing)</li>
            <li>OpenAI (AI content generation)</li>
          </ul>
          <p>
            Your use of these third-party services is subject to their
            respective terms of service and privacy policies.
          </p>
        </section>

        <section>
          <h2>9. Termination</h2>

          <h3>9.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by contacting us or
            deleting your account through the service.
          </p>

          <h3>9.2 Termination by Us</h3>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice, for conduct that we believe violates these Terms or is
            harmful to other users, us, or third parties.
          </p>

          <h3>9.3 Effect of Termination</h3>
          <p>Upon termination:</p>
          <ul>
            <li>Your right to use the service will cease immediately</li>
            <li>We may delete your account and associated data</li>
            <li>
              Generated content may be retained or deleted at our discretion
            </li>
          </ul>
        </section>

        <section>
          <h2>10. Governing Law and Dispute Resolution</h2>

          <h3>10.1 Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of California, United States, without regard
            to its conflict of law provisions.
          </p>

          <h3>10.2 Dispute Resolution</h3>
          <p>
            Any disputes arising out of or relating to these Terms or the
            service shall be resolved through binding arbitration in accordance
            with the rules of the American Arbitration Association.
          </p>
        </section>

        <section>
          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will
            notify users of any material changes by posting the new Terms on
            this page and updating the "Last Updated" date.
          </p>
          <p>
            Your continued use of the service after any changes constitutes
            acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <ul>
            <li>Email: alumacoaching.ai@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision will be limited or eliminated to the minimum
            extent necessary so that these Terms will otherwise remain in full
            force and effect.
          </p>
        </section>

        <section>
          <h2>14. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and Aluma
            regarding the use of the service and supersede all prior agreements
            and understandings.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfService
