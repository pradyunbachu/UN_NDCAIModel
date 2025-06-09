import pandas as pd
import numpy as np
from typing import Dict, Any
import logging

class DataProcessor:
    """
    Class for processing and cleaning collected data.
    Handles data preprocessing, feature engineering, and data quality checks.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def clean_ndc_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean and preprocess NDC data.
        """
        try:
            if df.empty:
                return df
                
            # Remove duplicates
            df = df.drop_duplicates()
            
            # Handle missing values
            df['implementation_progress'] = df['implementation_progress'].fillna(0)
            
            # Convert categorical variables
            df['ndc_status'] = pd.Categorical(df['ndc_status'])
            
            return df
        except Exception as e:
            self.logger.error(f"Error cleaning NDC data: {str(e)}")
            raise

    def clean_economic_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean and preprocess economic data.
        """
        try:
            if df.empty:
                return df
                
            # Remove duplicates
            df = df.drop_duplicates()
            
            # Handle missing values
            numeric_columns = ['gdp', 'gdp_growth', 'renewable_energy_investment']
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].fillna(df[col].mean())
            
            return df
        except Exception as e:
            self.logger.error(f"Error cleaning economic data: {str(e)}")
            raise

    def clean_environmental_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Clean and preprocess environmental data.
        """
        try:
            if df.empty:
                return df
                
            # Remove duplicates
            df = df.drop_duplicates()
            
            # Handle missing values
            numeric_columns = ['co2_emissions', 'renewable_energy_share', 'forest_coverage']
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].fillna(df[col].mean())
            
            return df
        except Exception as e:
            self.logger.error(f"Error cleaning environmental data: {str(e)}")
            raise

    def merge_datasets(self, data_dict: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """
        Merge all datasets into a single DataFrame for model training.
        """
        try:
            if not data_dict:
                return pd.DataFrame()
                
            # Start with NDC data as the base
            merged_df = data_dict['ndc'].copy()
            
            # Merge economic data
            if not data_dict['economic'].empty:
                merged_df = pd.merge(
                    merged_df,
                    data_dict['economic'],
                    on=['country_code', 'year'],
                    how='left'
                )
            
            # Merge environmental data
            if not data_dict['environmental'].empty:
                merged_df = pd.merge(
                    merged_df,
                    data_dict['environmental'],
                    on=['country_code', 'year'],
                    how='left'
                )
            
            return merged_df
        except Exception as e:
            self.logger.error(f"Error merging datasets: {str(e)}")
            raise

    def process_all_data(self, data_dict: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """
        Process all collected data through the pipeline.
        """
        try:
            # Clean each dataset
            cleaned_data = {
                'ndc': self.clean_ndc_data(data_dict['ndc']),
                'economic': self.clean_economic_data(data_dict['economic']),
                'environmental': self.clean_environmental_data(data_dict['environmental'])
            }
            
            # Merge all datasets
            processed_data = self.merge_datasets(cleaned_data)
            
            return processed_data
        except Exception as e:
            self.logger.error(f"Error processing all data: {str(e)}")
            raise 