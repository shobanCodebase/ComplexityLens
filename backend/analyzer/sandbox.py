import subprocess
import tempfile
import os
import time


WRAPPER_TEMPLATE = """
import time
import resource

__start_time = time.perf_counter()
{user_code}

__end_time = time.perf_counter()
__peak_memory_kb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
print(f"__EXECUTION_TIME_MS__:{{(__end_time - __start_time) * 1000}}")
print(f"__PEAK_MEMORY_KB__:{{__peak_memory_kb}}")
"""


def parse_sandbox_output(stdout: str) -> dict:
    execution_time_ms = None
    memory_usage_mb = None

    for line in stdout.splitlines():
        if line.startswith("__EXECUTION_TIME_MS__:"):
            value_str = line.split(":", 1)[1]
            execution_time_ms = float(value_str)
        elif line.startswith("__PEAK_MEMORY_KB__:"):
            value_str = line.split(":", 1)[1]
            peak_memory_kb = float(value_str)
            memory_usage_mb = peak_memory_kb / 1024

    return {
        "execution_time_ms": execution_time_ms,
        "memory_usage_mb": memory_usage_mb,
    }


def run_in_sandbox(code: str, timeout_seconds: int = 5) -> dict:
    wrapped_code = WRAPPER_TEMPLATE.format(user_code=code)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(wrapped_code)
        temp_path = f.name

    try:
        docker_command = [
            "docker", "run", "--rm",
            "--network", "none",
            "--memory", "128m",
            "--cpus", "0.5",
            "-v", f"{temp_path}:/app/code.py",
            "python:3.12-slim",
            "timeout", str(timeout_seconds),
            "python", "/app/code.py",
        ]

        result = subprocess.run(
            docker_command,
            capture_output=True,
            text=True,
        )

        timed_out = result.returncode == 124
        oom_killed = result.returncode == 137

        timing_data = parse_sandbox_output(result.stdout)

        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
            "timed_out": timed_out,
            "oom_killed": oom_killed,
            "execution_time_ms": timing_data["execution_time_ms"],
            "memory_usage_mb": timing_data["memory_usage_mb"],
        }

    finally:
        os.remove(temp_path)


if __name__ == "__main__":
    print(run_in_sandbox("print('hello from real sandbox function')"))
    print(run_in_sandbox("x = sum(range(1000000))\nprint('done summing')"))
    print(run_in_sandbox("while True: pass"))