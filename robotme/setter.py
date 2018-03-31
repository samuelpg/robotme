import pigpio
from robotme import app

def set_pins():
    pi = pigpio.pi()
    output_pins = app.config['GPIO_OUTPUT']
    input_pins = app.config['GPIO_INPUT']
    for pin in output_pins:
        pi.write(pin, 0)
    for pin in input_pins:
        pi.write(pin, 0)
    print("All pins to ground")