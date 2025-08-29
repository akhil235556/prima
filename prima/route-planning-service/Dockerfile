FROM gcr.io/services-248607/bitbucket.org/gobolt_team/python-image:1.1.5
RUN apt-get update --allow-releaseinfo-change
RUN apt-get -y install gcc
RUN apt-get install -y python3-dev

WORKDIR /route-planning-service

COPY . /route-planning-service

RUN apt-get update -y && apt-get install -y gcc
RUN apt-get install -y python3-dev
RUN pip3 install -r requirements.txt
RUN mkdir -p tmp
EXPOSE 8000
ENTRYPOINT ["sh", "entrypoint.sh"]
