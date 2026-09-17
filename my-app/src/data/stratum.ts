export interface StratumTier {
  id: string;
  name: string;
  implementation: string;
  standardImplementation: string;
  operations: string;
  standardOperations: string;
  delivery: string;
  description: string;
  features: string[];
  stabilization: number;
  popular?: boolean;
  from?: boolean;
  boundary?: string;
  cta: string;
}

export const stratumBlueprint = {
  founding: "$497",
  standard: "$997",
  delivery: "1–2 weeks",
  description:
    "A technical and commercial plan for turning an AI opportunity into a clearly scoped production system.",
  features: [
    "Business and technical discovery",
    "Use-case definition",
    "Data-readiness assessment",
    "Feasibility and risk analysis",
    "Recommended AI architecture",
    "Integration requirements",
    "Evaluation and success metrics",
    "Delivery roadmap",
    "Final scope and fixed-price proposal",
  ],
  credit:
    "The complete $497 Blueprint payment is credited toward a Stratum implementation when the client proceeds within 30 days.",
};

export const stratumTiers: StratumTier[] = [
  {
    id: "launch",
    name: "Stratum Launch",
    implementation: "$2,997",
    standardImplementation: "$4,500",
    operations: "$297",
    standardOperations: "$497",
    delivery: "3–6 weeks",
    stabilization: 30,
    description: "A business launching its first focused AI system.",
    features: [
      "One clearly defined AI use case",
      "One external integration",
      "Foundation-model implementation",
      "Basic internal interface or dashboard",
      "Production deployment",
      "Basic evaluations and guardrails",
      "Usage and error monitoring",
      "Technical documentation",
      "30-day post-launch stabilization period",
    ],
    boundary:
      "This tier does not include custom model training, multiple complex workflows, advanced computer vision or large multi-system integrations.",
    cta: "Start With a Blueprint",
  },
  {
    id: "production",
    name: "Stratum Production",
    implementation: "$5,997",
    standardImplementation: "$8,500",
    operations: "$697",
    standardOperations: "$997",
    delivery: "6–10 weeks",
    stabilization: 60,
    popular: true,
    description:
      "A dependable AI capability that will become part of daily operations or a customer-facing product.",
    features: [
      "One production AI application or up to two connected workflows",
      "Up to three integrations",
      "RAG, agentic workflow or structured AI pipeline",
      "Authentication and role controls",
      "Evaluation dataset and quality testing",
      "Human approval and fallback paths",
      "Staging and production environments",
      "Analytics, logging and cost monitoring",
      "Team training and documentation",
      "60-day post-launch stabilization period",
    ],
    cta: "Start With a Blueprint",
  },
  {
    id: "scale",
    name: "Stratum Scale",
    implementation: "$9,997",
    standardImplementation: "$15,000",
    operations: "$1,497",
    standardOperations: "$1,997",
    delivery: "8–14 weeks",
    stabilization: 90,
    from: true,
    description: "Complex, high-usage or multi-system AI deployments.",
    features: [
      "Multiple agents or connected AI workflows",
      "Custom data pipelines",
      "Advanced RAG architecture",
      "Custom machine learning or computer vision where required",
      "Multiple roles and permissions",
      "Scalable cloud architecture",
      "CI/CD and automated evaluations",
      "Advanced observability and cost controls",
      "Security and compliance planning",
      "Priority support",
      "Quarterly optimization roadmap",
      "90-day post-launch stabilization period",
    ],
    cta: "Discuss Your System",
  },
];

export const stratumPillars = [
  {
    name: "Architecture",
    description:
      "Design the technical foundation, data flows, integrations, permissions and infrastructure required for dependable operation.",
  },
  {
    name: "Intelligence",
    description:
      "Select and combine the appropriate AI approach, including rules, machine learning, computer vision, RAG, language models and agents.",
  },
  {
    name: "Operations",
    description:
      "Deploy, monitor, evaluate and improve the system after it enters real-world use.",
  },
];

export const stratumLifecycle = [
  {
    name: "Blueprint",
    description:
      "Identify the business problem, required data, risks, success metrics, technical architecture and implementation scope.",
  },
  {
    name: "Build",
    description:
      "Develop the application, models, workflows, interfaces, integrations and data pipelines.",
  },
  {
    name: "Validate",
    description:
      "Test quality, reliability, latency, cost, safety, edge cases and failure behavior.",
  },
  {
    name: "Deploy",
    description:
      "Launch the system using production infrastructure, observability, access controls and documented deployment processes.",
  },
  {
    name: "Evolve",
    description:
      "Monitor system behavior, improve performance and expand capabilities based on real usage.",
  },
];

