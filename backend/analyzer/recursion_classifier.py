import ast


def _classify_recursive_call_arg(node: ast.AST) -> str:
    """
    Inspects a single argument passed to a recursive call and classifies
    how it changes the input:
      - "divides" if it's a BinOp with Div/FloorDiv (e.g. n // 2)
      - "decrements" if it's a BinOp with Sub (e.g. n - 1)
      - "unknown" otherwise
    """
    if isinstance(node, ast.BinOp):
        if isinstance(node.op, (ast.Div, ast.FloorDiv)):
            return "divides"
        elif isinstance(node.op, ast.Sub):
            return "decrements"
    return "unknown"


def _classify_recursive_call(call: ast.Call) -> str:
    """
    Inspects ALL arguments of a recursive call (not just the first) and
    returns the "best" classification found among them:
      - "divides" if any argument is a BinOp with Div/FloorDiv
      - "decrements" if any argument is a BinOp with Sub (and no "divides" found)
      - "unknown" if no argument shows either pattern

    Checking all arguments matters because the size parameter isn't always
    first -- e.g. helper(arr, n // 2) has the shrinking value in position 1.
    """
    found_divides = False
    found_decrements = False

    for arg in call.args:
        classification = _classify_recursive_call_arg(arg)
        if classification == "divides":
            found_divides = True
        elif classification == "decrements":
            found_decrements = True

    if found_divides:
        return "divides"
    elif found_decrements:
        return "decrements"
    else:
        return "unknown"


def _find_recursive_calls(func_node: ast.FunctionDef) -> list:
    """Returns a list of Call nodes inside func_node that call func_node itself."""
    calls = []
    for node in ast.walk(func_node):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            if node.func.id == func_node.name:
                calls.append(node)
    return calls


def classify_recursion_pattern(func_node: ast.FunctionDef) -> str:
    """
    Classifies a recursive function's growth pattern based on how its
    arguments change across recursive calls.

    Returns one of: "none", "linear", "divide_and_conquer", "exponential"

    This is a narrow heuristic, not a general recurrence solver:
    - 1 recursive call, any arg decrements by a constant -> "linear" (O(n))
    - 1 recursive call, any arg divides by a constant -> "divide_and_conquer" (O(log n))
    - 2+ recursive calls, ALL calls show a "divides" arg -> "divide_and_conquer" (O(n log n) assumed)
    - 2+ recursive calls, any call lacks a "divides" arg -> "exponential" (O(2^n))
    """
    calls = _find_recursive_calls(func_node)
    if len(calls) == 0:
        return "none"

    call_classifications = [_classify_recursive_call(call) for call in calls]

    if len(calls) == 1:
        if call_classifications[0] == "divides":
            return "divide_and_conquer"
        else:
            return "linear"

    if all(c == "divides" for c in call_classifications):
        return "divide_and_conquer"
    else:
        return "exponential"


if __name__ == "__main__":
    test_cases = {
        "factorial": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
        "fibonacci": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)",
        "binary_search_style": "def helper(n):\n    if n <= 1:\n        return 1\n    return helper(n // 2)",
        "merge_sort_style": "def merge_sort(n):\n    if n <= 1:\n        return\n    merge_sort(n // 2)\n    merge_sort(n // 2)",
        "helper_second_arg_divides": "def helper(arr, n):\n    if n <= 1:\n        return\n    helper(arr, n // 2)",
    }
    for name, code in test_cases.items():
        tree = ast.parse(code)
        func_node = tree.body[0]
        result = classify_recursion_pattern(func_node)
        print(f"{name}: {result}")