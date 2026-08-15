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

def test_divide_and_conquer_single_branch_returns_log_n():
    code = "def helper(n):\n    if n <= 1:\n        return 1\n    return helper(n // 2)"
    result = complexity.estimate_complexity(code)
    assert result == "O(log n)"


def test_divide_and_conquer_multi_branch_returns_n_log_n():
    # Regression test: this used to be misclassified as O(2^n) by the old
    # analyzer, which only counted "2+ self-calls" as exponential without
    # considering how the input actually shrinks.
    code = "def merge_sort(n):\n    if n <= 1:\n        return\n    merge_sort(n // 2)\n    merge_sort(n // 2)"
    result = complexity.estimate_complexity(code)
    assert result == "O(n log n)"


def test_exponential_recursion_still_detected():
    code = "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
    result = complexity.estimate_complexity(code)
    assert result == "O(2^n)"