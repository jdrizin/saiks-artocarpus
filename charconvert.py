#!/usr/bin/python
#this script should read in a few files and spit out a useful SAIKS js file
#you can see an example on https://github.com/jdrizin/saiks

#this script takes 3 arguments on the command line,

#i'm using re.sub and argparse
import re
import argparse

parser = argparse.ArgumentParser(description='Process coding and state CSV files into SAIKS/SLIKS format, stripping uncoded species and converting unknown character values into wildcards')
parser.add_argument("coding", help="filename for the coding CSV file")
parser.add_argument("states", help="filename for the state CSV file")
parser.add_argument("output", help="output filename")
args = parser.parse_args()

#read in the files, strip newlines, remove header
coding = [line.strip() for line in open(args.coding)]
states = [line.strip() for line in open(args.states)]
del coding[0]
del states[0]

#strip out 'blank' codes, missing characters break SAIKS
cleancoding = [x for x in coding if not (',,,' in x)]
cleanercoding = [re.sub('"-"', '"?"', s) for s in states]
#remove trailing commas
cleanstates = [re.sub(',+$', '', s) for s in states]

#define some saiks variables
# var binary - setting this to 0 allows multistate variables
varbin = "var binary = false;"

#char strings for the first js variable - append state data
varchars = 'var chars = [[ "Scientific name"],\n'

#append coding data
varitems = 'var items = [ [""],\n'

#wrap the csv lines in [],\n;
wcoding = ["[" + s + "],\n" for s in cleanercoding]
wstates = ["[" + s + "],\n" for s in cleanstates]

#replace ,\n in the last element with ];, the closing phrase
wcoding[-1] = re.sub(',\\n', '];', wcoding[-1])
wstates[-1] = re.sub(',\\n', '];', wstates[-1])

#output everything
output = (varbin + "\n\n" +
          varchars + ''.join(str(elem) for elem in wstates) + "\n\n" +
          varitems + ''.join(str(elem) for elem in wcoding))

#write out a text file
print "converted to SAIKS format!"
text_file = open(args.output, "w")
text_file.write(output)
text_file.close
