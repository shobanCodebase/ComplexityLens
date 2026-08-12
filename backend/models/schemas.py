from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AnalyzeRequest(BaseModel):
    code: str = Field(..., description="The code to be analyzed")
    language: str = Field(..., description="The language of the code")
    input_size: int = Field(..., description="The size of the input code")


class AnalyzeResponse(BaseModel):
    language: str = Field(..., description="The language of the code")
    execution_time_ms: float = Field(..., description="The execution time of the code")
    operation_count: int = Field(..., description="The number of operations in the code")
    complexity: str = Field(..., description="The complexity of the code")
    memory_usage_mb: float = Field(..., description="The memory usage of the code in MB")
    growth_data: List[Dict[str, Any]] = Field(
        default=[],
        description="Operation counts across a range of input sizes, for charting growth curves"
    )