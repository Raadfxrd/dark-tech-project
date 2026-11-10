from machine import Pin, PWM
import time

led = Pin("LED", Pin.OUT)
servo = PWM(Pin(0))
servo.freq(50)

servo.duty_u16(int(1.5 / 20 * 65535))  # stil
time.sleep(1)

servo.duty_u16(int(1.0 / 20 * 65535))  # draaien
led.on()  # ledje aan = servo hoort te draaien

while True:
    time.sleep(1)