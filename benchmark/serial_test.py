import serial
import threading
import time
import binascii

ser = serial.Serial('/dev/ttyUSB0')
print(ser.name) 

def recv(name):
  while 1:
    print('recving====')
    print(binascii.hexlify(ser.read(1)))


def send(name):
  while 1:
    wrote = ser.write(binascii.unhexlify('f0ff100001f7'))
    print(wrote)
    time.sleep(0.001)

threading.Thread(target=recv,args=(u'',)).start()

send('')
