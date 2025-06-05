import streamlit as st
import pandas as pd
import plotly.express as px

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