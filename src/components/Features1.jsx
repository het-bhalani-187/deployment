import React from 'react';
import './Features.css'; // Import the CSS file

const featuresData = [
  {
    title: "Natural Language Understanding",
    description: "Lawyer Al can understand and generate human-like text, making conversations feel more natural.",
  },
  {
    title: "Contextual Awareness",
    description: "It remembers the context of the conversation, allowing for more coherent and relevant responses.",
  },
  {
    title: "Multi-turn Conversations",
    description: "Engage in multi-turn conversations without losing track of the topic.",
  },
  {
    title: "Wide Range of Knowledge",
    description: "Lawyer AI  has been trained on diverse topics, making it knowledgeable in various fields.",
  },
  {
    title: "24/7 Availability",
    description: "Lawyer AI is available anytime, providing instant responses whenever you need assistance.",
  },
];

const Features1 = () => {
  return (
    <div className="features-background border-2 border-blue-500 p-10 gradient-bg flex">
        <div className="features-container">
          <h1>Features of LAWYER.AI</h1> <hr/>
          <div className="features-list">
            {featuresData.map((feature, index) => (
              <div className="feature-item" key={index}>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default Features1;