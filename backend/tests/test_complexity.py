import analyzer.complexity as complexity


def test_no_loops_returns_constant():
    code = "x = 5"
    result = complexity.estimate_complexity(code)
    assert result == "O(1)"


def test_single_loop_returns_linear():
    code = "for i in range(n):\n    print(i)"
    result = complexity.estimate_complexity(code)
    assert result == "O(n)"


def test_nested_loops_return_quadratic():
    code = "for i in range(n):\n    for j in range(n):\n        print(i, j)"
    result = complexity.estimate_complexity(code)
    assert result == "O(n^2)"