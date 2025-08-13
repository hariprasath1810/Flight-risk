# backend/app/agents/career_path_agent.py
from .base_agent import AgentConcept

class CareerPathAgent(AgentConcept):
    """
    Agent to create a personalized career development plan to retain an employee.
    """
    def __init__(self):
        super().__init__()
        self.template = """
        You are an expert career coach and HR strategist.
        Your goal is to create a personalized, actionable career development plan to re-engage and retain a valuable employee.
        Based on the employee's data, propose a 6-month development plan with clear, tangible steps.

        Employee Data:
        - Name: {name}
        - Role: {role}
        - Tenure: {tenure_months} months
        - Latest Performance Score (out of 5): {performance_score}
        - Employee Satisfaction Score (out of 5): {satisfaction_score}
        - Recent Feedback from/about Employee: "{recent_feedback}"

        Personalized Career Development Plan (provide a month-by-month plan for 6 months):
        """
        self.chain = self.create_chain(
            template=self.template,
            input_variables=["name", "role", "tenure_months", "performance_score", "satisfaction_score", "recent_feedback"]
        )

    def run(self, employee_data: dict) -> str:
        """Runs the career path generation."""
        return self.chain.run(employee_data)
