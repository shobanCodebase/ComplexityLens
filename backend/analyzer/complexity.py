
import ast


def estimate_complexity(code: str) -> str:
    ast_tree = ast.parse(code)
    max_depth = max_loop_depth(ast_tree)

    if max_depth == 0:
        return "O(1)"
    elif max_depth == 1:
        return "O(n)"
    else:
        return f"O(n^{max_depth})"

def max_loop_depth(node: ast.AST, current_depth: int = 0) -> int:
    if isinstance(node, ast.For) or isinstance(node, ast.While):
        current_depth += 1
    max_depth = current_depth
    for child in ast.iter_child_nodes(node):
        max_depth = max(max_depth, max_loop_depth(child, current_depth))
    return max_depth

print(estimate_complexity("x = 5"))
print(estimate_complexity("for i in range(n):\n    print(i)"))
print(estimate_complexity("for i in range(n):\n    for j in range(n):\n        print(i, j)"))