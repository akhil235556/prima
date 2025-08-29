import os


def get(key):
    if key in os.environ.keys():
        return os.environ.get(key)

