FROM gcr.io/services-248607/bitbucket.org/gobolt_team/python-image:1.1.5

RUN apt-get update --allow-releaseinfo-change
RUN apt-get -y install gcc
RUN apt-get install -y python3-dev

COPY . /route-planner
WORKDIR /route-planner

RUN pip3 install -r route_planner/requirements.txt

RUN python setup.py sdist

ENTRYPOINT ["python", "consumer.py"]
