import React from 'react';
import '../styles/Features.css'; // Import the CSS file

const featuresData = [
  {
    title: "Natural Language Understanding",
    description: "Lawyer AI can understand and generate human-like text, ensuring more meaningful and fluid conversations for legal professionals and clients alike. It analyzes complex legal queries and provides clear, concise, and contextually accurate responses. With advanced NLP capabilities, it bridges the gap between legal jargon and everyday language, making law more accessible. Whether drafting documents or answering questions, it ensures clarity and precision.",
  },
  {
    title: "Contextual Awareness",
    description: "It retains the context of discussions, enabling seamless and relevant interactions without losing important details from previous exchanges. Lawyer AI keeps track of legal cases, documents, and ongoing matters to ensure continuity. This feature helps in reducing redundancy and enhances efficiency, saving valuable time for legal professionals. It understands nuances, providing responses that align with previous discussions.",
  },
  {
    title: "Multi-turn Conversations",
    description: "Engage in extended legal discussions effortlessly, as Lawyer AI keeps track of the topic and maintains coherence throughout the conversation. It adapts to changing contexts, ensuring accuracy in follow-up questions and responses. This feature is crucial in handling detailed case inquiries and legal strategy discussions. With an intuitive interface, it streamlines legal consultations, making interactions more productive.",
  },
  {
    title: "Wide Range of Knowledge",
    description: "Trained across various legal fields, Lawyer AI provides insights into different areas of law, aiding research, case preparation, and legal assistance. From corporate law to criminal justice, it serves as a valuable resource for attorneys, paralegals, and students. It references precedents, statutes, and legal principles, making it a comprehensive legal tool. With continuous learning, it stays updated with the latest legal developments.",
  },
  {
    title: "24/7 Availability",
    description: "Accessible anytime, Lawyer AI ensures instant responses, making legal guidance and information available around the clock. Whether it's late-night research or urgent case assistance, it offers reliable support. Clients and lawyers can access information without time constraints, improving efficiency and responsiveness. This feature eliminates the need to wait for office hours, making legal help more accessible and convenient.",
  },
  {
    title: "AI-Powered Legal Assistance",
    description: "Lawyer AI provides real-time legal advice, assisting in legal research, case management, and document drafting. It helps reduce the workload of legal professionals by offering automated solutions for routine tasks. The AI leverages the latest advancements in machine learning and legal databases to provide precise and relevant information for each case. With this feature, legal teams can significantly improve productivity while ensuring the accuracy of their work.",
  },
];

const Features = () => {
  return (
    <div className="features-background border-2 border-blue-500 p-10 gradient-bg flex">
      <div className="features-container">
        <strong><h1>Features of Lawyer.AI</h1></strong> <hr />
        <div className="features-list">
          {featuresData.map((feature, index) => (
            <div className="feature-item" key={index}>
              <h2>{feature.title}</h2>
              <p className="feature-description">
                {feature.description.split(" ").slice(0, 10).join(" ")}...
              </p>
              <p className="feature-description-full">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;