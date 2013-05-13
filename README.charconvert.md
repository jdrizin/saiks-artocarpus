charconvert.py
==============

Convert two CSV files in a simple template to SAIKS format

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

## Input file setup

You can find some example files in the example/ directory. Headers get stripped in the script. The states.csv has images, so pass -i to the script.

make sure that all text fields are quoted (this is an option in Excel and LibreOffice)

### Coding
The species coding file should contain the species name and numeric character codes, eg:

```"species","leaf type","leaf arrangement","flower color"
"echinacea",1,3,6
"common columbine",2,1,1```

### States

The character states file should contain the character name and the names of the states in ascending numeric (coding) order. Prepending an image field is optional, and the field will be converted only if it exists, so it's fine to not have an image for a state.

```"image","character","state1","state2","state3"
"images/leaftypes.jpg","leaf type","simple","compound"
"images/leafarrangement.jpg","leaf arrangement","alternate","opposite","basal"
,"flower color","red","orange","yellow","green","blue","purple"```