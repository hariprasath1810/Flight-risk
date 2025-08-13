# backend/app/agents/risk_analysis_agent.py
from .base_agent import AgentConcept

class RiskAnalysisAgent(AgentConcept):
    """
    Agent to determine why a given employee is a potential flight risk.
    """
    def __init__(self):
        super().__init__()
        self.template = """
        You are an expert HR analyst specializing in employee retention.
        Your task is to analyze the provided employee data and identify potential flight risks.
        Based on the data, provide a concise, bullet-pointed analysis of why this employee might be considering leaving the company.
        Focus on actionable insights.

        Employee Data:
        - Name: {name}
        - Role: {role}
        - Tenure: {tenure_months} months
        - Latest Performance Score (out of 5): {performance_score}
        - Employee Satisfaction Score (out of 5): {satisfaction_score}
        - Recent Feedback from/about Employee: "{recent_feedback}"

        Flight Risk Analysis (provide 3-5 bullet points):
        """
        self.chain = self.create_chain(
            template=self.template,
            input_variables=["name", "role", "tenure_months", "performance_score", "satisfaction_score", "recent_feedback"]
        )

    def run(self, employee_data: dict) -> str:
        """Runs the risk analysis."""
        return self.chain.run(employee_data)
