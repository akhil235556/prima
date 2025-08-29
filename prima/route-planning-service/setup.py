from setuptools import setup

setup(
      name='route-planning-service',
      version='1.0',
      description='Python Distribution Utilities',
      author='',
      install_requires=[
            'Flask==1.1.1',
            'gunicorn==19.9.0',
            'six==1.12.0',
            'pyjwt==1.7.1',
            'flask-marshmallow==0.10.1',
            'pandas==1.3.5',
            'openpyxl==3.0.9',
      ],
      python_requires='>=3.7.0'
)
