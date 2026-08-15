import analyzer.complexity
import analyzer.operation_counter
import analyzer.sandbox
import analyzer.empirical
import models.schemas
import analyzer.space_complexity

GROWTH_CURVE_INPUT_SIZES = [10, 100, 500, 1000, 5000]


def run_full_analysis(code: str, language: str, input_size: int) -> models.schemas.AnalyzeResponse:
    """
    Runs the complete analysis pipeline (static complexity, operation counting,
    sandboxed profiling, empirical growth data) for a single code submission.
    Raises SyntaxError if the code cannot be parsed.
    """
    op_counts = analyzer.operation_counter.count_operations(code, input_size)
    total_operations = sum(op_counts.values())
    complexity = analyzer.complexity.estimate_complexity(code)
    growth_data = analyzer.empirical.collect_operation_data(code, GROWTH_CURVE_INPUT_SIZES)

    sandbox_result = analyzer.sandbox.run_in_sandbox(code)
    execution_time_ms = sandbox_result["execution_time_ms"] or 0.0
    memory_usage_mb = sandbox_result["memory_usage_mb"] or 0.0
    space_complexity = analyzer.space_complexity.estimate_space_complexity(code)

    return models.schemas.AnalyzeResponse(
        language=language,
        execution_time_ms=execution_time_ms,
        operation_count=total_operations,
        complexity=complexity,
        memory_usage_mb=memory_usage_mb,
        growth_data=growth_data,
        space_complexity=space_complexity
    )