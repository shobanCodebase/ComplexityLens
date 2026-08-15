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
    space_complexity: str = Field(default="O(1)", description="Estimated auxiliary space complexity")

class CompareItem(BaseModel):
    name: str = Field(..., description="Display name for this algorithm/snippet")
    code: str = Field(..., description="The code to analyze")
    language: str = Field(..., description="The language of the code")

class CompareRequest(BaseModel):
    items: List[CompareItem] = Field(..., description="List of algorithms to compare")
    input_size: int = Field(default=1000, description="Input size to use for all comparisons")

class CompareResultItem(BaseModel):
    name: str
    success: bool
    result: AnalyzeResponse | None = None
    error: str | None = None

class CompareResponse(BaseModel):
    results: List[CompareResultItem]