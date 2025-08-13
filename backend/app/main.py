# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import EmployeeData, AnalysisResult
from .agents.risk_analysis_agent import RiskAnalysisAgent
from .agents.career_path_agent import CareerPathAgent
from .agents.manager_communication_agent import ManagerCommunicationAgent

app = FastAPI(
    title="Employee Flight Risk Detection API",
    description="Uses Agentic AI to analyze flight risk, create development plans, and draft manager communications.",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
try:
    risk_agent = RiskAnalysisAgent()
    career_agent = CareerPathAgent()
    comm_agent = ManagerCommunicationAgent()
except ValueError as e:
    # This will catch the API key error and prevent the app from starting if not configured.
    print(f"Agent initialization failed: {e}")
    risk_agent = None
    career_agent = None
    comm_agent = None

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Employee Flight Risk Detection API"}

@app.post("/analyze", response_model=AnalysisResult, tags=["AI Agents"])
async def analyze_employee_flight_risk(employee_data: EmployeeData):
    """
    Receives employee data and returns a full analysis including
    flight risk, career path, and manager communication draft.
    """
    if not all([risk_agent, career_agent, comm_agent]):
        raise HTTPException(
            status_code=500,
            detail="API is not configured correctly. Missing GOOGLE_API_KEY."
        )

    try:
        employee_data_dict = employee_data.dict()

        # 1. Risk Analysis Agent
        risk_analysis_result = risk_agent.run(employee_data_dict)

        # 2. Career Path Agent
        career_path_result = career_agent.run(employee_data_dict)

        # 3. Manager Communication Agent
        comm_context = {
            **employee_data_dict,
            "risk_analysis": risk_analysis_result,
            "career_path": career_path_result,
        }
        manager_comm_result = comm_agent.run(comm_context)

        return AnalysisResult(
            risk_analysis=risk_analysis_result,
            career_path=career_path_result,
            manager_communication=manager_comm_result,
        )
    except Exception as e:
        # Catch potential errors from the LLM or other parts of the process
        raise HTTPException(status_code=500, detail=str(e))

# To run the backend server:
# 1. Make sure you have a .env file with your GOOGLE_API_KEY in the backend/ directory.
# 2. Navigate to the backend/ directory in your terminal.
# 3. Run the command: uvicorn app.main:app --reload
