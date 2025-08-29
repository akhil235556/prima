FROM gcr.io/services-248607/bitbucket.org/gobolt_team/python-image:1.1.5

COPY . /tms-planning/
WORKDIR /tms-planning

RUN pip3 install pip==20.1.1
RUN pip3 install -r requirements.txt

RUN python3 -m grpc_tools.protoc \
    --include_imports \
    --include_source_info \
    --descriptor_set_out=api_descriptor.pb \
    --proto_path=/googleapis \
    --proto_path=protos/health/ \
    --proto_path=protos/tms-planning/ \
    --python_out=. \
    --grpc_python_out=. \
    protos/*/*.proto

RUN python setup.py sdist

EXPOSE 8000

ENTRYPOINT ["python", "server.py"]