export const stratumCapabilities = [
  {
    name: "RAG and enterprise knowledge systems",
    description:
      "Connect answers to your documents and data with retrieval, source citations and controlled access.",
    icon: "M4 4h6v16H4z M14 4h6v16h-6z M7 8v8 M17 8v8",
  },
  {
    name: "AI agents and autonomous workflows",
    description:
      "Coordinate tools and tasks with clear permissions, human approvals and dependable fallback paths.",
    icon: "M4 4h5v5H4z M15 15h5v5h-5z M9 6h9v9 M6 9v9h9",
  },
  {
    name: "AI-powered web and software products",
    description:
      "Build AI into usable applications, from focused internal interfaces to customer-facing products.",
    icon: "M3 4h18v16H3z M3 9h18 M7 6h1 M11 6h1 M8 13l-2 2 2 2 M16 13l2 2-2 2",
  },
  {
    name: "Predictive machine-learning systems",
    description:
      "Use historical data to forecast demand, identify patterns and support better decisions.",
    icon: "M4 3v17h17 M7 15l4-5 4 3 5-7 M17 6h3v3",
  },
  {
    name: "Computer vision and multimodal systems",
    description:
      "Interpret images, video and mixed inputs for inspection, classification and operational workflows.",
    icon: "M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M6 12s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z M12 10v4",
  },
  {
    name: "Document intelligence and data extraction",
    description:
      "Turn unstructured documents into validated, structured information your team can use.",
    icon: "M5 3h10l4 4v14H5z M15 3v5h4 M8 12h8 M8 16h5",
  },
  {
    name: "Data pipelines and system integrations",
    description:
      "Move, transform and synchronize data between databases, APIs and existing business tools.",
    icon: "M3 5h6v6H3z M15 13h6v6h-6z M9 8h9v5 M6 11v5h9",
  },
  {
    name: "AI evaluation, monitoring and MLOps",
    description:
      "Measure quality, control releases and monitor reliability, latency and cost after launch.",
    icon: "M3 4h18v16H3z M5 13h4l2-5 3 9 2-4h3",
  },
];

export const stratumExamples = [
  "Internal knowledge assistant connected to company documents",
  "Intelligent document-processing platform",
  "AI customer-support or operations agent",
  "Predictive analytics and decision-support system",
  "Visual inspection and computer-vision platform",
  "AI functionality embedded inside an existing SaaS product",
  "Multi-agent research or workflow system",
];
export const stratumAudiences = [
  "Startups building an AI-enabled MVP",
  "Software companies adding AI to an existing product",
  "Businesses with large document or operational datasets",
  "Companies replacing manual knowledge workflows",
  "Organizations moving an AI prototype into production",
  "Teams needing computer vision, predictive ML or multimodal AI",
];
export const stratumOperations = [
  "System monitoring",
  "Bug fixes",
  "Prompt and configuration improvements",
  "Model-provider compatibility updates",
  "Performance reporting",
  "Cost monitoring",
  "A defined monthly support-hour allowance, confirmed in the Blueprint",
];
export const stratumExclusions = [
  "Cloud infrastructure charges",
  "Model API usage",
  "External software subscriptions",
  "New products or major features",
  "Additional integrations",
  "Major workflow changes",
  "Custom model-training costs",
  "Enterprise 24/7 support unless separately contracted",
];
export const stratumPricingNote =
  "Third-party model usage, cloud infrastructure and external platform charges are not included. Final scope, delivery schedule and operating requirements are confirmed during the Blueprint phase.";
export const stratumDeliveryNote =
  "Delivery time depends on integration complexity, data readiness, security requirements and the speed of client feedback. The final schedule is confirmed after the Blueprint phase.";
export const stratumFAQs = [
  {
    question: "Is Stratum part of Momentum?",
    answer:
      "No. Momentum is Kinetiq’s business-development and growth system. Stratum is a separate engineering system for building production-ready AI products and infrastructure.",
  },
  {
    question: "Do we have to start with the Blueprint?",
    answer:
      "Yes. Every Stratum implementation begins with a Blueprint so the architecture, requirements, risks, timeline and commercial scope can be defined before development.",
  },
  {
    question: "Can Stratum integrate with our existing software?",
    answer:
      "Yes. Stratum can integrate with existing CRMs, databases, document libraries, APIs, internal tools and software platforms when those systems provide suitable access.",
  },
  {
    question: "Do you build custom AI models?",
    answer:
      "When the use case requires it. Stratum may use foundation models, RAG, traditional machine learning, computer vision or custom models depending on the business requirement.",
  },
  {
    question: "Are infrastructure and model usage included?",
    answer:
      "No. Third-party model usage, cloud infrastructure and external platform fees are billed separately or paid directly by the client.",
  },
  {
    question: "What happens after deployment?",
    answer:
      "Depending on the selected plan, Kinetiq can provide monitoring, maintenance, evaluation, optimization and continued development.",
  },
];
