# backend/app/models.py
from pydantic import BaseModel, Field

class EmployeeData(BaseModel):
    name: str = Field(..., example="Jane Doe")
    role: str = Field(..., example="Senior Software Engineer")
    tenure_months: int = Field(..., example=24, description="Tenure in months")
    performance_score: float = Field(..., example=4.5, ge=1.0, le=5.0, description="Performance score from 1.0 to 5.0")
    satisfaction_score: int = Field(..., example=3, ge=1, le=5, description="Satisfaction score from 1 to 5")
    recent_feedback: str = Field(..., example="Expressed boredom with current projects and mentioned a lack of growth opportunities.")
    manager_name: str = Field(..., example="John Smith")

class AnalysisResult(BaseModel):
    risk_analysis: str
    career_path: str
    manager_communication: str
