import qrcode
from PIL import Image

def qr(address):
    img = qrcode.make(address)

    return img


