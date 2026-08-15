import analyzer.operation_counter as operation_counter


def test_straight_line_code_counts_correctly():
    code = """
x = 5
y = x + 3
if y > 10:
    z = y - 1
"""
    result = operation_counter.count_operations(code, input_size=1)
    assert result["comparisons"] == 1
    assert result["assignments"] == 3
    assert result["arithmetic"] == 2
    assert result["function_calls"] == 0


def test_loop_scales_with_input_size():
    code = "for i in range(n):\n    x = i + 1"
    result = operation_counter.count_operations(code, input_size=1000)
    assert result["assignments"] == 1000
    assert result["arithmetic"] == 1000
    assert result["function_calls"] == 1  # the range(n) call itself, counted once


def test_while_loop_does_not_crash():
    # Regression test: this exact code previously raised
    # AttributeError: 'While' object has no attribute 'iter'
    # because _count_recursive assumed both For and While nodes have .iter.
    code = "while True:\n    pass"
    result = operation_counter.count_operations(code, input_size=1000)
    # We don't care about exact values here -- just that it runs without crashing
    assert isinstance(result, dict)
    assert "comparisons" in result
    assert "assignments" in result
    assert "arithmetic" in result
    assert "function_calls" in result

def test_hardcoded_constant_loop_does_not_scale_with_input_size():
    # A loop bound by a literal constant should NOT scale with input_size,
    # even if input_size is large -- this distinguishes "loop count in the
    # code" from "the input_size parameter", which are independent concepts.
    code = "total = 0\nfor i in range(1000000):\n    total += i\nprint(total)"
    result = operation_counter.count_operations(code, input_size=1000000)
    total_ops = sum(result.values())
    assert total_ops < 100  # should NOT be anywhere near 1,000,000+