import ast

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

def count_self_calls(func_node: ast.FunctionDef) -> int:
    count = 0
    for node in ast.walk(func_node):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            if node.func.id == func_node.name:
                count += 1
    return count

def max_recursion_factor(tree: ast.AST) -> int:
    """Returns 0 if no recursion, 1 for linear self-recursion, 2+ for multi-call recursion."""
    max_calls = 0
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            calls = count_self_calls(node)
            max_calls = max(max_calls, calls)
    return max_calls

def estimate_complexity(code: str) -> str:
    ast_tree = ast.parse(code)
    loop_depth = max_loop_depth(ast_tree)
    recursion_calls = max_recursion_factor(ast_tree)

    if recursion_calls >= 2:
        return "O(2^n)"
    elif recursion_calls == 1:
        return "O(n)" if loop_depth == 0 else f"O(n^{loop_depth + 1})"
    elif loop_depth == 0:
        return "O(1)"
    elif loop_depth == 1:
        return "O(n)"
    else:
        return f"O(n^{loop_depth})"


if __name__ == "__main__":
    print(estimate_complexity("x = 5"))
    print(estimate_complexity("for i in range(n):\n    print(i)"))
    print(estimate_complexity("for i in range(10):\n    print(i)"))
    print(estimate_complexity("for i in range(n):\n    for j in range(n):\n        print(i, j)"))
    print(estimate_complexity("for i in range(n):\n    for j in range(10):\n        print(i, j)"))
    print(estimate_complexity("def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)"))