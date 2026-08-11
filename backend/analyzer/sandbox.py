import subprocess
import tempfile
import os


def run_in_sandbox(code: str, timeout_seconds: int = 5) -> dict:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(code)
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

        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode,
            "timed_out": timed_out,
            "oom_killed": oom_killed,
        }

    finally:
        os.remove(temp_path)


if __name__ == "__main__":
    print(run_in_sandbox("print('hello from real sandbox function')"))
    print(run_in_sandbox("while True: pass"))
    print(run_in_sandbox("x = bytearray(500 * 1024 * 1024)"))