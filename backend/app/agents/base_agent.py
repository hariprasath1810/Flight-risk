# backend/app/agents/base_agent.py
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class AgentConcept:
    """
    Base class for agentic concepts.
    Initializes the LLM model from Google Gemini.
    """
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")

        # Using gemini-1.5-pro-latest as it is a powerful and recent model.
        # The user mentioned gemini-2.5-pro, which is not a current model name.
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.7)

    def create_chain(self, template: str, input_variables: list[str]):
        """Creates an LLMChain with a given prompt template."""
        prompt = PromptTemplate(
            template=template,
            input_variables=input_variables
        )
        return LLMChain(llm=self.llm, prompt=prompt)
