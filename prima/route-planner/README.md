# Route Planner

A Python-based route planning and optimization system that includes various planning modules for fixed and variable routing scenarios.

## Features

- Fixed and variable route planning
- SKU-based bin packing optimization
- Mid-mile planning
- Sequential planning algorithms
- VRP (Vehicle Routing Problem) solutions

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install the package and its dependencies:
```bash
pip install -e .
```

## Project Structure

- `consolidated_fixed_planner.py`: Fixed route planning implementation
- `consolidated_variable_planner.py`: Variable route planning implementation
- `mid_mile_planner.py`: Mid-mile route optimization
- `optimization_ai_packing.py`: AI-based packing optimization
- `sequential_planner.py`: Sequential route planning
- `sku_fixed_bin_packing.py`: Fixed bin packing for SKUs
- `vrp_planning.py`: Vehicle Routing Problem implementation

## Usage

The project contains multiple planning modules that can be used based on your specific needs. Here's an example of how to use the basic planner:

```python
from route_planner import RoutePlanner

# Initialize the planner
planner = RoutePlanner()

# Plan routes
routes = planner.plan()
```

## Dependencies

- six==1.12.0
- pyjwt==1.7.1
- pandas==1.3.5
- openpyxl==3.0.9
- redis==3.3.8

## License

This project is proprietary software. All rights reserved.


## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/akhil235556/prima.git
    cd prima/prima/route-planner
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

    *Note: During installation, some packages like `numpy` and `scipy` might require specific versions compatible with your Python environment. The `requirements.txt` has been adjusted to allow for broader compatibility.*

## Running the Optimization Engine

1.  **Prepare Sample Data:**

    The `solver_v5_local.py` script expects input data in an Excel file. A `create_sample_data.py` script is provided to generate a sample `input.xlsx` file. Run it using:

    ```bash
    python3 create_sample_data.py
    ```

    *Note: The sample data generation script has been modified to include all necessary columns for the optimization engine to run.*

2.  **Run the Solver:**

    Execute the local solver script:

    ```bash
    python3 solver_v5_local.py
    ```

    *Note: The script has been modified to bypass the HERE API for geocoding and to save the output Excel file locally instead of uploading to Google Cloud Storage.*

## Project Structure

-   `main.py`: Main application entry point.
-   `route_planner/`: Contains the core logic for route planning.
    -   `services/`: Different planning services (e.g., `planner.py`, `fixed_planner.py`, `variable_planner.py`, `mid_mile_planner.py`).
    -   `kohler/`: Contains validation logic for bin packing and sequential mid-mile.
    -   `constants/`: Application constants and configuration.
    -   `utils/`: Utility functions (e.g., `redis_cache.py`, `distance_matrix.py`).
-   `solvers/solver_v5/solver.py`: The core optimization solver using `ortools`.
-   `solver_v5_local.py`: Script for local execution and testing.
-   `create_sample_data.py`: Script to generate sample input data.
-   `requirements.txt`: Python dependencies.

## Troubleshooting

-   **Dependency Issues:** If you encounter issues with `numpy` or `scipy` versions, try installing them without specifying the version, or refer to their official documentation for compatible versions with your Python environment.
-   **Redis Connection:** The application attempts to connect to Redis. For local testing, the `redis_cache.py` might need to be modified to bypass Redis or connect to a locally running Redis instance.
-   **API Keys:** The original code uses HERE API for geocoding and Google Cloud Storage. For local testing, these have been bypassed or modified to save files locally.



