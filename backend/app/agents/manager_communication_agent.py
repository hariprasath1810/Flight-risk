# backend/app/agents/manager_communication_agent.py
from .base_agent import AgentConcept

class ManagerCommunicationAgent(AgentConcept):
    """
    Agent to draft a professional message to the manager summarizing the risk and recommended actions.
    """
    def __init__(self):
        super().__init__()
        self.template = """
        You are an HR Business Partner. Your task is to draft a clear, professional, and supportive email to a manager about their team member who has been identified as a potential flight risk.
        The email should summarize the situation, provide the recommended career development plan, and suggest next steps for the manager.
        The tone should be collaborative, not alarming.

        Employee Data:
        - Name: {name}
        - Role: {role}
        - Manager's Name: {manager_name}

        Flight Risk Analysis:
        {risk_analysis}

        Recommended Career Path:
        {career_path}

        Draft an email with the following structure:
        - Subject: Confidential: A conversation about {name}'s development
        - Body:
            - Acknowledge the employee's value.
            - Subtly mention the signals that suggest a need for proactive engagement (without using "flight risk").
            - Present the recommended career development plan as a set of suggestions for their upcoming 1:1.
            - Offer HR's support.

        Email Draft to {manager_name}:
        """
        self.chain = self.create_chain(
            template=self.template,
            input_variables=["name", "role", "manager_name", "risk_analysis", "career_path"]
        )

    def run(self, context: dict) -> str:
        """Runs the manager communication drafting."""
        return self.chain.run(context)
