import streamlit as st
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

st.title("NDC Implementation Analysis")

# --- Load Data ---
finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx')
ndc_data = pd.read_csv('Data/ndc_sdg.csv')

# --- Show Finance Data Columns and Sample Rows ---
st.subheader("Finance Data Columns")
st.write(finance_data.columns)
st.write(finance_data.head())

# --- Expanded Fund to Country Mapping (larger sample for demonstration) ---
fund_to_country = {
    'Adaptation Fund (AF)': [
        'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Benin', 'Bhutan',
        'Bolivia', 'Botswana', 'Brazil', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic',
        'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Côte d\'Ivoire', 'Cuba', 'Democratic Republic of the Congo',
        'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Ethiopia',
        'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
        'Honduras', 'India', 'Indonesia', 'Iran', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kyrgyzstan',
        'Lao People\'s Democratic Republic', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Maldives',
        'Mali', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Mongolia', 'Montenegro', 'Morocco',
        'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia',
        'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Rwanda', 'Saint Kitts and Nevis',
        'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'São Tomé and Principe', 'Senegal', 'Seychelles',
        'Sierra Leone', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname',
        'Swaziland', 'Syrian Arab Republic', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
        'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Uruguay', 'Vanuatu', 'Venezuela', 'Vietnam',
        'Yemen', 'Zambia', 'Zimbabwe'
    ],
    'Green Climate Fund (GCF-1)': [
        'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Benin', 'Bhutan',
        'Bolivia', 'Botswana', 'Brazil', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic',
        'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Côte d\'Ivoire', 'Cuba', 'Democratic Republic of the Congo',
        'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Ethiopia',
        'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
        'Honduras', 'India', 'Indonesia', 'Iran', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kyrgyzstan',
        'Lao People\'s Democratic Republic', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Maldives',
        'Mali', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Mongolia', 'Montenegro', 'Morocco',
        'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia',
        'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Rwanda', 'Saint Kitts and Nevis',
        'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'São Tomé and Principe', 'Senegal', 'Seychelles',
        'Sierra Leone', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname',
        'Swaziland', 'Syrian Arab Republic', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
        'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Uruguay', 'Vanuatu', 'Venezuela', 'Vietnam',
        'Yemen', 'Zambia', 'Zimbabwe'
    ],
    # Add more mappings as needed
}

# --- Expand Finance Data ---
expanded_finance_data = []
for fund, countries in fund_to_country.items():
    fund_data = finance_data[finance_data['Fund'] == fund]
    if not fund_data.empty:
        for country in countries:
            expanded_finance_data.append({
                'Fund': fund,
                'Country': country,
                'Disbursement (USD mn)': fund_data['Disbursement (USD mn)'].values[0]
            })
expanded_finance_df = pd.DataFrame(expanded_finance_data)

# --- Merge Data ---
merged_data = pd.merge(expanded_finance_df, ndc_data, on='Country', how='inner')

# --- Prepare Model Data ---
status_map = {'Existing': 1, 'Future': 0.5, 'Not Specified': 0, 'Increased yields and ': 0.5}
merged_data['NDC_Score'] = merged_data['Status'].map(status_map)
merged_data = merged_data.dropna(subset=['NDC_Score'])

X = merged_data[['Disbursement (USD mn)']]
y = merged_data['NDC_Score']

# --- Fit Model ---
model = LinearRegression()
model.fit(X, y)

# --- Show Results ---
st.header("Model Results")
st.write(f"Finance Data Shape: {finance_data.shape}")
st.write(f"Expanded Finance Data Shape: {expanded_finance_df.shape}")
st.write(f"Merged Data Shape: {merged_data.shape}")
st.write(f"Model Coefficient: {model.coef_[0]}")
st.write(f"Model Intercept: {model.intercept_}")

# --- Data Table ---
st.subheader("Merged Data Table")
st.dataframe(merged_data)

# --- Plot ---
fig, ax = plt.subplots()
ax.scatter(X, y, color='blue', label='Data Points')
ax.plot(X, model.predict(X), color='red', label='Regression Line')
ax.set_xlabel('Climate Finance Spending (USD mn)')
ax.set_ylabel('NDC Implementation Score')
ax.set_title('Correlation between Climate Finance Spending and NDC Implementation')
ax.legend()
st.pyplot(fig)

# --- Fund-Level Analysis ---
# Calculate average NDC score for each fund
fund_ndc = merged_data.groupby('Fund')['NDC_Score'].mean().reset_index()
fund_finance = finance_data[['Fund', 'Disbursement (USD mn)']].drop_duplicates()

# Merge to get fund-level data
fund_level = pd.merge(fund_finance, fund_ndc, on='Fund', how='inner')

# Regression at fund level
X_fund = fund_level[['Disbursement (USD mn)']]
y_fund = fund_level['NDC_Score']
model_fund = LinearRegression()
model_fund.fit(X_fund, y_fund)

st.subheader("Fund-Level Analysis")
st.write(fund_level)

fig2, ax2 = plt.subplots()
ax2.scatter(X_fund, y_fund, color='green', label='Fund Data Points')
ax2.plot(X_fund, model_fund.predict(X_fund), color='orange', label='Fund Regression Line')
ax2.set_xlabel('Fund Disbursement (USD mn)')
ax2.set_ylabel('Average NDC Implementation Score')
ax2.set_title('Fund Disbursement vs. Avg NDC Implementation')
ax2.legend()
st.pyplot(fig2) 