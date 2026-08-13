import subprocess
import tempfile
import os
import sys

WRAPPER_TEMPLATE = """
import time
import resource

__start_time = time.time()

{user_code}

__end_time = time.time()
__peak_memory_kb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
print(f"__EXECUTION_TIME_MS__:{{(__end_time - __start_time) * 1000}}")
print(f"__PEAK_MEMORY_KB__:{{__peak_memory_kb}}")
"""

MEMORY_LIMIT_BYTES = 128 * 1024 * 1024  # 128MB
CPU_LIMIT_SECONDS = 5


def _apply_limits():
    """Runs inside the child process, before the user's code executes."""
    import resource
    resource.setrlimit(resource.RLIMIT_CPU, (CPU_LIMIT_SECONDS, CPU_LIMIT_SECONDS))
    resource.setrlimit(resource.RLIMIT_AS, (MEMORY_LIMIT_BYTES, MEMORY_LIMIT_BYTES))


def parse_sandbox_output(stdout: str) -> dict:
    execution_time_ms = None
    memory_usage_mb = None

    for line in stdout.splitlines():
        if line.startswith("__EXECUTION_TIME_MS__:"):
            execution_time_ms = float(line.split(":", 1)[1])
        elif line.startswith("__PEAK_MEMORY_KB__:"):
            peak_memory_kb = float(line.split(":", 1)[1])
            memory_usage_mb = peak_memory_kb / 1024

    return {
        "execution_time_ms": execution_time_ms,
        "memory_usage_mb": memory_usage_mb,
    }


def run_in_sandbox(code: str, timeout_seconds: int = 5) -> dict:
    if sys.platform == "win32":
        raise RuntimeError(
            "sandbox_subprocess is only supported on Unix/Linux systems (used for hosted deployment)."
        )

    wrapped_code = WRAPPER_TEMPLATE.format(user_code=code)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(wrapped_code)
        temp_path = f.name

    try:
        result = subprocess.run(
            ["python3", temp_path],
            preexec_fn=_apply_limits,
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
        )
        returncode = result.returncode
        stdout = result.stdout
        stderr = result.stderr
        timed_out = False

    except subprocess.TimeoutExpired as e:
        returncode = -1
        stdout = e.stdout.decode() if e.stdout else ""
        stderr = e.stderr.decode() if e.stderr else ""
        timed_out = True

    finally:
        os.remove(temp_path)

    timing_data = parse_sandbox_output(stdout)

    return {
        "stdout": stdout,
        "stderr": stderr,
        "exit_code": returncode,
        "timed_out": timed_out,
        "oom_killed": returncode == -9,  # SIGKILL from hitting RLIMIT_AS
        "execution_time_ms": timing_data["execution_time_ms"],
        "memory_usage_mb": timing_data["memory_usage_mb"],
    }