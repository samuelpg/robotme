import time
import sys

def printf(x):
    print(x)
    sys.stdout.flush()

x = ['Hello', 'from', 'server']

try:
    for string in range(1,5):
        printf(string)
        time.sleep(1)
finally:
    printf("done")

