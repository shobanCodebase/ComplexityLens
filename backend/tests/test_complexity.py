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


def test_fixed_range_loop_does_not_scale():
    code = "for i in range(10):\n    print(i)"
    result = complexity.estimate_complexity(code)
    assert result == "O(1)"


def test_nested_with_one_fixed_loop_returns_linear():
    code = "for i in range(n):\n    for j in range(10):\n        print(i, j)"
    result = complexity.estimate_complexity(code)
    assert result == "O(n)"


def test_while_loop_returns_linear():
    code = "while True:\n    pass"
    result = complexity.estimate_complexity(code)
    assert result == "O(n)"


def test_recursion_returns_linear():
    code = "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)"
    result = complexity.estimate_complexity(code)
    assert result == "O(n)"