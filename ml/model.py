import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

def run_model():
    # Return dummy values for demonstration
    finance_data_shape = (0, 0)
    expanded_finance_data_shape = (0, 0)
    merged_data_shape = (0, 0)
    model_coefficient = 0.0
    model_intercept = 0.0
    return finance_data_shape, expanded_finance_data_shape, merged_data_shape, model_coefficient, model_intercept

def run_model():
    # Step 1: Load the climate finance data (from Excel)
    finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx')
    print('Finance Data Shape:', finance_data.shape)

    # Step 2: Load the NDC implementation data (from CSV)
    ndc_data = pd.read_csv('Data/ndc_sdg.csv')
    print('NDC Data Shape:', ndc_data.shape)

    # Step 3: Manually map funds to countries
    # This dictionary maps each fund to a list of associated countries
    fund_to_country = {
        'Adaptation Fund (AF)': ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Côte d\'Ivoire', 'Cuba', 'Democratic Republic of the Congo', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Maldives', 'Mali', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'São Tomé and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Syrian Arab Republic', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Uruguay', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'],
        'Green Climate Fund (GCF-1)': ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Côte d\'Ivoire', 'Cuba', 'Democratic Republic of the Congo', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kyrgyzstan', 'Lao People\'s Democratic Republic', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Maldives', 'Mali', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'São Tomé and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Syrian Arab Republic', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Uruguay', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'],
        # Add more mappings as needed
    }

    # Step 4: Expand the finance data by mapping funds to countries
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
    print('Expanded Finance Data Shape:', expanded_finance_df.shape)

    # Step 5: Merge the expanded finance data with the NDC data on the 'Country' column
    merged_data = pd.merge(expanded_finance_df, ndc_data, on='Country', how='inner')
    print('Merged Data Shape:', merged_data.shape)

    # Step 6: Define the target variable (NDC implementation rate)
    # We'll use the 'Status' column as a proxy for NDC completion
    # Convert 'Status' into a numeric score based on the actual values
    status_map = {'Existing': 1, 'Future': 0.5, 'Not Specified': 0, 'Increased yields and ': 0.5}
    merged_data['NDC_Score'] = merged_data['Status'].map(status_map)

    # Drop rows with NaN values in the NDC_Score column
    merged_data = merged_data.dropna(subset=['NDC_Score'])

    # Step 7: Define the feature (climate finance spending)
    # We'll use 'Disbursement (USD mn)' as the feature
    X = merged_data[['Disbursement (USD mn)']]
    y = merged_data['NDC_Score']

    # Step 8: Build a simple linear regression model
    model = LinearRegression()
    model.fit(X, y)

    # Step 9: Print the model's coefficient and intercept
    print('Model Coefficient:', model.coef_[0])
    print('Model Intercept:', model.intercept_)

    # Step 10: Visualize the relationship
    plt.scatter(X, y, color='blue', label='Data Points')
    plt.plot(X, model.predict(X), color='red', label='Regression Line')
    plt.xlabel('Climate Finance Spending (USD mn)')
    plt.ylabel('NDC Implementation Score')
    plt.title('Correlation between Climate Finance Spending and NDC Implementation')
    plt.legend()
    plt.show()

    # Return the model results
    return finance_data.shape, expanded_finance_df.shape, merged_data.shape, model.coef_[0], model.intercept_ 