from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
import re

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

def get_contributor_data():
    finance_data = pd.read_excel('Data/CFU-Website-MASTER-Update-for-2025.xlsx', sheet_name='Pledges')
    finance_data.columns = finance_data.columns.str.strip()
    def clean_contributor(name):
        return str(name).split('(')[0].strip()
    finance_data['Contributor_clean'] = finance_data['Contributor'].apply(clean_contributor)
    contributor_deposit = finance_data.groupby('Contributor_clean', as_index=False)['Deposited (USD million current)'].sum()
    contributor_deposit = contributor_deposit.sort_values('Deposited (USD million current)', ascending=True)
    return contributor_deposit

@app.get("/api/contributors")
def contributors():
    df = get_contributor_data()
    return JSONResponse(df.to_dict(orient="records"))

@app.get("/")
def root():
    return FileResponse("static/index.html") 