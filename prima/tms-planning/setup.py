import os

from setuptools import setup, find_packages

os.chdir('.')
modules = [filename.replace('.py', '') for filename in os.listdir('.') if 'pb2' in filename]

setup(
      name='tms-planning',
      version='1.0',
      description='Python Distribution Utilities',
      author='',
      install_requires=[
            'grpcio==1.27.2',
            'grpcio-tools==1.27.2',
            'protobuf==3.11.3'
      ],
      packages=find_packages('.'),
      py_modules=modules,
      python_requires='>=3.7.0'
)
