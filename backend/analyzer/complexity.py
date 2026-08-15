import ast
import analyzer.recursion_classifier as recursion_classifier


def depends_on_input(iter_node: ast.AST) -> bool:
    if isinstance(iter_node, ast.Call) and getattr(iter_node.func, "id", None) == "range":
        if len(iter_node.args) > 0:
            arg = iter_node.args[0]
            if isinstance(arg, ast.Constant) and isinstance(arg.value, (int, float)):
                return False
        return True
    return True


def max_loop_depth(node: ast.AST, current_depth: int = 0) -> int:
    if isinstance(node, ast.For):
        if depends_on_input(node.iter):
            current_depth += 1
    elif isinstance(node, ast.While):
        current_depth += 1

    max_depth = current_depth
    for child in ast.iter_child_nodes(node):
        max_depth = max(max_depth, max_loop_depth(child, current_depth))
    return max_depth


def _worst_recursion_pattern(tree: ast.AST) -> str:
    priority = {"none": 0, "linear": 1, "divide_and_conquer": 2, "exponential": 3}
    worst = "none"

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            pattern = recursion_classifier.classify_recursion_pattern(node)
            if priority[pattern] > priority[worst]:
                worst = pattern

    return worst


def estimate_complexity(code: str) -> str:
    ast_tree = ast.parse(code)
    loop_depth = max_loop_depth(ast_tree)
    recursion_pattern = _worst_recursion_pattern(ast_tree)

    if recursion_pattern == "exponential":
        return "O(2^n)"
    elif recursion_pattern == "divide_and_conquer":
        return _divide_and_conquer_label(ast_tree)
    elif recursion_pattern == "linear":
        return "O(n)" if loop_depth == 0 else f"O(n^{loop_depth + 1})"

    if loop_depth == 0:
        return "O(1)"
    elif loop_depth == 1:
        return "O(n)"
    else:
        return f"O(n^{loop_depth})"


def _divide_and_conquer_label(tree: ast.AST) -> str:
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            pattern = recursion_classifier.classify_recursion_pattern(node)
            if pattern == "divide_and_conquer":
                calls = recursion_classifier._find_recursive_calls(node)
                if len(calls) >= 2:
                    return "O(n log n)"
                else:
                    return "O(log n)"
    return "O(log n)"


if __name__ == "__main__":
    print(estimate_complexity("x = 5"))
    print(estimate_complexity("for i in range(n):\n    print(i)"))
    print(estimate_complexity("for i in range(10):\n    print(i)"))
    print(estimate_complexity("for i in range(n):\n    for j in range(n):\n        print(i, j)"))
    print(estimate_complexity("def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)"))
    print(estimate_complexity("def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"))
    print(estimate_complexity("def helper(n):\n    if n <= 1:\n        return 1\n    return helper(n // 2)"))
    print(estimate_complexity("def merge_sort(n):\n    if n <= 1:\n        return\n    merge_sort(n // 2)\n    merge_sort(n // 2)"))