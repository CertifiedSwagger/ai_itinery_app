import csv
from pathlib import Path

def extract_unique_countries(input_file, output_file):
    """
    Extract unique countries from a CSV file of world cities and save to a new CSV.
    
    Args:
        input_file (str): Path to the input CSV file containing world cities data
        output_file (str): Path to save the output CSV file with unique countries
    """
    # Check if the input file exists
    if not Path(input_file).exists():
        print(f"Error: Input file '{input_file}' not found.")
        return
    
    # Set to store unique countries
    unique_countries = set()
    
    try:
        with open(input_file, 'r', encoding='utf-8') as csv_file:
            # Read the CSV with headers
            reader = csv.DictReader(csv_file)
            
            # Extract the country from each row
            for row in reader:
                if 'country' in row:
                    unique_countries.add(row['country'])
    
    except Exception as e:
        print(f"Error reading the input file: {e}")
        return
    
    # Write unique countries to output file
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(['country'])  # Header
            
            # Sort countries alphabetically for better readability
            sorted_countries = sorted(unique_countries)
            
            for country in sorted_countries:
                writer.writerow([country])
                
        print(f"Successfully extracted {len(unique_countries)} unique countries to {output_file}")
        print(f"Countries found: {', '.join(sorted_countries)}")
        
    except Exception as e:
        print(f"Error writing to output file: {e}")

if __name__ == "__main__":
    input_file = "src/app/api/cities/worldcitiescsv.csv"
    output_file = "src/app/api/cities/unique_countries.csv"
    extract_unique_countries(input_file, output_file)