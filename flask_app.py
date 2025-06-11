# Import required libraries
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import re
import numpy as np
import math
import csv

# Initialize Flask application with static files directory
app = Flask(__name__, static_folder='website/static')
CORS(app)

def load_data():
    """
    Load and preprocess the financial data from Excel file.
    Returns a pandas DataFrame with cleaned column names.
    """
    finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx', sheet_name='Pledges')
    finance_data.columns = finance_data.columns.str.strip()
    return finance_data

def clean_contributor(name):
    """
    Clean contributor names by removing parenthetical information.
    Example: 'Country (Region)' -> 'Country'
    """
    return re.split(r'\s*\(', str(name))[0].strip()

def clean_entries(entries):
    """
    Clean list entries by converting NaN values to None.
    Used for JSON serialization.
    """
    return [None if (isinstance(x, float) and math.isnan(x)) else x for x in entries]

@app.route('/api/raw_data')
def api_raw_data():
    """
    API endpoint to get all raw financial data.
    Returns the complete dataset as JSON.
    """
    try:
        df = load_data()
        df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/deposited_column')
def api_deposited_column():
    """
    API endpoint to get only the 'Deposited (USD million current)' column.
    Returns the column data as JSON.
    """
    try:
        df = load_data()
        if 'Deposited (USD million current)' in df.columns:
            deposited_df = df[['Deposited (USD million current)']]
            deposited_df = deposited_df.replace({np.nan: None, np.inf: None, -np.inf: None})
            return jsonify(deposited_df.to_dict(orient="records"))
        else:
            return jsonify({"error": "Column not found"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_contributor')
def api_by_contributor():
    """
    API endpoint to get total deposits grouped by contributor.
    Returns sorted list of contributors and their total deposits.
    """
    try:
        df = load_data()
        grouped = df.groupby('Contributor', as_index=False)['Deposited (USD million current)'].sum()
        grouped = grouped.sort_values('Deposited (USD million current)', ascending=True)
        grouped = grouped.replace({np.nan: None, np.inf: None, -np.inf: None})
        return jsonify(grouped.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_contributor_math')
def api_by_contributor_math():
    """
    API endpoint to get detailed contributor data including individual entries and sum calculation.
    Returns contributors with their individual deposits and the mathematical sum.
    """
    try:
        df = load_data()
        details = df.groupby('Contributor')['Deposited (USD million current)'].agg(
            Total='sum',
            Entries=lambda x: list(x)
        ).reset_index()
        details['Sum Math'] = details['Entries'].apply(
            lambda x: ' + '.join([str(v) for v in x]) + f' = {sum(x)}'
        )
        details = details.replace({np.nan: None, np.inf: None, -np.inf: None})
        details['Entries'] = details['Entries'].apply(clean_entries)
        return jsonify(details.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_contributor_clean')
def api_by_contributor_clean():
    """
    API endpoint to get total deposits grouped by cleaned contributor names.
    Similar to by_contributor but uses cleaned names without parenthetical information.
    """
    try:
        df = load_data()
        df['Contributor_clean'] = df['Contributor'].apply(clean_contributor)
        # Get all unique contributors
        all_contributors = pd.DataFrame({'Contributor_clean': df['Contributor_clean'].unique()})
        grouped = df.groupby('Contributor_clean', as_index=False)['Deposited (USD million current)'].sum()
        # Merge to ensure all contributors are present, fill missing with 0
        merged = all_contributors.merge(grouped, on='Contributor_clean', how='left')
        merged['Deposited (USD million current)'] = merged['Deposited (USD million current)'].fillna(0)
        merged = merged.sort_values('Deposited (USD million current)', ascending=True)
        merged = merged.replace({np.nan: None, np.inf: None, -np.inf: None})
        return jsonify(merged.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_contributor_clean_math')
def api_by_contributor_clean_math():
    """
    API endpoint to get detailed contributor data with cleaned names.
    Similar to by_contributor_math but uses cleaned contributor names.
    """
    try:
        df = load_data()
        df['Contributor_clean'] = df['Contributor'].apply(clean_contributor)
        details = df.groupby('Contributor_clean')['Deposited (USD million current)'].agg(
            Total='sum',
            Entries=lambda x: list(x)
        ).reset_index()
        details['Sum Math'] = details['Entries'].apply(
            lambda x: ' + '.join([str(v) for v in x]) + f' = {sum(x)}'
        )
        details = details.replace({np.nan: None, np.inf: None, -np.inf: None})
        details['Entries'] = details['Entries'].apply(clean_entries)
        return jsonify(details.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sdg_count_by_country')
def api_sdg_count_by_country():
    """
    API endpoint to get SDG (Sustainable Development Goals) count by country.
    Reads from ndc_sdg.csv and returns the number of unique SDGs per country.
    """
    try:
        # Read the CSV file
        df = pd.read_csv('Data/ndc_sdg.csv')
        # Assume columns: Country, SDG (or similar)
        # If SDG column is not present, try to infer
        country_col = 'Country' if 'Country' in df.columns else df.columns[0]
        sdg_col = 'SDG' if 'SDG' in df.columns else df.columns[-1]
        # Group by country and count unique SDGs
        grouped = df.groupby(country_col)[sdg_col].nunique().reset_index()
        grouped.columns = ['Country', 'SDG_Count']
        grouped = grouped.sort_values('SDG_Count', ascending=True)
        return jsonify(grouped.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/by_country')
def api_by_country():
    """
    API endpoint to get total deposits grouped by country.
    Returns sorted list of countries and their total deposits.
    """
    try:
        df = load_data()
        grouped = df.groupby('Country', as_index=False)['Deposited (USD million current)'].sum()
        grouped = grouped.sort_values('Deposited (USD million current)', ascending=True)
        grouped = grouped.replace({np.nan: None, np.inf: None, -np.inf: None})
        return jsonify(grouped.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_country_math')
def api_by_country_math():
    """
    API endpoint to get detailed country data including individual entries and sum calculation.
    Returns countries with their individual deposits and the mathematical sum.
    """
    try:
        df = load_data()
        details = df.groupby('Country')['Deposited (USD million current)'].agg(
            Total='sum',
            Entries=lambda x: list(x)
        ).reset_index()
        details['Sum Math'] = details['Entries'].apply(
            lambda x: ' + '.join([str(v) for v in x]) + f' = {sum(x)}'
        )
        details = details.replace({np.nan: None, np.inf: None, -np.inf: None})
        details['Entries'] = details['Entries'].apply(clean_entries)
        return jsonify(details.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_country_clean')
def api_by_country_clean():
    """
    API endpoint to get total deposits grouped by cleaned country names.
    Similar to by_country but uses cleaned names without parenthetical information.
    """
    try:
        df = load_data()
        df['Country_clean'] = df['Country'].apply(clean_contributor)
        all_countries = pd.DataFrame({'Country_clean': df['Country_clean'].unique()})
        grouped = df.groupby('Country_clean', as_index=False)['Deposited (USD million current)'].sum()
        merged = all_countries.merge(grouped, on='Country_clean', how='left')
        merged['Deposited (USD million current)'] = merged['Deposited (USD million current)'].fillna(0)
        merged = merged.sort_values('Deposited (USD million current)', ascending=True)
        merged = merged.replace({np.nan: None, np.inf: None, -np.inf: None})
        return jsonify(merged.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/by_country_clean_math')
def api_by_country_clean_math():
    """
    API endpoint to get detailed country data with cleaned names.
    Similar to by_country_math but uses cleaned country names.
    """
    try:
        df = load_data()
        df['Country_clean'] = df['Country'].apply(clean_contributor)
        details = df.groupby('Country_clean')['Deposited (USD million current)'].agg(
            Total='sum',
            Entries=lambda x: list(x)
        ).reset_index()
        details['Sum Math'] = details['Entries'].apply(
            lambda x: ' + '.join([str(v) for v in x]) + f' = {sum(x)}'
        )
        details = details.replace({np.nan: None, np.inf: None, -np.inf: None})
        details['Entries'] = details['Entries'].apply(clean_entries)
        return jsonify(details.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def root():
    """
    Root endpoint that serves the main index.html file.
    """
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050) 