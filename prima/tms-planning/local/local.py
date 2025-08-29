import os


def set_env_variables_local():

    os.environ['DB_PG_HOST'] = '127.0.0.1'
    os.environ['DB_PG_PORT'] = '8432'
    os.environ['DB_PG_USERNAME'] = 'postgres'
    os.environ['DB_PG_PASSWORD'] = 'Nj80m5gawz0oOCzr'
    os.environ['DB_PG_DATABASE'] = 'tms-planning'

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "credentials.json"
    os.environ['GCP_PROJECT_ID'] = "services-248607"

    os.environ['TMS_PLANNING_GRPC_HOST'] = "127.0.0.1"
    os.environ['TMS_PLANNING_GRPC_PORT'] = "8000"
    os.environ['TMS_PLANNING_GRPC_WORKERS'] = "10"

    os.environ['PRIMA_API_HOST'] = "https://prima.gobolt.dev/_svc/route-planning-service/"
    os.environ['PRIMA_API_PLANNING_OUTPUT_URI'] = "v2/planning/output"


