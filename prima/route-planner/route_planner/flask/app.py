from flask import Flask, render_template, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from route_planner.services.planner import RoutePlanner
from route_planner.services.fixed_planner import FixedRoutePlanner
from route_planner.services.variable_planner import VariableRoutePlanner
from route_planner.services.mid_mile_planner import MidMilePlanner
import pandas as pd
from io import BytesIO

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'json', 'xlsx', 'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/download-template')
def download_template():
    # Create sample data
    data = {
        'Order ID': ['ORD001', 'ORD002', 'ORD003'],
        'Delivery Address': [
            '123 Main St, Delhi, India',
            '456 Park Ave, Mumbai, India',
            '789 Lake Rd, Bangalore, India'
        ],
        'Latitude': [28.6139, 19.0760, 12.9716],
        'Longitude': [77.2090, 72.8777, 77.5946],
        'Package Weight (kg)': [5.5, 3.2, 7.8],
        'Time Window Start': ['09:00', '10:00', '14:00'],
        'Time Window End': ['12:00', '13:00', '17:00'],
        'Priority': ['High', 'Medium', 'Low']
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Create Excel writer object
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Orders', index=False)
        
        # Get the worksheet
        worksheet = writer.sheets['Orders']
        
        # Add column descriptions in a new sheet
        descriptions = pd.DataFrame({
            'Column Name': list(data.keys()),
            'Description': [
                'Unique identifier for the order',
                'Complete delivery address including city and country',
                'Delivery location latitude',
                'Delivery location longitude',
                'Weight of the package in kilograms',
                'Earliest delivery time (24-hour format)',
                'Latest delivery time (24-hour format)',
                'Delivery priority (High/Medium/Low)'
            ],
            'Format/Units': [
                'Text (e.g., ORD001)',
                'Text',
                'Decimal degrees',
                'Decimal degrees',
                'Numeric (kg)',
                'HH:mm (24-hour)',
                'HH:mm (24-hour)',
                'Text'
            ]
        })
        descriptions.to_excel(writer, sheet_name='Instructions', index=False)
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='route_planner_template.xlsx'
    )

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        planner_type = request.form.get('planner', 'fixed')
        
        # Initialize the appropriate planner
        if planner_type == 'fixed':
            planner = FixedRoutePlanner()
        elif planner_type == 'variable':
            planner = VariableRoutePlanner()
        else:
            planner = MidMilePlanner()
        
        try:
            output_file = os.path.join(app.config['UPLOAD_FOLDER'], 'results.csv')
            routes = planner.plan(input_file=filepath, output_file=output_file)
            
            return jsonify({
                'success': True,
                'message': f'Successfully planned routes using {planner_type} planner',
                'routes': routes
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/scenario-settings')
def scenario_settings():
    strategies = {
        'fixed': {
            'name': 'Fixed Route Planning',
            'description': 'Optimize routes with fixed delivery points and schedules'
        },
        'variable': {
            'name': 'Variable Route Planning',
            'description': 'Dynamic route optimization based on real-time demand'
        },
        'mid_mile': {
            'name': 'Mid-Mile Planning',
            'description': 'Optimize routes between distribution centers and delivery hubs'
        }
    }
    return render_template('scenario_settings.html', strategies=strategies)

if __name__ == '__main__':
    app.run(debug=True) 