charconvert.py
==============

# charconvert.py
written to convert two csv files to SAIKS format

The CSV files should be character and state matrices in a format similar to that of SAIKS.

## usage

charconvert.py --help for args.

### Required arguments
* coding
    * Filename for the coding CSV file
    * CSV file should include a header
    * this script wraps all numbers in quotes
    * header: "Species name",char1,char2,char3,char4,char5
* states
    * Filename for the states CSV file
    * CSV file should include a header
    * header: [optional]"image filename","character","state1","state2","...","stateN" 
    * optionally includes a column to the left of species name for a pop-up image filename. filename should be relative to the SAIKS installation: use -i for this type.
* output
    * filename for the .js file output. Probably the same name as your saiks html file.

### Optional arguments
* -v
    * Prints the species that were removed due to wholly missing characters
* -i
    * Wraps states names in <divs> for use in the key.
