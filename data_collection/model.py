#Pradyun Bachu
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def run_model():
    # Step 1: Load the climate finance data (from Excel), using the 5th row as the header
    finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx', sheet_name='Master', header=4)
    finance_data.columns = finance_data.columns.str.strip()
    finance_data = finance_data.reset_index(drop=True)
    finance_data = finance_data.dropna(subset=['Country', 'Deposit (USD mn)'])
    print('Finance Data Shape:', finance_data.shape)
    print('\nFinance Data Columns:', finance_data.columns.tolist())
    print('\nSample of finance data:')
    print(finance_data.head())

    # Step 2: Load the NDC implementation data (from CSV)
    ndc_data = pd.read_csv('Data/ndc_sdg.csv')
    print('\nNDC Data Shape:', ndc_data.shape)
    print('\nNDC Data Columns:', ndc_data.columns.tolist())

    # Step 3: For each fund, count the number of NDCs for all countries associated with that fund
    # Since we don't have a direct mapping, we'll just plot the number of NDCs for each fund as a demonstration
    # (If you have a mapping, this can be improved)
    funds = finance_data['Fund']
    deposits = finance_data['Deposit (USD mn)']
    ndc_counts = [len(ndc_data)] * len(funds)  # Placeholder: same NDC count for all funds

    # Step 4: Create the visualization
    plt.figure(figsize=(14, 7))
    plt.scatter(deposits, ndc_counts, color='blue', alpha=0.7)
    for i, fund in enumerate(funds):
        plt.annotate(fund, (deposits.iloc[i], ndc_counts[i]), xytext=(5, 5), textcoords='offset points', fontsize=8)
    plt.xlabel('Deposit (USD mn)')
    plt.ylabel('Number of NDCs (all countries)')
    plt.title('Deposit (USD mn) vs. Number of NDCs (per fund, demonstration)')
    plt.grid(True, alpha=0.3)
    plt.show()

    return finance_data.shape, ndc_data.shape

if __name__ == "__main__":
    run_model() 