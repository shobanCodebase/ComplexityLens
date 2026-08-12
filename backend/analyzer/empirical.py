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


# Known growth models: name -> function that predicts the ops_ratio given size_ratio
GROWTH_MODELS = {
    "O(1)": lambda size_ratio: 1,
    "O(log n)": lambda size_ratio: __import__("math").log2(size_ratio) if size_ratio > 1 else 1,
    "O(n)": lambda size_ratio: size_ratio,
    "O(n log n)": lambda size_ratio: size_ratio * __import__("math").log2(size_ratio) if size_ratio > 1 else 1,
    "O(n^2)": lambda size_ratio: size_ratio ** 2,
    "O(n^3)": lambda size_ratio: size_ratio ** 3,
}


def estimate_empirical_complexity(data: list[dict]) -> dict:
    """
    Compares consecutive (input_size, operation_count) pairs against known
    growth models, picking whichever model's predicted ratio is closest
    to the actually observed ratio, on average across all pairs.
    """
    if len(data) < 2:
        return {"complexity": "Unknown", "confidence": 0.0}

    # Track total "error" (difference from prediction) per model, across all pairs
    model_errors = {name: 0.0 for name in GROWTH_MODELS}
    pair_count = 0

    for i in range(len(data) - 1):
        size_before = data[i]["input_size"]
        size_after = data[i + 1]["input_size"]
        ops_before = data[i]["operation_count"]
        ops_after = data[i + 1]["operation_count"]

        if ops_before == 0:
            continue  # avoid division by zero; skip this pair

        size_ratio = size_after / size_before
        actual_ops_ratio = ops_after / ops_before

        for name, predict_fn in GROWTH_MODELS.items():
            predicted_ratio = predict_fn(size_ratio)
            # Relative error between what we observed and what the model predicts
            error = abs(actual_ops_ratio - predicted_ratio) / max(predicted_ratio, 1)
            model_errors[name] += error

        pair_count += 1

    if pair_count == 0:
        return {"complexity": "Unknown", "confidence": 0.0}

    # Average error per model across all pairs
    avg_errors = {name: total / pair_count for name, total in model_errors.items()}

    # Best model = lowest average error
    best_model = min(avg_errors, key=avg_errors.get)
    best_error = avg_errors[best_model]

    # Convert error into a rough confidence score (0-100%), just for display purposes
    confidence = max(0.0, 100.0 - best_error * 100.0)
    confidence = min(confidence, 99.0)  # never claim 100% certainty — it's an estimate

    return {
        "complexity": best_model,
        "confidence": round(confidence, 1),
        "all_errors": {k: round(v, 4) for k, v in avg_errors.items()},
    }


if __name__ == "__main__":
    code = "for i in range(n):\n    x = i + 1"
    data = collect_operation_data(code, [10, 100, 1000, 5000])
    for row in data:
        print(row)

    result = estimate_empirical_complexity(data)
    print("\nEmpirical estimate:", result)