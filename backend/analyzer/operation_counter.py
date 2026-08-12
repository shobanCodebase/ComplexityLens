import ast

def depends_on_input(iter_node: ast.AST) -> bool:
    if isinstance(iter_node, ast.Call) and getattr(iter_node.func, "id", None) == "range":
        if len(iter_node.args) > 0:
            arg = iter_node.args[0]
            if isinstance(arg, ast.Constant) and isinstance(arg.value, (int, float)):
                return False
        return True
    return True


def _count_recursive(node: ast.AST, multiplier: int, input_size: int, counts: dict) -> None:
    child_multiplier = multiplier

    if isinstance(node, ast.For):
        if depends_on_input(node.iter):
            child_multiplier = multiplier * input_size
    elif isinstance(node, ast.While):
        child_multiplier = multiplier * input_size

    
    if isinstance(node, ast.Compare):
        counts["comparisons"] += multiplier
    elif isinstance(node, (ast.Assign, ast.AugAssign)):
        counts["assignments"] += multiplier
    elif isinstance(node, ast.BinOp):
        counts["arithmetic"] += multiplier
    elif isinstance(node, ast.Call):
        counts["function_calls"] += multiplier

    for child in ast.iter_child_nodes(node):
        if isinstance(node, ast.For) and child is node.iter:
            _count_recursive(child, multiplier, input_size, counts)
        else:
            _count_recursive(child, child_multiplier, input_size, counts)


def count_operations(code: str, input_size: int) -> dict:
    tree = ast.parse(code)
    counts = {
        "comparisons": 0,
        "assignments": 0,
        "arithmetic": 0,
        "function_calls": 0,
    }
    _count_recursive(tree, 1, input_size, counts)
    return counts


if __name__ == "__main__":
    code = "for i in range(n):\n    x = i + 1"
    print(count_operations(code, 1000))