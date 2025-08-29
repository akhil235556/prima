from setuptools import setup, find_packages

setup(
      name='route-planner',
      version='1.0',
      description='Python Distribution Utilities',
      author='',
      install_requires=[
            'six==1.12.0',
            'pyjwt==1.7.1',
            'pandas==1.3.5',
            'openpyxl==3.0.9',
            'redis==3.3.8'
      ],
      packages=find_packages('.'),
      python_requires='>=3.7.0'
)
