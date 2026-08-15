import ast

# Method names that indicate a mutable container growing in size
GROWTH_METHODS = {"append", "add", "update", "extend", "insert"}


def _is_growth_call(node: ast.AST) -> bool:
    """Detects calls like results.append(x), my_set.add(x), etc."""
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
        return node.func.attr in GROWTH_METHODS
    return False


def _contains_growth_call_in_loop(node: ast.AST, inside_loop: bool = False) -> bool:
    """
    Recursively walks the tree. Returns True if a growth-indicating call
    (e.g. .append()) is found anywhere inside a loop body.
    """
    if isinstance(node, (ast.For, ast.While)):
        inside_loop = True

    if inside_loop and _is_growth_call(node):
        return True

    for child in ast.iter_child_nodes(node):
        if _contains_growth_call_in_loop(child, inside_loop):
            return True

    return False


def _contains_comprehension(node: ast.AST) -> bool:
    """Detects list/set/dict comprehensions, e.g. [x for x in range(n)]."""
    for child in ast.walk(node):
        if isinstance(child, (ast.ListComp, ast.SetComp, ast.DictComp)):
            return True
    return False


def estimate_space_complexity(code: str) -> str:
    """
    Heuristic space complexity estimate. Detects growth-indicating patterns
    (container methods called inside a loop, or comprehensions over a
    presumably input-sized range) as O(n) auxiliary space. Otherwise O(1).

    This is intentionally simple: it does not attempt to determine the
    exact growth rate (O(n) vs O(n^2) space), distinguish auxiliary space
    from input space, or handle nested/nuanced cases. See README limitations.
    """
    tree = ast.parse(code)

    if _contains_growth_call_in_loop(tree) or _contains_comprehension(tree):
        return "O(n)"

    return "O(1)"


if __name__ == "__main__":
    # No extra space -- just prints values
    print(estimate_space_complexity("for i in range(n):\n    print(i)"))  # expect O(1)

    # Builds a growing list -- real auxiliary space
    print(estimate_space_complexity("results = []\nfor i in range(n):\n    results.append(i)"))  # expect O(n)

    # List comprehension -- also real auxiliary space
    print(estimate_space_complexity("results = [i for i in range(n)]"))  # expect O(n)

    # No loop at all
    print(estimate_space_complexity("x = 5"))  # expect O(1)