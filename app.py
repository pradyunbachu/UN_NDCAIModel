#Pradyun Bachu

import streamlit as st #for website
import pandas as pd #for data
import plotly.express as px #for charts

# Configure how the webpage looks
st.set_page_config(
    page_title="NDC Tracker",  # What shows in the browser tab
    page_icon="",                # The little icon in the browser tab
    layout="wide"                   # Use the full width of the screen
)

# Create the main title of your app
st.title("NDC Tracker")
# Add a subtitle/description
st.write("See how countries are doing on reducing CO2 emissions")