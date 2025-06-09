# This is the main application file that sets up the Flask server and API endpoints
# It integrates the data collection and processing modules to provide data access

from flask import Flask, render_template
from ml.model import run_model

app = Flask(__name__)

@app.route('/')
def index():
    # Run the model and get results
    finance_data_shape, expanded_finance_data_shape, merged_data_shape, model_coefficient, model_intercept = run_model()
    return render_template('index.html',
                         finance_data_shape=finance_data_shape,
                         expanded_finance_data_shape=expanded_finance_data_shape,
                         merged_data_shape=merged_data_shape,
                         model_coefficient=model_coefficient,
                         model_intercept=model_intercept)

if __name__ == '__main__':
    app.run(debug=True)  # Start the Flask server in debug mode

