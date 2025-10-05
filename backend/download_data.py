"""
Script to download real exoplanet data from NASA Exoplanet Archive.
This downloads the Kepler Cumulative KOI table for training the model.
"""

import requests
import pandas as pd
import os

def download_kepler_data(output_path='data/kepler_data.csv'):
    """
    Download Kepler exoplanet data from NASA Exoplanet Archive.
    """
    print("Downloading Kepler data from NASA Exoplanet Archive...")
    
    # NASA Exoplanet Archive API endpoint for Kepler cumulative table
    base_url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    
    # ADQL query to get relevant columns
    query = """
    SELECT 
        koi_period, koi_time0bk, koi_impact, koi_duration,
        koi_depth, koi_prad, koi_teq, koi_insol,
        koi_model_snr, koi_steff, koi_slogg, koi_srad,
        koi_disposition
    FROM cumulative
    WHERE koi_period IS NOT NULL
        AND koi_time0bk IS NOT NULL
        AND koi_impact IS NOT NULL
        AND koi_duration IS NOT NULL
        AND koi_depth IS NOT NULL
        AND koi_prad IS NOT NULL
        AND koi_teq IS NOT NULL
        AND koi_insol IS NOT NULL
        AND koi_model_snr IS NOT NULL
        AND koi_steff IS NOT NULL
        AND koi_slogg IS NOT NULL
        AND koi_srad IS NOT NULL
        AND koi_disposition IS NOT NULL
    """
    
    params = {
        'query': query,
        'format': 'csv'
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=60)
        response.raise_for_status()
        
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save to file
        with open(output_path, 'w') as f:
            f.write(response.text)
        
        # Load and display info
        df = pd.read_csv(output_path)
        print(f"\nSuccessfully downloaded {len(df)} records")
        print(f"Saved to: {output_path}")
        print(f"\nClass distribution:")
        print(df['koi_disposition'].value_counts())
        print(f"\nSample data:")
        print(df.head())
        
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading data: {e}")
        print("\nFalling back to sample data generation...")
        return None

def download_tess_data(output_path='data/tess_data.csv'):
    """
    Download TESS exoplanet data from NASA Exoplanet Archive.
    """
    print("Downloading TESS data from NASA Exoplanet Archive...")
    
    base_url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    
    # Note: TESS uses different column names, this is a simplified example
    query = """
    SELECT 
        pl_orbper as koi_period,
        pl_tranmid as koi_time0bk,
        pl_imppar as koi_impact,
        pl_trandur as koi_duration,
        pl_trandep as koi_depth,
        pl_rade as koi_prad,
        pl_eqt as koi_teq,
        pl_insol as koi_insol,
        st_teff as koi_steff,
        st_logg as koi_slogg,
        st_rad as koi_srad,
        toi_disposition as koi_disposition
    FROM toi
    WHERE pl_orbper IS NOT NULL
        AND toi_disposition IS NOT NULL
    LIMIT 1000
    """
    
    params = {
        'query': query,
        'format': 'csv'
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=60)
        response.raise_for_status()
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w') as f:
            f.write(response.text)
        
        df = pd.read_csv(output_path)
        print(f"\nSuccessfully downloaded {len(df)} TESS records")
        print(f"Saved to: {output_path}")
        
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading TESS data: {e}")
        return None

if __name__ == "__main__":
    print("=" * 60)
    print("NASA Exoplanet Data Downloader")
    print("=" * 60)
    print()
    
    # Download Kepler data
    kepler_df = download_kepler_data()
    
    print("\n" + "=" * 60)
    print("\nNote: If download fails, the system will use synthetic data.")
    print("For production use, download data manually from:")
    print("https://exoplanetarchive.ipac.caltech.edu/")
    print("=" * 60)
