import pigpio
from robotme import app

def set_pins():
    pi = pigpio.pi()
    output_pins = app.config['GPIO_OUTPUT']
    for pin in output_pins:
        pi.write(pin, 0)
    print("All pins to 0")