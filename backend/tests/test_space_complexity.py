import analyzer.space_complexity as space_complexity


def test_no_growth_returns_constant_space():
    code = "for i in range(n):\n    print(i)"
    assert space_complexity.estimate_space_complexity(code) == "O(1)"


def test_append_in_loop_returns_linear_space():
    code = "results = []\nfor i in range(n):\n    results.append(i)"
    assert space_complexity.estimate_space_complexity(code) == "O(n)"


def test_list_comprehension_returns_linear_space():
    code = "results = [i for i in range(n)]"
    assert space_complexity.estimate_space_complexity(code) == "O(n)"