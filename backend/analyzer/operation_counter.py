import ast

def count_operations(code: str) -> dict:
    tree = ast.parse(code)

    comparisons = 0
    assignments = 0
    arithmetic = 0
    function_calls = 0

    for node in ast.walk(tree):
        if isinstance(node, ast.Compare):
            comparisons += 1
        elif isinstance(node, (ast.Assign, ast.AugAssign)):
            assignments += 1
        elif isinstance(node, ast.BinOp):
            arithmetic += 1
        elif isinstance(node, ast.Call):
            function_calls += 1

    return {
        "comparisons": comparisons,
        "assignments": assignments,
        "arithmetic": arithmetic,
        "function_calls": function_calls,
    }


if __name__ == "__main__":
    code = """
x = 5
y = x + 3
if y > 10:
    z = y - 1
"""
    print(count_operations(code))