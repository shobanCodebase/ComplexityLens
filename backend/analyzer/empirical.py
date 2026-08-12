import analyzer.operation_counter as operation_counter


def collect_operation_data(code: str, input_sizes: list[int]) -> list[dict]:
    operation_data = []
    for input_size in input_sizes:
        op_counts = operation_counter.count_operations(code, input_size)
        total_operations = sum(op_counts.values())
        operation_data.append({
            "input_size": input_size,
            "operation_count": total_operations,
            "comparisons": op_counts["comparisons"],
            "assignments": op_counts["assignments"],
            "arithmetic": op_counts["arithmetic"],
            "function_calls": op_counts["function_calls"],
        })
    return operation_data

# Quick test block
if __name__ == "__main__":
    code = "for i in range(n):\n    x = i + 1"
    data = collect_operation_data(code, [10, 100, 1000, 5000])
    for row in data:
        print(row)