import FeedbackForm from "@/components/FeedbackForm";
export const metadata={title:"Contact us | MotorCheck UK"};
export default function Contact(){return <main><section className="page-hero"><div className="container"><p className="eyebrow">Help & support</p><h1>Contact us</h1><p>Got a question about a report, a payment or the service? Send us a message and we'll be ready to help once support is live.</p></div></section><section className="content-wrap"><div className="container" style={{maxWidth:790}}><FeedbackForm kind="contact"/></div></section></main>}
