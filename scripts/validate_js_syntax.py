import subprocess
import sys

res = subprocess.run([sys.executable, '-m', 'node', '--experimental-vm-modules', 'scripts/fast_validate_js.js'] if False else ['node', '--experimental-vm-modules', 'scripts/fast_validate_js.js'])
sys.exit(res.returncode)
