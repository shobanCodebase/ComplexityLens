from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_valid_python_code():
    response = client.post("/analyze", json={
        "code": "for i in range(n):\n    print(i)",
        "language": "python",
        "input_size": 1000,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["complexity"] == "O(n)"
    assert data["operation_count"] > 0
    assert "growth_data" in data
    assert len(data["growth_data"]) == 5


def test_analyze_invalid_syntax_returns_400_not_500():
    # Regression test: this used to crash with an unhandled 500
    # before we added try/except SyntaxError -> HTTPException(400)
    response = client.post("/analyze", json={
        "code": "// this is JavaScript, not Python",
        "language": "javascript",
        "input_size": 1000,
    })
    assert response.status_code == 400
    assert "detail" in response.json()


def test_analyze_missing_field_returns_422():
    # Missing "language" field entirely -- Pydantic should reject this
    response = client.post("/analyze", json={
        "code": "x = 5",
        "input_size": 1000,
    })
    assert response.status_code == 422


def test_analyze_empty_code():
    response = client.post("/analyze", json={
        "code": "",
        "language": "python",
        "input_size": 1000,
    })
    # Empty string is syntactically valid Python (just does nothing)
    assert response.status_code == 200
    data = response.json()
    assert data["complexity"] == "O(1)"


def test_compare_isolates_errors_per_item():
    response = client.post("/compare", json={
        "items": [
            {"name": "Good", "language": "python", "code": "x = 5"},
            {"name": "Bad", "language": "javascript", "code": "// broken"},
        ],
        "input_size": 1000,
    })
    assert response.status_code == 200
    results = response.json()["results"]
    assert results[0]["success"] is True
    assert results[1]["success"] is False
    assert results[1]["error"] is not None