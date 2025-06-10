import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# Removed custom CSS block for dark background

st.markdown(
    """
    <style>
    body, .stApp {
        background-color: #111 !important;
        color: #fff !important;
    }
    .stApp {
        background-color: #111 !important;
    }
    .css-18e3th9, .css-1d391kg, .css-1cpxqw2, .css-ffhzg2, .css-1v0mbdj, .css-1dp5vir, .css-1lcbmhc {
        background-color: #111 !important;
        color: #fff !important;
    }
    .stDataFrame, .stTable, .stMarkdown, .stText, .stSubheader, .stHeader, .stTitle, .stCaption, .stPlotlyChart, .stAltairChart, .stVegaLiteChart, .stPyplotChart {
        color: #fff !important;
    }
    .stDataFrame table {
        color: #fff !important;
        background-color: #222 !important;
    }
    .stDataFrame th, .stDataFrame td {
        color: #fff !important;
        background-color: #222 !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.title("Deposited (USD million current) Analysis")

# --- Load Data ---
finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx', sheet_name='Pledges')
finance_data.columns = finance_data.columns.str.strip()
st.subheader("All Deposited (USD million current) Data")
st.dataframe(finance_data)

# --- Create new DataFrame with just the Deposited (USD million current) column ---
if 'Deposited (USD million current)' in finance_data.columns:
    deposited_df = finance_data[['Deposited (USD million current)']].copy()
    st.subheader("Deposited (USD million current) Data")
    st.write(deposited_df)

    # --- Plot ---
    st.subheader("Distribution of Deposited (USD million current)")
    fig, ax = plt.subplots()
    ax.hist(deposited_df['Deposited (USD million current)'].dropna(), bins=20, color='skyblue', edgecolor='black')
    ax.set_xlabel('Deposited (USD million current)')
    ax.set_ylabel('Frequency')
    ax.set_title('Distribution of Deposited (USD million current)')
    st.pyplot(fig)

    # --- Plot: Total Deposited (USD million current) by Contributor ---
    st.subheader("Total Deposited (USD million current) by Contributor")
    contributor_deposit = finance_data.groupby('Contributor', as_index=False)['Deposited (USD million current)'].sum()
    contributor_deposit = contributor_deposit.sort_values('Deposited (USD million current)', ascending=True)
    fig_contributor, ax_contributor = plt.subplots(figsize=(12, 6))
    ax_contributor.bar(contributor_deposit['Contributor'], contributor_deposit['Deposited (USD million current)'], color='seagreen')
    ax_contributor.set_xlabel('Contributor')
    ax_contributor.set_ylabel('Total Deposited (USD million current)')
    ax_contributor.set_title('Total Deposited (USD million current) by Contributor')
    plt.xticks(rotation=90, fontsize=8)
    st.pyplot(fig_contributor)

    # --- Table: Total Deposited (USD million current) by Contributor (with math) ---
    contributor_deposit_details = finance_data.groupby('Contributor')['Deposited (USD million current)'].agg(
        Total='sum',
        Entries=lambda x: list(x)
    ).reset_index()
    contributor_deposit_details['Sum Math'] = contributor_deposit_details['Entries'].apply(
        lambda x: ' + '.join([str(v) for v in x]) + f' = {sum(x)}'
    )
    st.subheader("Table: Total Deposited (USD million current) by Contributor (with math)")
    st.dataframe(contributor_deposit_details[['Contributor', 'Entries', 'Sum Math', 'Total']])
else:
    st.error("Column 'Deposited (USD million current)' not found in the data. Please check the column name.") 